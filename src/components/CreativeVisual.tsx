interface CreativeVisualProps {
  type: 'poster' | 'brand' | 'social' | 'thumb' | 'artwork';
  title: string;
  isLightbox?: boolean;
  imageUrl?: string;
  fit?: 'cover' | 'contain';
}

export default function CreativeVisual({ type, title, isLightbox = false, imageUrl, fit }: CreativeVisualProps) {
  const containerClass = isLightbox
    ? 'w-full h-80 sm:h-96 md:h-[500px]'
    : 'w-full h-80 sm:h-96 md:h-[460px]';

  const imageFitClass = fit 
    ? (fit === 'contain' ? 'object-contain' : 'object-cover')
    : 'object-contain';

  if (imageUrl) {
    return (
      <div className={`relative ${containerClass} bg-black/95 overflow-hidden flex items-center justify-center p-2`}>
        {/* Subtle blurred ambient backdrop if object-contain */}
        {imageFitClass === 'object-contain' && (
          <div 
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
        <img 
          src={imageUrl} 
          alt={title} 
          className={`relative z-10 max-w-full max-h-full ${imageFitClass}`} 
        />
        <div className="sr-only">{title}</div>
      </div>
    );
  }

  return (
    <div className={`relative ${containerClass} bg-black overflow-hidden flex items-center justify-center`}>
      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Editorial Poster Style in Black & Silver */}
      {type === 'poster' && (
        <svg viewBox="0 0 400 520" className="w-full h-full p-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ambient silver radial reflection */}
          <circle cx="200" cy="240" r="140" fill="#ffffff" fillOpacity="0.03" filter="blur(35px)" />

          {/* Poster Outer Grid */}
          <rect x="20" y="20" width="360" height="480" fill="#09090b" stroke="#71717a" strokeWidth="1.5" />
          
          {/* Header Typography */}
          <text x="35" y="55" fill="#a1a1aa" fontSize="12" fontFamily="monospace" fontWeight="700">01 / EXHIBITION ARCHIVE</text>
          <text x="35" y="80" fill="#ffffff" fontSize="36" fontFamily="sans-serif" fontWeight="900" letterSpacing="-1">SYNTHESIS</text>
          <text x="35" y="105" fill="#71717a" fontSize="12" fontFamily="monospace">CONTEMPORARY COMPUTING & ARTS</text>
          
          <line x1="35" y1="120" x2="365" y2="120" stroke="#27272a" strokeWidth="1" />

          {/* Central Bauhaus / Brutalist Geometry in Platinum & Silver */}
          <g transform="translate(40, 140)">
            <circle cx="160" cy="120" r="100" stroke="#e4e4e7" strokeWidth="1.5" />
            <circle cx="160" cy="120" r="60" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="4 4" />
            <rect x="70" y="30" width="180" height="180" stroke="#71717a" strokeWidth="1" transform="rotate(45 160 120)" />
            
            <circle cx="160" cy="120" r="14" fill="#ffffff" />
            <line x1="60" y1="120" x2="260" y2="120" stroke="#d4d4d8" strokeWidth="2" />
            <line x1="160" y1="20" x2="160" y2="220" stroke="#d4d4d8" strokeWidth="2" />
          </g>

          {/* Footer Grid Coordinates */}
          <rect x="35" y="440" width="330" height="40" fill="#18181b" stroke="#27272a" strokeWidth="1" />
          <text x="45" y="464" fill="#d4d4d8" fontSize="10" fontFamily="monospace">CURATED BY CHAITANYA JAIN</text>
          <text x="280" y="464" fill="#a1a1aa" fontSize="10" fontFamily="monospace">ISSUE #2026</text>
        </svg>
      )}

      {/* Brand Identity System Mockup in Monochromatic Silver */}
      {type === 'brand' && (
        <svg viewBox="0 0 500 340" className="w-full h-full p-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="250" cy="170" r="120" fill="#ffffff" fillOpacity="0.03" filter="blur(30px)" />
          <rect x="20" y="20" width="460" height="300" rx="12" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
          
          {/* Identity Grid Mark */}
          <g transform="translate(60, 60)">
            {/* Hexagonal Geometric Mark */}
            <polygon points="60,10 110,40 110,95 60,125 10,95 10,40" stroke="#e4e4e7" strokeWidth="2.5" fill="#18181b" />
            <polygon points="60,30 90,50 90,85 60,105 30,85 30,50" stroke="#a1a1aa" strokeWidth="1.5" fill="#27272a" />
            <circle cx="60" cy="67" r="8" fill="#ffffff" />

            {/* Typography Spec */}
            <text x="140" y="55" fill="#ffffff" fontSize="24" fontFamily="sans-serif" fontWeight="800">AURA NEURAL</text>
            <text x="140" y="78" fill="#a1a1aa" fontSize="11" fontFamily="monospace">BRAND IDENTITY GUIDELINE SPEC</text>

            <line x1="140" y1="95" x2="360" y2="95" stroke="#3f3f46" strokeWidth="1" />
          </g>

          {/* Colorway Swatches in Black & Silver Palette */}
          <g transform="translate(60, 200)">
            <rect x="0" y="0" width="70" height="40" rx="4" fill="#000000" stroke="#3f3f46" strokeWidth="1" />
            <text x="8" y="24" fill="#a1a1aa" fontSize="9" fontFamily="monospace">#000000</text>

            <rect x="85" y="0" width="70" height="40" rx="4" fill="#27272a" stroke="#52525b" strokeWidth="1" />
            <text x="93" y="24" fill="#e4e4e7" fontSize="9" fontFamily="monospace">#27272A</text>

            <rect x="170" y="0" width="70" height="40" rx="4" fill="#d4d4d8" stroke="#ffffff" strokeWidth="1" />
            <text x="178" y="24" fill="#18181b" fontSize="9" fontFamily="monospace" fontWeight="700">#D4D4D8</text>

            <rect x="255" y="0" width="105" height="40" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
            <text x="265" y="24" fill="#e4e4e7" fontSize="9" fontFamily="monospace">TYPOGRAPHY: SYNE</text>
          </g>
        </svg>
      )}

      {/* Social Media Campaign Slide in Silver & Platinum */}
      {type === 'social' && (
        <svg viewBox="0 0 400 400" className="w-full h-full p-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="110" fill="#ffffff" fillOpacity="0.03" filter="blur(30px)" />
          <rect x="20" y="20" width="360" height="360" rx="16" fill="#09090b" stroke="#52525b" strokeWidth="1.5" />
          
          <text x="45" y="60" fill="#a1a1aa" fontSize="11" fontFamily="monospace" fontWeight="700">CAMPUS TECH SUMMIT '26</text>
          
          <text x="45" y="105" fill="#ffffff" fontSize="28" fontFamily="sans-serif" fontWeight="900" letterSpacing="-0.5">
            CYBERNETIC
          </text>
          <text x="45" y="135" fill="#d4d4d8" fontSize="28" fontFamily="sans-serif" fontWeight="900" letterSpacing="-0.5">
            HORIZONS
          </text>

          {/* Isometric Cyber Grid in Silver Chrome */}
          <g transform="translate(60, 160)">
            <path d="M 0 60 L 140 0 L 280 60 L 140 120 Z" stroke="#71717a" strokeWidth="1.5" fill="#18181b" fillOpacity="0.5" />
            <path d="M 40 60 L 140 20 L 240 60 L 140 100 Z" stroke="#a1a1aa" strokeWidth="1" fill="#27272a" fillOpacity="0.4" />
            <line x1="140" y1="0" x2="140" y2="120" stroke="#ffffff" strokeWidth="1.5" />
            
            <circle cx="140" cy="60" r="10" fill="#ffffff" />
          </g>

          <rect x="45" y="320" width="310" height="30" rx="6" fill="#18181b" stroke="#27272a" strokeWidth="1" />
          <text x="60" y="340" fill="#d4d4d8" fontSize="10" fontFamily="monospace">APRIL 14-16 · AUDITORIUM HALL A</text>
        </svg>
      )}

      {/* Thumbnail Editorial in High-Contrast Silver */}
      {type === 'thumb' && (
        <svg viewBox="0 0 500 280" className="w-full h-full p-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="350" cy="140" r="100" fill="#ffffff" fillOpacity="0.03" filter="blur(30px)" />
          <rect x="20" y="20" width="460" height="240" rx="10" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
          
          {/* High contrast thumbnail composition */}
          <text x="45" y="60" fill="#a1a1aa" fontSize="12" fontFamily="monospace" fontWeight="700">SYSTEM ARCHITECTURE SERIES</text>
          <text x="45" y="105" fill="#ffffff" fontSize="30" fontFamily="sans-serif" fontWeight="900">NEURAL NETWORKS</text>
          <text x="45" y="140" fill="#d4d4d8" fontSize="30" fontFamily="sans-serif" fontWeight="900">DECODED</text>
          
          <rect x="45" y="165" width="160" height="26" rx="4" fill="#27272a" stroke="#52525b" strokeWidth="1" />
          <text x="55" y="182" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="700">FROM SCRATCH IN C++</text>

          {/* Mathematical Visual Formula Representation */}
          <g transform="translate(260, 50)">
            <circle cx="90" cy="80" r="60" stroke="#71717a" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 40 80 Q 90 20 140 80 T 200 80" stroke="#ffffff" strokeWidth="2.5" fill="none" />
            <circle cx="90" cy="50" r="6" fill="#a1a1aa" />
            <circle cx="140" cy="80" r="6" fill="#ffffff" />
          </g>

          <text x="45" y="235" fill="#71717a" fontSize="10" fontFamily="monospace">MATHEMATICS OF BACKPROPAGATION</text>
        </svg>
      )}

      {/* Experimental Generative Artwork in Silver Rays */}
      {type === 'artwork' && (
        <svg viewBox="0 0 400 480" className="w-full h-full p-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="220" r="120" fill="#ffffff" fillOpacity="0.04" filter="blur(35px)" />
          <rect x="20" y="20" width="360" height="440" fill="#09090b" stroke="#52525b" strokeWidth="1.5" />
          
          <text x="40" y="55" fill="#a1a1aa" fontSize="12" fontFamily="monospace">GEN_LAB // 01-GRID</text>
          
          {/* Halftone / Concentric generative vectors in Silver */}
          <g transform="translate(200, 220)">
            {[18, 36, 54, 72, 90, 108, 126, 144].map((r, idx) => (
              <polygon
                key={idx}
                points={`${-r},${-r} ${r},${-r} ${r},${r} ${-r},${r}`}
                stroke="#d4d4d8"
                strokeWidth="1.2"
                strokeOpacity={0.15 + idx * 0.1}
                transform={`rotate(${idx * 7.5})`}
              />
            ))}
            <circle cx="0" cy="0" r="8" fill="#ffffff" />
          </g>

          <text x="40" y="415" fill="#ffffff" fontSize="20" fontFamily="sans-serif" fontWeight="800">VARIABLE MODULAR FORM</text>
          <text x="40" y="435" fill="#d4d4d8" fontSize="10" fontFamily="monospace">ALGORITHMIC PARAMETRIC STUDY</text>
        </svg>
      )}

      <div className="sr-only">{title}</div>
    </div>
  );
}
