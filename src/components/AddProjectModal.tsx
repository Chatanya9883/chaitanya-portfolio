import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, Upload, Plus, Image as ImageIcon } from 'lucide-react';
import { DesignCaseStudy } from '../data/portfolioData';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const { addDesignCaseStudy } = usePortfolio();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DesignCaseStudy['category']>('Posters & Social Media');
  const [brief, setBrief] = useState('');
  const [role, setRole] = useState('Lead Graphic Designer');
  const [clientOrContext, setClientOrContext] = useState('Independent Creative Project');
  const [year, setYear] = useState('2026');
  const [svgVisualType, setSvgVisualType] = useState<DesignCaseStudy['svgVisualType']>('poster');
  const [toolsStr, setToolsStr] = useState('Adobe Illustrator, Photoshop, Figma');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !brief.trim()) {
      setErrorMsg('Please fill in required fields (title and brief).');
      return;
    }

    const newStudy: DesignCaseStudy = {
      id: `custom-design-${Date.now()}`,
      title,
      category,
      brief,
      audience: 'Collegiate & professional design audience',
      role,
      direction: 'Monochrome precision with sharp geometric styling.',
      process: ['Discovery and initial sketch exploration.', 'Digital vector drafting and typography pairing.', 'Final polishing and asset export.'],
      deliverables: ['High-Resolution Visual Assets', 'Presentation Mockups'],
      software: toolsStr.split(',').map(s => s.trim()).filter(Boolean),
      year,
      clientOrContext,
      aspectRatio: 'portrait',
      svgVisualType
    };

    addDesignCaseStudy(newStudy);
    onClose();
    setTitle('');
    setBrief('');
    setPreviewImage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0c0c0c] border border-white/25 shadow-2xl p-6 md:p-8 text-[#F5F5F5] font-mono">
        <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-6">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-white" />
            <h3 className="text-lg font-bold font-display uppercase tracking-wide">Add New Design Project</h3>
          </div>
          <button onClick={onClose} className="p-2 text-[#929292] hover:text-white cursor-pointer border border-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase text-[#929292] mb-1">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cybernetic Art Direction"
                className="w-full bg-[#121212] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:border-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase text-[#929292] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#121212] border border-white/15 px-3 py-2.5 text-xs text-white focus:border-white outline-none"
              >
                <option value="Posters & Social Media">Posters & Social Media</option>
                <option value="Branding & Visual Identity">Branding & Visual Identity</option>
                <option value="Esports & Gaming">Esports & Gaming</option>
                <option value="Thumbnails & Digital Creatives">Thumbnails & Digital Creatives</option>
                <option value="Other Creative Work">Other Creative Work</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase text-[#929292] mb-1">Project Brief / Summary *</label>
            <textarea
              required
              rows={3}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Describe the objective, aesthetic direction, and deliverables..."
              className="w-full bg-[#121212] border border-white/15 p-3 text-xs text-white focus:border-white outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase text-[#929292] mb-1">My Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white focus:border-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase text-[#929292] mb-1">Client / Context</label>
              <input
                type="text"
                value={clientOrContext}
                onChange={(e) => setClientOrContext(e.target.value)}
                className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white focus:border-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase text-[#929292] mb-1">Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white focus:border-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase text-[#929292] mb-1">Software & Tools (comma separated)</label>
              <input
                type="text"
                value={toolsStr}
                onChange={(e) => setToolsStr(e.target.value)}
                className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white focus:border-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase text-[#929292] mb-1">Visual Template Style</label>
              <select
                value={svgVisualType}
                onChange={(e) => setSvgVisualType(e.target.value as any)}
                className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white focus:border-white outline-none"
              >
                <option value="poster">Poster Graphic</option>
                <option value="brand">Brand Identity</option>
                <option value="social">Social Media Card</option>
                <option value="thumb">Digital Thumbnail</option>
                <option value="artwork">Abstract Artwork</option>
              </select>
            </div>
          </div>

          {/* Image Upload Option */}
          <div>
            <label className="block text-[11px] uppercase text-[#929292] mb-1">Upload Project Preview Image (Optional)</label>
            <div className="flex items-center gap-4 p-4 bg-[#121212] border border-dashed border-white/20">
              {previewImage ? (
                <div className="relative w-20 h-20 bg-black overflow-hidden border border-white/20">
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-[#929292]">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  className="text-xs text-[#929292] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-[#C0C0C0] file:cursor-pointer cursor-pointer"
                />
                <p className="text-[10px] text-[#71717a] mt-1">Supports PNG, JPG, WebP up to 5MB.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent border border-white/20 text-[#929292] hover:text-white hover:border-white text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-white text-black font-semibold text-xs hover:bg-[#C0C0C0] transition-colors cursor-pointer"
            >
              Add Project to Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
