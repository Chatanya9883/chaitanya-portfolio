import { useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { DesignCaseStudy } from '../data/portfolioData';
import CreativeVisual from './CreativeVisual';
import FullArtworkLightboxModal from './FullArtworkLightboxModal';
import { compressImage } from '../utils/imageCompressor';
import { 
  X, 
  Palette, 
  Layers, 
  Trash2, 
  Upload, 
  Check, 
  Maximize2,
  Loader2,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Star,
  HardDrive,
  Save
} from 'lucide-react';
import SectionReveal3D from './SectionReveal3D';
import Tilt3D from './Tilt3D';

const CATEGORY_OPTIONS: DesignCaseStudy['category'][] = [
  'Posters & Social Media',
  'Branding & Visual Identity',
  'Esports & Gaming',
  'Thumbnails & Digital Creatives',
  'Other Creative Work'
];

interface PendingUploadItem {
  id: string;
  fileName: string;
  fileSizeText: string;
  dataUrl: string;
  category: DesignCaseStudy['category'];
  showInAllWork: boolean;
}

export default function DesignWork() {
  const { 
    state, 
    updateDesignCaseStudy, 
    addMultipleDesignCaseStudies, 
    deleteDesignCaseStudy,
    toggleShowInAllWork,
    clearAllUploadedArtworks,
    restoreAllImages,
    saveToPermanentMemory,
    isPermanentMemorySaving
  } = usePortfolio();

  const designCaseStudies = state.designCaseStudies || [];

  const [activeCategory, setActiveCategory] = useState<string>('All Work');
  const [isUploading, setIsUploading] = useState(false);
  const [fullViewArtwork, setFullViewArtwork] = useState<DesignCaseStudy | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Category selection modals
  const [studyToChangeCategory, setStudyToChangeCategory] = useState<DesignCaseStudy | null>(null);

  // Batch Multi-Image Category Selection Modal
  const [pendingUploads, setPendingUploads] = useState<PendingUploadItem[]>([]);
  const [isBatchCategoryModalOpen, setIsBatchCategoryModalOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState<DesignCaseStudy['category']>('Posters & Social Media');

  // Hidden file input refs
  const uploadFileInputRef = useRef<HTMLInputElement | null>(null);
  const cardFileInputRef = useRef<HTMLInputElement | null>(null);
  const activeUploadStudyIdRef = useRef<string | null>(null);

  const categories = [
    'All Work',
    'Posters & Social Media',
    'Branding & Visual Identity',
    'Esports & Gaming',
    'Thumbnails & Digital Creatives',
    'Other Creative Work',
    'All Artworks'
  ];

  // Artworks designated to show on Front Page ("All Work")
  const frontPageItems = designCaseStudies.filter((item) => item.showInAllWork !== false);

  const filteredItems = (() => {
    if (activeCategory === 'All Work') {
      return frontPageItems;
    }
    if (activeCategory === 'All Artworks') {
      return designCaseStudies;
    }
    return designCaseStudies.filter((item) => item.category === activeCategory);
  })();

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  /**
   * Handle files selected by user (single or multiple).
   * Compresses images client-side and opens the Batch Category Selection Modal
   * so the user can easily select the respective category of each image.
   */
  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    triggerToast(`Loading ${files.length} image(s)...`);

    try {
      const defaultCat: DesignCaseStudy['category'] = (
        activeCategory !== 'All Work' 
          ? activeCategory 
          : 'Posters & Social Media'
      ) as DesignCaseStudy['category'];

      const loadedItems: PendingUploadItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressed = await compressImage(file, 1600, 1600, 0.88);
        const sizeKb = Math.round((compressed.length * 3) / 4 / 1024);
        const sizeText = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

        loadedItems.push({
          id: `pending-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          fileName: file.name,
          fileSizeText: sizeText,
          dataUrl: compressed,
          category: defaultCat,
          showInAllWork: activeCategory === 'All Work'
        });
      }

      setPendingUploads(loadedItems);
      setBulkCategory(defaultCat);
      setIsBatchCategoryModalOpen(true);
    } catch (err) {
      console.error('Upload error:', err);
      triggerToast('Error loading images.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Change category of a specific pending image
  const handleItemCategoryChange = (id: string, newCategory: DesignCaseStudy['category']) => {
    setPendingUploads(prev => prev.map(item => item.id === id ? { ...item, category: newCategory } : item));
  };

  // Toggle show in All Work for a specific pending image
  const handleTogglePendingShowInAllWork = (id: string) => {
    setPendingUploads(prev => prev.map(item => item.id === id ? { ...item, showInAllWork: !item.showInAllWork } : item));
  };

  // Bulk apply front page showcase to all pending items
  const handleApplyShowInAllWorkToAll = (show: boolean) => {
    setPendingUploads(prev => prev.map(item => ({ ...item, showInAllWork: show })));
    triggerToast(
      show 
        ? `⭐ Set all ${pendingUploads.length} images to showcase on Front Page ("All Work")` 
        : `📁 Set all ${pendingUploads.length} images to Category Only`
    );
  };

  // Remove a pending item
  const handleRemovePendingItem = (id: string) => {
    setPendingUploads(prev => {
      const next = prev.filter(item => item.id !== id);
      if (next.length === 0) {
        setIsBatchCategoryModalOpen(false);
      }
      return next;
    });
  };

  // Bulk apply category to all pending items
  const handleApplyCategoryToAll = (cat: DesignCaseStudy['category']) => {
    setPendingUploads(prev => prev.map(item => ({ ...item, category: cat })));
    triggerToast(`Applied "${cat}" to all ${pendingUploads.length} images`);
  };

  // Confirm and add all images to portfolio with permanent storage saving
  const handleConfirmBatchUpload = async () => {
    if (pendingUploads.length === 0) return;

    setIsUploading(true);
    triggerToast(`Saving ${pendingUploads.length} artwork(s) to permanent memory...`);

    try {
      // Process each image and write to server permanent disk storage (/public/uploads)
      const newStudies: DesignCaseStudy[] = await Promise.all(
        pendingUploads.map(async (item, idx) => {
          const studyId = `artwork-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
          let permanentUrl = item.dataUrl;

          try {
            const uploadRes = await fetch('/api/upload/image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageBase64: item.dataUrl,
                id: studyId,
                fileName: item.fileName
              })
            });
            if (uploadRes.ok) {
              const uploadData = await uploadRes.json();
              if (uploadData.url) {
                permanentUrl = uploadData.url;
              }
            }
          } catch (uploadErr) {
            console.warn('Server disk write fallback to IndexedDB:', uploadErr);
          }

          return {
            id: studyId,
            title: item.fileName.replace(/\.[^/.]+$/, '').toUpperCase() || `${item.category} Artwork`,
            category: item.category,
            brief: '',
            clientOrContext: 'Independent Creative Project',
            role: 'Lead Visual Designer',
            audience: 'Design & Digital Media Audience',
            direction: 'Visual Architecture & Composition',
            year: new Date().getFullYear().toString(),
            aspectRatio: 'portrait',
            svgVisualType: item.category === 'Branding & Visual Identity' ? 'brand' : 'poster',
            imageUrl: permanentUrl,
            showInAllWork: item.showInAllWork,
            software: ['Adobe Illustrator', 'Photoshop'],
            deliverables: ['Digital Key Visuals', 'Creative Assets'],
            process: ['Visual Exploration', 'Final Export']
          };
        })
      );

      addMultipleDesignCaseStudies(newStudies);
      setIsBatchCategoryModalOpen(false);
      setPendingUploads([]);

      triggerToast(`💾 Successfully saved ${newStudies.length} artwork(s) to permanent memory & disk!`);
    } catch (err) {
      console.error('Batch upload error:', err);
      triggerToast('Error saving artworks to permanent memory.');
    } finally {
      setIsUploading(false);
    }
  };

  // Direct card image upload handler (replaces single card's image and persists to permanent disk)
  const handleDirectCardImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetStudyId = activeUploadStudyIdRef.current;
    if (!file || !targetStudyId) return;

    try {
      const result = await compressImage(file, 1600, 1600, 0.88);
      let permanentUrl = result;

      try {
        const uploadRes = await fetch('/api/upload/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: result,
            id: targetStudyId,
            fileName: file.name
          })
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.url) {
            permanentUrl = uploadData.url;
          }
        }
      } catch (uploadErr) {
        console.warn('Server disk write fallback to IndexedDB:', uploadErr);
      }

      updateDesignCaseStudy(targetStudyId, { imageUrl: permanentUrl });
      if (fullViewArtwork && fullViewArtwork.id === targetStudyId) {
        setFullViewArtwork({ ...fullViewArtwork, imageUrl: permanentUrl });
      }
      triggerToast('💾 Artwork image updated & saved to permanent memory!');
    } catch (err) {
      console.error('Direct card upload error:', err);
      triggerToast('Could not process image upload.');
    } finally {
      e.target.value = '';
    }
  };

  const openDirectUploadFor = (studyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    activeUploadStudyIdRef.current = studyId;
    cardFileInputRef.current?.click();
  };

  // Switch Category for an existing card
  const handleSwitchCategory = (newCat: DesignCaseStudy['category']) => {
    if (!studyToChangeCategory) return;
    updateDesignCaseStudy(studyToChangeCategory.id, { category: newCat });
    if (fullViewArtwork && fullViewArtwork.id === studyToChangeCategory.id) {
      setFullViewArtwork({ ...fullViewArtwork, category: newCat });
    }
    triggerToast(`✨ Moved artwork to "${newCat}"`);
    setStudyToChangeCategory(null);
  };

  // Direct instantaneous deletion (1-click, 100% reliable)
  const handleDeleteArtwork = (e: React.MouseEvent | null, id: string, title?: string) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    deleteDesignCaseStudy(id);
    if (fullViewArtwork && fullViewArtwork.id === id) {
      setFullViewArtwork(null);
    }
    triggerToast(`🗑️ Removed artwork: "${title || 'Artwork'}" (Ctrl + Z to restore)`);
  };

  return (
    <section id="creative-work" className="py-28 relative border-t border-white/[0.08] bg-[#050505]">
      {/* Hidden file input for uploading images (supports multiple files at once) */}
      <input
        ref={uploadFileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUploadFiles}
      />

      {/* Hidden file input for replacing single card image */}
      <input
        ref={cardFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleDirectCardImageUpload}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-10">
        
        {/* Floating Toast Notification */}
        {notification && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center justify-between shadow-2xl backdrop-blur-md">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{notification}</span>
            </span>
            <button 
              onClick={() => setNotification(null)} 
              className="text-emerald-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Section Header */}
        <SectionReveal3D className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0] flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-[#F5F5F5]" />
              <span>PRIMARY FOCUS · VISUAL ARCHITECTURE</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-[#F5F5F5]">
              SELECTED CREATIVE WORK
            </h2>
            
            <p className="text-sm md:text-base text-[#929292] max-w-2xl font-normal leading-relaxed">
              Curated visual identities, esports broadcast graphics, typography experiments, and high-impact digital campaigns crafted with deliberate composition and metallic precision.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => uploadFileInputRef.current?.click()}
              disabled={isUploading}
              className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95 disabled:opacity-50"
              title="Upload images (single or multiple) and pick category for each"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Loading Images...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>Upload Image(s)</span>
                </>
              )}
            </button>

            {/* Save to Permanent Memory Button */}
            <button
              type="button"
              onClick={() => saveToPermanentMemory()}
              disabled={isPermanentMemorySaving}
              className="px-4 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-500/50 text-xs font-mono transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
              title="Save all uploaded images and portfolio data permanently to disk and database"
            >
              {isPermanentMemorySaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Saving to Disk...</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save to Permanent Memory</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={restoreAllImages}
              className="px-4 py-2.5 bg-[#141414] hover:bg-white hover:text-black text-zinc-200 border border-white/20 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
              title="Restore all images and creative works"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Restore All Images</span>
            </button>

            <button
              type="button"
              onClick={clearAllUploadedArtworks}
              className="px-3.5 py-2.5 bg-zinc-900/80 hover:bg-red-950 text-zinc-400 hover:text-red-200 border border-white/10 hover:border-red-500/40 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
              title="Remove uploaded images"
            >
              <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>Clear Uploads</span>
            </button>
          </div>
        </SectionReveal3D>

        {/* Category Navigation Filter Tabs */}
        <div className="space-y-3 border-b border-white/10 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center p-1 bg-[#0c0c0c] border border-white/10 overflow-x-auto max-w-full shadow-2xl">
              {categories.map((cat) => {
                const isAllWork = cat === 'All Work';
                const isAllArtworks = cat === 'All Artworks';
                const count = isAllWork 
                  ? frontPageItems.length 
                  : isAllArtworks 
                  ? designCaseStudies.length 
                  : designCaseStudies.filter(i => i.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-2 text-xs font-mono transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      activeCategory === cat
                        ? 'bg-[#F5F5F5] text-black font-semibold shadow'
                        : 'text-[#929292] hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    {isAllWork && (
                      <Star className={`w-3 h-3 ${activeCategory === cat ? 'fill-black text-black' : 'text-amber-400'}`} />
                    )}
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      activeCategory === cat ? 'bg-black/15 text-black font-bold' : 'text-zinc-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              {activeCategory === 'All Work' ? (
                <div className="text-amber-300/90 bg-amber-950/40 border border-amber-500/30 px-3 py-1 flex items-center gap-2 text-[11px]">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Front Page Showcase ({filteredItems.length} selected)</span>
                </div>
              ) : activeCategory === 'All Artworks' ? (
                <span className="text-zinc-400 bg-white/5 border border-white/10 px-3 py-1 text-[11px]">
                  Full Catalog ({filteredItems.length} total artworks)
                </span>
              ) : (
                <span className="text-zinc-400 bg-white/5 border border-white/10 px-3 py-1 text-[11px]">
                  {filteredItems.length} in {activeCategory}
                </span>
              )}
            </div>
          </div>

          {/* Quick Notice Banner when in All Work */}
          {activeCategory === 'All Work' && (
            <div className="text-[11px] font-mono text-zinc-400 flex flex-wrap items-center justify-between gap-2 bg-[#0c0c0c] border border-white/10 px-3.5 py-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Showing only your selected front page artworks. Other images are stored in their respective category tabs.</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveCategory('All Artworks')}
                className="text-amber-300 hover:text-white underline cursor-pointer"
              >
                View all ({designCaseStudies.length}) to manage front page
              </button>
            </div>
          )}
        </div>

        {/* Asymmetrical Editorial Portfolio Gallery (Pure Image Display - Zero Bottom Data) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {filteredItems.map((study, idx) => {
            const isHeroCard = idx === 0 && activeCategory === 'All Work';
            const colSpan = isHeroCard
              ? 'md:col-span-12'
              : idx % 3 === 0
              ? 'md:col-span-7'
              : idx % 3 === 1
              ? 'md:col-span-5'
              : 'md:col-span-6';

            return (
              <SectionReveal3D
                key={study.id}
                delay={idx * 0.05}
                className={`${colSpan} group`}
              >
                <Tilt3D maxAngle={4}>
                  <div
                    className="relative bg-[#0a0a0a] border border-white/10 hover:border-white/30 transition-all duration-400 overflow-hidden flex flex-col h-full shadow-xl"
                  >
                    {/* Metallic Accent Top Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-20 pointer-events-none" />

                    {/* Corner Accent Ticks */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 z-20 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30 z-20 pointer-events-none" />

                    {/* Top Action Bar: Front Page Star, Replace, Category & Delete */}
                    <div 
                      className="absolute top-3 right-3 z-40 pointer-events-auto flex items-center gap-1.5 flex-wrap justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Front Page Toggle Button (1-Click) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          toggleShowInAllWork(study.id);
                        }}
                        className={`px-2 py-1 text-[10px] font-mono transition-all flex items-center gap-1 backdrop-blur-md cursor-pointer border shadow-md active:scale-95 ${
                          study.showInAllWork !== false
                            ? 'bg-amber-950/90 hover:bg-amber-900 text-amber-200 border-amber-500/60'
                            : 'bg-black/90 hover:bg-white/20 text-zinc-400 hover:text-white border-white/20'
                        }`}
                        title={
                          study.showInAllWork !== false
                            ? "Currently showing on Front Page ('All Work') — Click to show only in its category"
                            : "Category Only — Click to showcase on Front Page ('All Work')"
                        }
                      >
                        <Star className={`w-3 h-3 ${study.showInAllWork !== false ? 'fill-amber-400 text-amber-400' : 'text-zinc-500'}`} />
                        <span>{study.showInAllWork !== false ? 'In All Work' : 'Category Only'}</span>
                      </button>

                      {/* Upload/Replace Artwork button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          openDirectUploadFor(study.id, e);
                        }}
                        className="px-2 py-1 bg-black/90 hover:bg-white/20 text-zinc-300 hover:text-white border border-white/25 text-[10px] font-mono transition-colors flex items-center gap-1 backdrop-blur-md cursor-pointer"
                        title={study.imageUrl ? "Replace artwork image" : "Upload artwork image"}
                      >
                        <Upload className="w-3 h-3" />
                        <span className="hidden sm:inline">{study.imageUrl ? 'Replace' : 'Upload'}</span>
                      </button>

                      {/* Category Change Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setStudyToChangeCategory(study);
                        }}
                        className="px-2 py-1 bg-black/90 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/25 text-[10px] font-mono transition-colors flex items-center gap-1 backdrop-blur-md cursor-pointer"
                        title="Change Category"
                      >
                        <Layers className="w-3 h-3 text-[#C0C0C0]" />
                        <span>Category</span>
                      </button>

                      {/* Direct Instant Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDeleteArtwork(e, study.id, study.title);
                        }}
                        className="px-2.5 py-1 bg-red-950 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/60 text-[10px] font-mono font-medium transition-all flex items-center gap-1 backdrop-blur-md cursor-pointer active:scale-95 shadow-lg"
                        title="Delete artwork immediately"
                      >
                        <Trash2 className="w-3 h-3 text-red-300" />
                        <span>Delete</span>
                      </button>
                    </div>

                    {/* Visual Media Composition with Controlled Perspective (Pure Image - Zero Bottom Text) */}
                    <div 
                      onClick={() => setFullViewArtwork(study)}
                      className="relative overflow-hidden bg-black group/visual cursor-pointer"
                      title="Tap image to open completely with animated fullscreen viewer"
                    >
                      <div className="transform transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                        <CreativeVisual
                          type={study.svgVisualType}
                          title={study.title}
                          isLightbox={isHeroCard}
                          imageUrl={study.imageUrl}
                        />
                      </div>

                      {/* Animated Open Completely Prompt on Hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                        <div className="px-3.5 py-1.5 bg-black/90 border border-white/30 text-white text-xs font-mono flex items-center gap-2 shadow-2xl backdrop-blur-md transform translate-y-1.5 group-hover:translate-y-0 transition-transform">
                          <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tap to Open Completely</span>
                        </div>
                      </div>

                      {/* Subtle Chrome Sheen Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity pointer-events-none" />

                      {/* Category Tag */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 z-10 pointer-events-none">
                        <span className="px-2.5 py-1 bg-black/85 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-wider text-[#C0C0C0] uppercase">
                          {study.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </Tilt3D>
              </SectionReveal3D>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-16 text-center border border-dashed border-white/15 bg-white/[0.02] p-8 space-y-4">
            <p className="text-sm font-mono text-zinc-300">
              {activeCategory === 'All Work' 
                ? 'No artworks are currently selected to appear on the Front Page ("All Work").' 
                : `No artworks remaining in "${activeCategory}".`}
            </p>
            <p className="text-xs text-zinc-500 max-w-md mx-auto font-sans">
              {activeCategory === 'All Work'
                ? 'Your artworks are safely preserved in their respective category tabs. Switch to any category or click "Browse All Artworks" to toggle which pieces to showcase on the front page.'
                : 'Upload new images for this category or restore previous works.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {activeCategory === 'All Work' && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('All Artworks')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5 fill-black" />
                  <span>Browse All Artworks to Pick Highlights</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => uploadFileInputRef.current?.click()}
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono transition-colors cursor-pointer"
              >
                Upload New Artwork
              </button>
              <button
                type="button"
                onClick={restoreAllImages}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors cursor-pointer border border-white/10 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Restore All Images</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: BATCH CATEGORY SELECTION FOR UPLOADING A LOT OF IMAGES */}
      {isBatchCategoryModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/95 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsBatchCategoryModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#0d0d0d] border border-white/20 shadow-2xl font-mono text-xs text-zinc-300 my-auto flex flex-col max-h-[92vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-white/10 bg-[#121212] flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Category Selection for Uploads</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-3">
                  <span>SELECT CATEGORY FOR EACH IMAGE</span>
                  <span className="text-xs px-2.5 py-0.5 bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono">
                    {pendingUploads.length} {pendingUploads.length === 1 ? 'Image' : 'Images'}
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400 font-sans">
                  Tap the respective category for each image below. No extra fields, titles, or descriptions needed.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsBatchCategoryModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 cursor-pointer"
                title="Cancel upload"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Bulk Category & Front Page Toolbar */}
            {pendingUploads.length > 0 && (
              <div className="px-4 sm:px-6 py-3 bg-[#161616] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">Category for all:</span>
                    <select
                      value={bulkCategory}
                      onChange={(e) => setBulkCategory(e.target.value as any)}
                      className="bg-black text-white border border-white/20 px-2.5 py-1.5 text-xs font-mono focus:border-white outline-none cursor-pointer"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat} className="bg-black text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleApplyCategoryToAll(bulkCategory)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs transition-colors cursor-pointer"
                    >
                      Set All
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 border-l border-white/20 pl-3">
                    <span className="text-zinc-400">Front Page:</span>
                    <button
                      type="button"
                      onClick={() => handleApplyShowInAllWorkToAll(true)}
                      className="px-2.5 py-1.5 bg-amber-950/70 hover:bg-amber-900 text-amber-200 border border-amber-500/40 text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
                      title="Show all uploaded images on Front Page ('All Work')"
                    >
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>Show All in All Work</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyShowInAllWorkToAll(false)}
                      className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/20 text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
                      title="Keep all uploaded images in their categories only"
                    >
                      <span>Category Only All</span>
                    </button>
                  </div>
                </div>

                <span className="text-[11px] text-zinc-400 font-mono hidden lg:inline">
                  Select which images appear in &quot;All Work&quot; vs category only
                </span>
              </div>
            )}

            {/* Scrollable List of Uploaded Images with Category Selector */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-[#0a0a0a]">
              {pendingUploads.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 sm:p-4 bg-[#111111] border border-white/15 hover:border-white/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md"
                >
                  {/* Left: Thumbnail + File Info */}
                  <div className="flex items-center gap-3.5 shrink-0 w-full md:w-auto">
                    <span className="text-zinc-500 font-mono text-xs w-5">{idx + 1}.</span>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={item.dataUrl}
                        alt={item.fileName}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      <p className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-[220px]" title={item.fileName}>
                        {item.fileName}
                      </p>
                      <span className="text-[10px] text-zinc-400 font-mono block">
                        {item.fileSizeText}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold block">
                        Category: {item.category}
                      </span>
                      <span className={`text-[10px] font-mono block font-medium ${item.showInAllWork ? 'text-amber-400' : 'text-zinc-500'}`}>
                        {item.showInAllWork ? '★ In Front Page Showcase' : '📁 Category Only'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Respective Category Options + Front Page Switch */}
                  <div className="w-full md:flex-1 flex flex-col md:items-end gap-2.5">
                    {/* Front Page Toggle for this item */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono">
                        Front Page Showcase:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTogglePendingShowInAllWork(item.id)}
                        className={`px-2.5 py-1 text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                          item.showInAllWork
                            ? 'bg-amber-950/90 text-amber-200 border-amber-500/60 font-semibold shadow'
                            : 'bg-black/80 text-zinc-400 border-white/15 hover:border-white/30 hover:text-white'
                        }`}
                        title={item.showInAllWork ? "Will appear in All Work (Front Page) - Click to hide from front page" : "Will only appear in category - Click to show on front page"}
                      >
                        <Star className={`w-3.5 h-3.5 ${item.showInAllWork ? 'fill-amber-400 text-amber-400' : 'text-zinc-500'}`} />
                        <span>{item.showInAllWork ? '★ Show in All Work' : '📁 Category Only'}</span>
                      </button>
                    </div>

                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono">
                      Select Category for this image:
                    </span>
                    <div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
                      {CATEGORY_OPTIONS.map((cat) => {
                        const isSelected = item.category === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleItemCategoryChange(item.id, cat)}
                            className={`px-2.5 py-1.5 text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-white text-black font-bold border-white shadow-md'
                                : 'bg-black/60 hover:bg-white/10 text-zinc-300 border-white/10 hover:border-white/30'
                            }`}
                          >
                            <span>{cat}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Discard button */}
                  <button
                    type="button"
                    onClick={() => handleRemovePendingItem(item.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-colors self-end md:self-center cursor-pointer"
                    title="Remove from upload"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#121212] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-zinc-400 flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  Ready to add <strong>{pendingUploads.length}</strong> artwork(s) to your portfolio
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsBatchCategoryModalOpen(false)}
                  className="px-4 py-2 border border-white/20 text-zinc-300 hover:text-white hover:bg-white/5 text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBatchUpload}
                  className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
                >
                  <Check className="w-4 h-4 text-black stroke-[3]" />
                  <span>Confirm & Add {pendingUploads.length} Artworks to Portfolio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ONLY CATEGORY PICKER / SWITCHER FOR EXISTING ARTWORK */}
      {studyToChangeCategory && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setStudyToChangeCategory(null)}
        >
          <div 
            className="relative max-w-md w-full bg-[#0c0c0c] border border-white/20 p-6 md:p-7 space-y-5 shadow-2xl font-mono text-zinc-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-widest text-[#C0C0C0] block">
                  Artwork Category
                </span>
                <h4 className="text-base font-bold text-white">
                  Select Category
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setStudyToChangeCategory(null)}
                className="p-1.5 text-zinc-400 hover:text-white border border-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = studyToChangeCategory.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSwitchCategory(cat)}
                    className={`w-full p-3 text-left border transition-all cursor-pointer font-mono text-xs flex items-center justify-between ${
                      isSelected
                        ? 'bg-white text-black font-bold border-white shadow-lg'
                        : 'bg-[#141414] hover:bg-[#202020] text-zinc-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-4 h-4 text-black stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {/* Front Page Showcase Quick Toggle */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs text-zinc-300 font-mono">
                Show in &quot;All Work&quot; (Front Page):
              </span>
              <button
                type="button"
                onClick={() => {
                  toggleShowInAllWork(studyToChangeCategory.id);
                  setStudyToChangeCategory(prev => prev ? {
                    ...prev,
                    showInAllWork: prev.showInAllWork === false ? true : false
                  } : null);
                }}
                className={`px-3 py-1.5 text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                  studyToChangeCategory.showInAllWork !== false
                    ? 'bg-amber-950/90 text-amber-200 border-amber-500/60 font-semibold'
                    : 'bg-black/80 text-zinc-400 border-white/20 hover:text-white'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${studyToChangeCategory.showInAllWork !== false ? 'fill-amber-400 text-amber-400' : 'text-zinc-500'}`} />
                <span>{studyToChangeCategory.showInAllWork !== false ? '★ In All Work' : '📁 Category Only'}</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* MODAL 4: FULL-SCREEN COMPLETE ANIMATED ARTWORK VIEWER LIGHTBOX */}
      <FullArtworkLightboxModal
        isOpen={!!fullViewArtwork}
        currentStudy={fullViewArtwork}
        allStudies={filteredItems}
        onClose={() => setFullViewArtwork(null)}
        onSelectStudy={(study) => setFullViewArtwork(study)}
        onDeleteStudy={(study) => {
          handleDeleteArtwork(null, study.id, study.title);
        }}
        onOpenCaseStudy={(study) => {
          setFullViewArtwork(study);
        }}
        onOpenEdit={(study) => {
          setStudyToChangeCategory(study);
        }}
        onToggleShowInAllWork={(study) => {
          toggleShowInAllWork(study.id);
          if (fullViewArtwork && fullViewArtwork.id === study.id) {
            setFullViewArtwork({
              ...fullViewArtwork,
              showInAllWork: fullViewArtwork.showInAllWork === false ? true : false
            });
          }
        }}
      />

    </section>
  );
}
