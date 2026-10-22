import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DesignCaseStudy } from '../data/portfolioData';
import CreativeVisual from './CreativeVisual';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  FileText, 
  Edit3, 
  Sparkles,
  Maximize2,
  Trash2,
  Star
} from 'lucide-react';

interface FullArtworkLightboxModalProps {
  currentStudy: DesignCaseStudy | null;
  allStudies: DesignCaseStudy[];
  isOpen: boolean;
  onClose: () => void;
  onSelectStudy: (study: DesignCaseStudy) => void;
  onOpenCaseStudy?: (study: DesignCaseStudy) => void;
  onOpenEdit?: (study: DesignCaseStudy) => void;
  onDeleteStudy?: (study: DesignCaseStudy) => void;
  onToggleShowInAllWork?: (study: DesignCaseStudy) => void;
}

export default function FullArtworkLightboxModal({
  currentStudy,
  allStudies,
  isOpen,
  onClose,
  onSelectStudy,
  onOpenCaseStudy,
  onOpenEdit,
  onDeleteStudy,
  onToggleShowInAllWork,
}: FullArtworkLightboxModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [showMetadataDrawer, setShowMetadataDrawer] = useState(true);

  // Find index of current study
  const currentIndex = currentStudy 
    ? allStudies.findIndex(s => s.id === currentStudy.id) 
    : -1;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allStudies.length - 1;

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsZoomed(false);
      onSelectStudy(allStudies[currentIndex - 1]);
    }
  }, [currentIndex, allStudies, onSelectStudy]);

  const goToNext = useCallback(() => {
    if (currentIndex < allStudies.length - 1) {
      setIsZoomed(false);
      onSelectStudy(allStudies[currentIndex + 1]);
    }
  }, [currentIndex, allStudies, onSelectStudy]);

  // Reset zoom on study change
  useEffect(() => {
    setIsZoomed(false);
  }, [currentStudy?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key.toLowerCase() === 'z') {
        setIsZoomed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isZoomed, goToPrev, goToNext, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !currentStudy) return null;

  const handleDownload = () => {
    if (currentStudy.imageUrl) {
      const a = document.createElement('a');
      a.href = currentStudy.imageUrl;
      a.download = `${currentStudy.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_artwork.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-2xl text-white select-none overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={`Full artwork viewer: ${currentStudy.title}`}
      >
        {/* TOP CONTROLS & BREADCRUMB BAR */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="w-full z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-b from-black/90 via-black/70 to-transparent border-b border-white/10"
        >
          {/* Left: Project title & Counter */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 bg-white/10 border border-white/20 text-[11px] font-mono uppercase tracking-wider text-zinc-300 shrink-0">
              {currentIndex + 1} / {allStudies.length}
            </span>
            <div className="truncate">
              <h2 className="text-sm sm:text-base font-bold font-display text-white truncate flex items-center gap-2">
                <span>{currentStudy.title}</span>
                <span className="text-xs font-mono font-normal text-zinc-400 hidden md:inline">
                  · {currentStudy.category} ({currentStudy.year})
                </span>
              </h2>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Zoom Toggle */}
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className="px-2.5 py-1.5 bg-[#141414] hover:bg-[#202020] text-zinc-300 hover:text-white border border-white/15 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
              title={isZoomed ? "Reset Zoom (Fit to Screen) [Z]" : "Zoom In (150%) [Z]"}
            >
              {isZoomed ? (
                <>
                  <ZoomOut className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Fit Screen</span>
                </>
              ) : (
                <>
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Zoom 1.5x</span>
                </>
              )}
            </button>

            {/* View Full Editorial Case Study */}
            {onOpenCaseStudy && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCaseStudy(currentStudy);
                }}
                className="px-2.5 py-1.5 bg-[#141414] hover:bg-[#202020] text-zinc-300 hover:text-white border border-white/15 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                title="View full design brief, tools, role & process"
              >
                <FileText className="w-3.5 h-3.5 text-[#C0C0C0]" />
                <span className="hidden md:inline">Case Study</span>
              </button>
            )}

            {/* Quick Edit */}
            {onOpenEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEdit(currentStudy);
                }}
                className="px-2.5 py-1.5 bg-[#141414] hover:bg-[#202020] text-zinc-300 hover:text-white border border-white/15 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Edit artwork details or re-scan with AI"
              >
                <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden lg:inline">Edit</span>
              </button>
            )}

            {/* Download Original Image if custom uploaded */}
            {currentStudy.imageUrl && (
              <button
                type="button"
                onClick={handleDownload}
                className="p-1.5 bg-[#141414] hover:bg-[#202020] text-zinc-300 hover:text-white border border-white/15 text-xs font-mono transition-colors cursor-pointer"
                title="Download full resolution artwork"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {/* Toggle Show in All Work (Front Page) */}
            {onToggleShowInAllWork && (
              <button
                type="button"
                onClick={() => onToggleShowInAllWork(currentStudy)}
                className={`px-2.5 py-1.5 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer border ${
                  currentStudy.showInAllWork !== false
                    ? 'bg-amber-950/80 hover:bg-amber-900 text-amber-200 border-amber-500/50'
                    : 'bg-[#141414] hover:bg-[#202020] text-zinc-300 hover:text-white border-white/15'
                }`}
                title={
                  currentStudy.showInAllWork !== false
                    ? "Showing on Front Page ('All Work') — Click to show in Category Only"
                    : "Hidden from Front Page — Click to show in All Work"
                }
              >
                <Star className={`w-3.5 h-3.5 ${currentStudy.showInAllWork !== false ? 'fill-amber-400 text-amber-400' : 'text-zinc-400'}`} />
                <span className="hidden sm:inline">
                  {currentStudy.showInAllWork !== false ? 'In All Work' : 'Category Only'}
                </span>
              </button>
            )}

            {/* Direct Delete Artwork Button */}
            {onDeleteStudy && (
              <button
                type="button"
                onClick={() => {
                  onDeleteStudy(currentStudy);
                  onClose();
                }}
                className="px-2.5 py-1.5 bg-red-950/90 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/50 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                title="Delete this artwork"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-300" />
                <span>Delete</span>
              </button>
            )}

            {/* Close Lightbox */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-mono transition-colors cursor-pointer ml-1"
              aria-label="Close fullscreen artwork viewer (Escape)"
              title="Close [Esc]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.header>

        {/* MAIN ARTWORK VIEWPORT CONTAINER */}
        <div className="relative w-full flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          {/* Subtle ambient glow behind artwork */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.04] via-transparent to-transparent pointer-events-none" />

          {/* PREVIOUS BUTTON (FLOATING LEFT) */}
          <button
            type="button"
            onClick={goToPrev}
            disabled={!hasPrev}
            aria-label="Previous Artwork"
            className={`absolute left-3 sm:left-6 z-30 p-2.5 sm:p-3 rounded-none border border-white/15 bg-black/80 backdrop-blur-md transition-all duration-200 ${
              hasPrev 
                ? 'text-white hover:bg-white/20 hover:border-white/40 cursor-pointer shadow-2xl hover:scale-105 active:scale-95' 
                : 'text-zinc-600 border-white/5 opacity-40 cursor-not-allowed'
            }`}
            title="Previous artwork (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* NEXT BUTTON (FLOATING RIGHT) */}
          <button
            type="button"
            onClick={goToNext}
            disabled={!hasNext}
            aria-label="Next Artwork"
            className={`absolute right-3 sm:right-6 z-30 p-2.5 sm:p-3 rounded-none border border-white/15 bg-black/80 backdrop-blur-md transition-all duration-200 ${
              hasNext 
                ? 'text-white hover:bg-white/20 hover:border-white/40 cursor-pointer shadow-2xl hover:scale-105 active:scale-95' 
                : 'text-zinc-600 border-white/5 opacity-40 cursor-not-allowed'
            }`}
            title="Next artwork (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* ARTWORK DISPLAY (SMOOTH ANIMATED ENTRANCE & TRANSITION) */}
          <div className="w-full h-full flex items-center justify-center overflow-auto p-2 sm:p-4">
            <motion.div
              key={currentStudy.id}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: isZoomed ? 1.45 : 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -12 }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1]
              }}
              className={`relative max-w-full max-h-full flex items-center justify-center transition-transform duration-300 ease-out ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              {currentStudy.imageUrl ? (
                <div className="relative group/img flex items-center justify-center max-w-[90vw] max-h-[78vh] sm:max-h-[82vh]">
                  {/* Clean image shadow and border frame */}
                  <img
                    src={currentStudy.imageUrl}
                    alt={currentStudy.title}
                    className="max-w-[90vw] max-h-[78vh] sm:max-h-[82vh] w-auto h-auto object-contain border border-white/20 shadow-2xl shadow-black/80 select-none pointer-events-auto"
                    draggable={false}
                  />

                  {/* Corner metallic accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/70 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/70 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/70 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/70 pointer-events-none" />

                  {/* Hint overlay on hover */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/85 backdrop-blur-md px-2.5 py-1 border border-white/20 text-[10px] font-mono text-zinc-300 pointer-events-none flex items-center gap-1.5">
                    <Maximize2 className="w-3 h-3 text-emerald-400" />
                    <span>{isZoomed ? 'Click to Fit' : 'Click to Zoom'}</span>
                  </div>
                </div>
              ) : (
                /* Fallback SVG visual scaled to full container without clipping */
                <div className="w-[85vw] max-w-3xl h-[65vh] sm:h-[75vh] border border-white/20 shadow-2xl bg-[#09090b] flex items-center justify-center relative p-2">
                  <div className="w-full h-full flex items-center justify-center">
                    <CreativeVisual
                      type={currentStudy.svgVisualType}
                      title={currentStudy.title}
                      isLightbox={true}
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/70 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/70 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/70 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/70 pointer-events-none" />
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* BOTTOM METADATA & THUMBNAIL DRAWER */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="w-full z-20 bg-gradient-to-t from-black via-black/95 to-black/80 border-t border-white/10 px-4 sm:px-6 py-3 space-y-2.5"
        >
          {/* Metadata quick row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-zinc-400">
                Client / Context: <strong className="text-white font-medium">{currentStudy.clientOrContext}</strong>
              </span>
              <span className="text-zinc-600 hidden sm:inline">|</span>
              <span className="text-zinc-400">
                Role: <strong className="text-zinc-200 font-medium">{currentStudy.role}</strong>
              </span>
              <span className="text-zinc-600 hidden md:inline">|</span>
              <div className="hidden md:flex items-center gap-1.5">
                {currentStudy.software.slice(0, 4).map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 bg-[#141414] border border-white/10 text-[10px] text-zinc-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Keyboard hints */}
            <div className="text-[10px] text-zinc-500 font-mono hidden sm:flex items-center gap-3">
              <span>← / → Navigate</span>
              <span>•</span>
              <span>Z Zoom</span>
              <span>•</span>
              <span>Esc Close</span>
            </div>
          </div>

          {/* Quick thumbnail strip for 1-click jump between all works */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {allStudies.map((study, idx) => {
              const isSelected = study.id === currentStudy.id;
              return (
                <button
                  key={study.id}
                  type="button"
                  onClick={() => {
                    setIsZoomed(false);
                    onSelectStudy(study);
                  }}
                  className={`group relative shrink-0 w-14 h-10 sm:w-16 sm:h-11 border transition-all cursor-pointer overflow-hidden bg-black ${
                    isSelected 
                      ? 'border-emerald-400 scale-105 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-400' 
                      : 'border-white/15 opacity-60 hover:opacity-100 hover:border-white/40'
                  }`}
                  title={`${idx + 1}. ${study.title}`}
                >
                  {study.imageUrl ? (
                    <img 
                      src={study.imageUrl} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#151515] text-[8px] font-mono text-zinc-400 uppercase">
                      {study.svgVisualType}
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-emerald-400 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.footer>
      </div>
    </AnimatePresence>
  );
}
