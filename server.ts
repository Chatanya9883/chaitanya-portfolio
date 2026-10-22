import fs from 'fs';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');
const DATA_DIR = path.resolve(__dirname, 'data');
const STATE_FILE_PATH = path.resolve(DATA_DIR, 'portfolio-state.json');

// Ensure permanent memory directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function saveBase64ImageToDisk(base64Data: string, preferredId?: string): string | null {
  try {
    if (!base64Data || typeof base64Data !== 'string') return null;
    if (!base64Data.startsWith('data:image/')) return base64Data; // Already static URL

    const match = base64Data.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    let ext = 'webp';
    let rawBase64 = base64Data;

    if (match) {
      const mime = match[1].toLowerCase();
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
      else if (mime.includes('svg')) ext = 'svg';
      else if (mime.includes('gif')) ext = 'gif';
      else ext = 'webp';
      rawBase64 = match[2];
    }

    const fileId = (preferredId || `artwork-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`)
      .replace(/[^a-zA-Z0-9-_]/g, '_');
    const fileName = `${fileId}.${ext}`;
    const filePath = path.resolve(UPLOADS_DIR, fileName);

    const buffer = Buffer.from(rawBase64, 'base64');
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${fileName}`;
  } catch (err) {
    console.error('Failed to save base64 image to disk:', err);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Support large base64 image uploads for permanent high-res saving
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve permanent uploaded image files directly
  app.use('/uploads', express.static(UPLOADS_DIR));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ 
      status: 'ok', 
      permanentMemory: true,
      timestamp: new Date().toISOString() 
    });
  });

  // Permanent Storage: Upload & Persist Single Image to Server Disk
  app.post('/api/upload/image', (req, res) => {
    try {
      const { imageBase64, id, fileName } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'imageBase64 is required' });
      }

      const diskUrl = saveBase64ImageToDisk(imageBase64, id || fileName);
      if (!diskUrl) {
        return res.status(500).json({ error: 'Failed to write image to permanent disk storage' });
      }

      return res.json({ success: true, url: diskUrl });
    } catch (err) {
      console.error('Error saving image to disk in /api/upload/image:', err);
      return res.status(500).json({ error: 'Failed to save image to permanent storage' });
    }
  });

  // Permanent Storage: Read Portfolio State from Server Disk
  app.get('/api/portfolio/state', (_req, res) => {
    try {
      if (fs.existsSync(STATE_FILE_PATH)) {
        const content = fs.readFileSync(STATE_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(content);
        return res.json({ success: true, state: parsed });
      }
      return res.json({ success: false, state: null });
    } catch (err) {
      console.error('Error reading /api/portfolio/state:', err);
      return res.status(500).json({ error: 'Failed to read permanent portfolio state' });
    }
  });

  // Permanent Storage: Write Complete Portfolio State & Images to Server Disk
  app.post('/api/portfolio/save', (req, res) => {
    try {
      const incomingState = req.body.state || req.body;
      if (!incomingState) {
        return res.status(400).json({ error: 'State is required' });
      }

      // Convert any base64 images in designCaseStudies to permanent disk files
      if (Array.isArray(incomingState.designCaseStudies)) {
        incomingState.designCaseStudies = incomingState.designCaseStudies.map((study: any) => {
          if (study.imageUrl && typeof study.imageUrl === 'string' && study.imageUrl.startsWith('data:image/')) {
            const diskUrl = saveBase64ImageToDisk(study.imageUrl, study.id);
            if (diskUrl) {
              return { ...study, imageUrl: diskUrl };
            }
          }
          return study;
        });
      }

      // Convert avatar if uploaded as base64
      if (incomingState.personalInfo?.avatarUrl?.startsWith('data:image/')) {
        const diskAvatar = saveBase64ImageToDisk(incomingState.personalInfo.avatarUrl, 'custom-avatar');
        if (diskAvatar) {
          incomingState.personalInfo.avatarUrl = diskAvatar;
        }
      }

      fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(incomingState, null, 2), 'utf-8');
      return res.json({ success: true, savedAt: new Date().toISOString(), state: incomingState });
    } catch (err) {
      console.error('Error saving /api/portfolio/save:', err);
      return res.status(500).json({ error: 'Failed to write portfolio state to permanent storage' });
    }
  });

  // AI Artwork Scanner & Autofill Endpoint
  app.post('/api/artwork/scan', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/png', fileName = '' } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'Image data (imageBase64) is required.' });
      }

      // Strip data URL scheme if included
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

      // Helper function to build intelligent heuristic fallback when needed
      const buildDynamicFallback = (rawName: string) => {
        const cleanName = (rawName || 'CREATIVE ARTWORK')
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .trim();
        const upper = cleanName.toUpperCase();
        const lower = cleanName.toLowerCase();

        let category = 'Posters & Social Media';
        let svgVisualType = 'poster';
        let role = 'Lead Graphic Designer & Typographer';
        let software = ['Adobe Illustrator', 'Photoshop', 'Figma'];
        let deliverables = ['Print Exhibition Poster', 'Digital Key Visuals', 'Typography System'];
        let brief = `A comprehensive creative work titled "${upper}", crafted with deliberate typography, monochromatic balance, and precise geometric hierarchy.`;
        let direction = 'Monochromatic Metallic Brutalism & Grid Architecture';

        if (lower.includes('logo') || lower.includes('brand') || lower.includes('identity')) {
          category = 'Branding & Visual Identity';
          svgVisualType = 'brand';
          role = 'Brand Identity Designer';
          software = ['Figma', 'Adobe Illustrator'];
          deliverables = ['Logomark System', 'Brand Guidelines Spec', 'Design Tokens'];
          brief = `A disciplined visual identity exploration for "${upper}", balancing geometric logomarks, refined typography specs, and metallic monochrome palettes.`;
          direction = 'Minimalist Geometric Mark & Modern Typography';
        } else if (lower.includes('esport') || lower.includes('stream') || lower.includes('overlay') || lower.includes('bracket') || lower.includes('hud') || lower.includes('gaming')) {
          category = 'Esports & Gaming';
          svgVisualType = 'thumb';
          role = 'Esports Broadcast Designer & Tournament Artist';
          software = ['Photoshop', 'OBS Studio', 'After Effects'];
          deliverables = ['Broadcast Overlay HUD', 'Matchup Screen', 'Tournament Bracket Visuals'];
          brief = `Dynamic broadcast graphics package created for competitive gaming and streaming environments, delivering maximum contrast, player clarity, and sponsor integration.`;
          direction = 'High-Impact Cybernetic & Stream Broadcast Grid';
        } else if (lower.includes('thumb') || lower.includes('youtube') || lower.includes('banner') || lower.includes('social')) {
          category = 'Thumbnails & Digital Creatives';
          svgVisualType = 'thumb';
          role = 'Digital Creative Strategist';
          software = ['Photoshop', 'Lightroom', 'Blender'];
          deliverables = ['High-CTR Digital Creative', 'Visual Variant Tests', 'Social Assets'];
          brief = `Conversion-engineered visual creative crafted with strategic focal isolation, calculated rim lighting, and high-CTR headline typography.`;
          direction = 'High-Contrast Subject Isolation & Vibrant Typography';
        } else if (lower.includes('3d') || lower.includes('render') || lower.includes('concept') || lower.includes('art')) {
          category = 'Other Creative Work';
          svgVisualType = 'artwork';
          role = 'Visual Artist & Creative Director';
          software = ['Blender', 'Photoshop', 'Illustrator'];
          deliverables = ['Key Visuals', 'Exhibition Concept Art', 'Asset Suite'];
          brief = `Experimental creative visual investigating dimensional space, tactile textures, and dark metallic composition.`;
          direction = 'Experimental Digital Dimension & Textural Balance';
        }

        return {
          title: upper.length > 3 ? `${upper} // VISUAL SERIES` : 'CONTEMPORARY CREATIVE SERIES',
          category,
          brief,
          clientOrContext: 'Independent Creative Studio · SATI Vidisha',
          role,
          year: '2025',
          audience: 'Creative practitioners, digital media audience & tech community',
          direction,
          software,
          deliverables,
          process: [
            '1. Structural concept planning, moodboard research & compositional layout',
            '2. Vector execution, typography hierarchy & metallic contrast grading',
            '3. Production asset export across high-resolution display and print viewports'
          ],
          svgVisualType
        };
      };

      const generateParams = {
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            {
              text: `You are an elite creative director and portfolio curator for Chaitanya Jain, a graphic designer and computer science student.
Analyze this uploaded creative artwork / design image with high aesthetic precision.
${fileName ? `The original file name is: "${fileName}". You may use this as a contextual clue for project naming and scope.` : ''}

Extract any visible textual elements, titles, typography, color harmony, visual style, and layout hierarchy.
Deduce a complete, authentic portfolio case study for this artwork.

Fill in all fields thoughtfully:
1. title: Exact headline or prominent text if present on the artwork (e.g. 'SYNTHESIS // Contemporary Computing', 'AURA NEURAL', 'CYBERNETIC HORIZONS'); if no text is present, create a striking creative project title reflecting the visual composition.
2. category: Strictly pick ONE of:
   - 'Posters & Social Media' (for posters, flyers, event graphics, typography experiments, social posts)
   - 'Branding & Visual Identity' (for logos, identity systems, style guides, brand marks)
   - 'Esports & Gaming' (for tournament graphics, stream overlays, esports rosters, broadcast assets)
   - 'Thumbnails & Digital Creatives' (for YouTube thumbnails, banner graphics, high-CTR digital banners)
   - 'Other Creative Work' (for 3D renders, generative art, merchandise, miscellaneous)
3. brief: 2 to 3 detailed, professional sentences articulating the project brief, objective, compositional balance, visual hierarchy, typography, and intended impact.
4. clientOrContext: Context or client (e.g., 'Departmental Exhibition · SATI', 'Independent Creative Studio', 'Collegiate Esports League', 'Tech Brand Studio', 'Creator Partnership').
5. role: Specialized role (e.g., 'Lead Graphic Designer & Typographer', 'Brand Identity Designer', 'Broadcast Designer & Tournament Artist', 'Digital Creative Strategist').
6. year: Year shown or '2025'.
7. audience: Target demographic or audience segment.
8. direction: Concise art direction summary (e.g., 'Brutalist Monochromatic Typography & Halftones', 'High-Contrast Cybernetic Matrix', 'Minimalist Geometric Identity').
9. software: List of 3 to 4 professional tools used (e.g. ['Adobe Illustrator', 'Photoshop', 'Figma', 'InDesign']).
10. deliverables: List of 3 to 4 concrete deliverables produced (e.g. ['Print Exhibition Poster', 'Social Media Carousel', 'Typography Spec Sheet']).
11. process: List of 3 detailed sequential design steps that describe how this visual was constructed.
12. svgVisualType: Most appropriate visual style preset: 'poster', 'brand', 'social', 'thumb', or 'artwork'.`,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: {
                type: Type.STRING,
                enum: [
                  'Posters & Social Media',
                  'Branding & Visual Identity',
                  'Esports & Gaming',
                  'Thumbnails & Digital Creatives',
                  'Other Creative Work',
                ],
              },
              brief: { type: Type.STRING },
              clientOrContext: { type: Type.STRING },
              role: { type: Type.STRING },
              year: { type: Type.STRING },
              audience: { type: Type.STRING },
              direction: { type: Type.STRING },
              software: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              deliverables: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              process: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              svgVisualType: {
                type: Type.STRING,
                enum: ['poster', 'brand', 'social', 'thumb', 'artwork'],
              },
            },
            required: [
              'title',
              'category',
              'brief',
              'clientOrContext',
              'role',
              'year',
              'audience',
              'direction',
              'software',
              'deliverables',
              'process',
              'svgVisualType',
            ],
          },
        },
      };

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          ...generateParams,
        });
      } catch (primaryErr: any) {
        console.warn('Gemini primary model temporary spike, trying fallback model...', primaryErr?.message);
        try {
          response = await ai.models.generateContent({
            model: 'gemini-flash-latest',
            ...generateParams,
          });
        } catch (secondaryErr: any) {
          console.warn('Gemini API temporary 503 spike, providing smart intelligent fallback...', secondaryErr?.message);
          return res.json({
            success: true,
            source: 'smart-heuristic',
            data: buildDynamicFallback(fileName)
          });
        }
      }

      const outputText = response.text;
      if (!outputText) {
        return res.json({
          success: true,
          source: 'smart-heuristic',
          data: buildDynamicFallback(fileName)
        });
      }

      const parsedData = JSON.parse(outputText);
      return res.json({
        success: true,
        source: 'gemini-vision',
        data: parsedData,
      });
    } catch (err: any) {
      console.error('Gemini Artwork Scan error:', err);
      const { fileName = '' } = req.body || {};
      const cleanName = (fileName || 'CREATIVE ARTWORK')
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .trim();
      return res.json({
        success: true,
        source: 'smart-fallback',
        data: {
          title: cleanName.toUpperCase().length > 3 ? `${cleanName.toUpperCase()} // SERIES` : 'CONTEMPORARY CREATIVE SERIES',
          category: 'Posters & Social Media',
          brief: 'A meticulous composition exploring typographic structure, deliberate negative space, and monochromatic metallic tones tailored for contemporary visual communications.',
          clientOrContext: 'Independent Creative Studio · SATI Vidisha',
          role: 'Lead Graphic Designer & Typographer',
          year: '2025',
          audience: 'Creative technologists, graphic design practitioners, and digital audience',
          direction: 'Brutalist Monochromatic Grid & Vector Hierarchy',
          software: ['Adobe Illustrator', 'Photoshop', 'Figma'],
          deliverables: ['Print Key Visuals', 'Digital Social Assets', 'Typography Spec'],
          process: [
            '1. Grid construction, layout balance & typography hierarchy planning',
            '2. Vector geometry refinement and monochrome contrast grading',
            '3. Output optimization across high-resolution print & digital social viewports'
          ],
          svgVisualType: 'poster'
        }
      });
    }
  });

  // Mount Vite development middlewares or serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
