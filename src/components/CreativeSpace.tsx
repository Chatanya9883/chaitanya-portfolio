import React, { useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  FileText, 
  Download, 
  Upload, 
  Maximize2, 
  ExternalLink, 
  Share2, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  BookOpen, 
  X, 
  Link2, 
  Copy, 
  ArrowUpRight, 
  Loader2,
  FileCheck2,
  FileDown
} from 'lucide-react';
import SectionReveal3D from './SectionReveal3D';
import PdfCanvasViewer from './PdfCanvasViewer';

function getEmbeddablePdfUrl(url: string): string {
  if (!url) return '';
  // If it's a Google Drive link, convert to /preview
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }
  return url;
}

function getDownloadUrl(url: string): string {
  if (!url) return '';
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }
  return url;
}

export default function CreativeSpace() {
  const { 
    portfolioPdf, 
    uploadCustomPortfolioPdf, 
    updatePortfolioPdf, 
    resetPortfolioPdf 
  } = usePortfolio();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFullscreenReaderOpen, setIsFullscreenReaderOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [driveInputUrl, setDriveInputUrl] = useState(portfolioPdf?.googleDriveUrl || portfolioPdf?.pdfUrl || '');
  const [copySuccess, setCopySuccess] = useState(false);
  const [uploadToast, setUploadToast] = useState<string | null>(null);

  const embedUrl = getEmbeddablePdfUrl(portfolioPdf?.pdfUrl || '');
  const downloadUrl = getDownloadUrl(portfolioPdf?.pdfUrl || '');
  const isDataUrl = portfolioPdf?.pdfUrl?.startsWith('data:');

  const showToast = (msg: string) => {
    setUploadToast(msg);
    setTimeout(() => {
      setUploadToast(null);
    }, 4000);
  };

  /**
   * Handle direct PDF file upload from local computer
   */
  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('⚠️ Please upload a valid PDF file (.pdf).');
      return;
    }

    setIsUploading(true);
    showToast(`Uploading and processing "${file.name}"...`);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        const sizeText = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${Math.round(file.size / 1024)} KB`;

        let serverDiskUrl: string | undefined = undefined;
        try {
          const res = await fetch('/api/upload/pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfBase64: result, fileName: file.name })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) serverDiskUrl = data.url;
          }
        } catch {
          // Fallback to client-side IndexedDB storage
        }

        uploadCustomPortfolioPdf({
          fileName: file.name,
          fileSizeText: sizeText,
          pdfUrl: result,
          googleDriveUrl: serverDiskUrl
        });

        setIsUploading(false);
        showToast(`✨ "${file.name}" loaded and ready for client review!`);
      };

      reader.onerror = () => {
        console.error('File reading error');
        showToast('Could not process PDF file.');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Error uploading PDF file.');
      setIsUploading(false);
    } finally {
      e.target.value = '';
    }
  };

  /**
   * Handle pasting a Google Drive or Cloud PDF URL
   */
  const handleSaveCloudLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveInputUrl.trim()) return;

    const trimmed = driveInputUrl.trim();
    uploadCustomPortfolioPdf({
      fileName: 'Chaitanya_Jain_Design_Portfolio_Client_Deck.pdf',
      fileSizeText: 'High-Res Cloud PDF',
      pdfUrl: trimmed,
      googleDriveUrl: trimmed
    });

    setIsLinkModalOpen(false);
    showToast('✨ Linked Google Drive / Cloud portfolio PDF!');
  };

  /**
   * Copy shareable link to clipboard
   */
  const handleCopyShareLink = () => {
    const linkToShare = portfolioPdf?.googleDriveUrl || portfolioPdf?.pdfUrl || window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(linkToShare);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
      showToast('🔗 Portfolio PDF link copied to clipboard!');
    }
  };

  return (
    <section id="creative-space" className="py-28 relative border-t border-white/[0.08] bg-[#070707] text-[#F5F5F5]">
      {/* Hidden PDF File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handlePdfFileUpload}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-12">
        
        {/* Section Header */}
        <SectionReveal3D className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#C0C0C0] tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>CLIENT DOSSIER · EXTENDED PRESENTATION</span>
            </div>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1 bg-[#101010] border border-white/15 text-xs font-mono text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print & Digital Vector Deck (300 DPI)</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white uppercase">
                CREATIVE WORK & PORTFOLIO PDF
              </h2>
              <p className="text-sm sm:text-base text-[#929292] font-sans leading-relaxed">
                An exhaustive, high-resolution PDF presentation featuring uncompressed branding systems, vector schematics, 3D sublimation jerseys, commercial event branding, and technical design case studies. Designed for creative directors, agencies, and prospective clients to inspect or download.
              </p>
            </div>

            {/* Top Action Buttons (Upload / Link / Reset) */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono transition-all flex items-center gap-2 cursor-pointer shadow-xl active:scale-95 disabled:opacity-50"
                title="Upload a new portfolio PDF from your computer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Uploading PDF...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-black stroke-[2.5]" />
                    <span>Upload Portfolio PDF</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setDriveInputUrl(portfolioPdf?.googleDriveUrl || portfolioPdf?.pdfUrl || '');
                  setIsLinkModalOpen(true);
                }}
                className="px-3.5 py-2.5 bg-[#121212] hover:bg-white/10 text-zinc-200 border border-white/20 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                title="Paste a Google Drive or Cloud PDF link"
              >
                <Link2 className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Link Cloud PDF</span>
              </button>

              {portfolioPdf?.isCustomUploaded && (
                <button
                  type="button"
                  onClick={resetPortfolioPdf}
                  className="px-3 py-2.5 bg-zinc-900/80 hover:bg-red-950 text-zinc-400 hover:text-red-200 border border-white/10 hover:border-red-500/40 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Reset to default portfolio dossier"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>
        </SectionReveal3D>

        {/* Embedded Interactive PDF Reader Card */}
        <SectionReveal3D delay={0.1}>
          <div className="relative bg-[#0d0d0d] border border-white/20 shadow-2xl overflow-hidden">
            
            {/* Top Metallic Border Accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent z-20 pointer-events-none" />

            {/* Corner Ticks */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-white/50 z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-white/50 z-20 pointer-events-none" />

            {/* Reader Toolbar / Header */}
            <div className="p-4 sm:p-5 bg-[#141414] border-b border-white/15 flex flex-wrap items-center justify-between gap-4">
              
              {/* Document Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-950/40 border border-red-500/40 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-red-400" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold font-mono text-white tracking-wide truncate max-w-[280px] sm:max-w-md">
                      {portfolioPdf?.fileName || 'Chaitanya_Jain_Creative_Work_Portfolio.pdf'}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono hidden sm:inline-block">
                      CLIENT READY
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                    <span>{portfolioPdf?.fileSizeText || '14.8 MB'}</span>
                    <span>·</span>
                    <span>{portfolioPdf?.uploadedAt || 'Official Release'}</span>
                    {portfolioPdf?.isCustomUploaded && (
                      <>
                        <span>·</span>
                        <span className="text-amber-400">Custom Upload</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Reader Action Controls */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {/* Fullscreen Reading Mode */}
                <button
                  type="button"
                  onClick={() => setIsFullscreenReaderOpen(true)}
                  className="px-3 py-1.5 bg-[#1e1e1e] hover:bg-white hover:text-black text-zinc-200 border border-white/20 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  title="Expand to distraction-free fullscreen reader"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Read Fullscreen</span>
                </button>

                {/* Direct Download Button */}
                {isDataUrl ? (
                  <a
                    href={portfolioPdf.pdfUrl}
                    download={portfolioPdf.fileName || 'Chaitanya_Jain_Portfolio.pdf'}
                    className="px-3 py-1.5 bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Download PDF directly to your device"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Download PDF</span>
                  </a>
                ) : (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Download PDF directly to your device"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Download PDF</span>
                  </a>
                )}

                {/* Open in New Window */}
                <a
                  href={portfolioPdf?.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-[#1a1a1a] hover:bg-white/20 text-zinc-300 hover:text-white border border-white/20 text-xs transition-colors cursor-pointer"
                  title="Open PDF in a new browser tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Share Link */}
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="p-2 bg-[#1a1a1a] hover:bg-white/20 text-zinc-300 hover:text-white border border-white/20 text-xs transition-colors cursor-pointer"
                  title="Copy shareable link for clients"
                >
                  {copySuccess ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Embedded PDF Canvas Viewer Viewport */}
            <div className="relative w-full h-[620px] sm:h-[720px] bg-[#080808] overflow-hidden flex flex-col">
              {portfolioPdf?.pdfUrl ? (
                <PdfCanvasViewer
                  pdfUrl={portfolioPdf.pdfUrl}
                  fileName={portfolioPdf.fileName || 'Portfolio_Document.pdf'}
                  downloadUrl={downloadUrl}
                  isDataUrl={isDataUrl}
                  onToggleFullscreen={() => setIsFullscreenReaderOpen(true)}
                  isFullscreen={false}
                  className="w-full h-full"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <FileText className="w-12 h-12 text-zinc-600" />
                  <div className="space-y-1">
                    <p className="text-base font-bold font-mono text-white">No PDF currently linked</p>
                    <p className="text-xs text-zinc-400 font-sans max-w-sm">
                      Upload your creative work PDF above so clients and creative directors can read your complete detailed portfolio.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white text-black font-bold text-xs font-mono cursor-pointer"
                  >
                    Upload Portfolio PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </SectionReveal3D>

        {/* What's Inside Callouts: Tailored for Creative Work Clients */}
        <SectionReveal3D delay={0.2} className="space-y-6 pt-4">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#C0C0C0] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>WHAT&apos;S INSIDE THIS PDF DOSSIER</span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">Comprehensive Creative Scope</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Brand Identity */}
            <div className="p-6 bg-[#0c0c0c] border border-white/10 hover:border-white/30 transition-all space-y-3 shadow-lg group">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/10 pb-3">
                <span className="text-emerald-400 font-bold">SECTION 01</span>
                <span>IDENTITY SYSTEMS</span>
              </div>
              <h4 className="text-lg font-bold font-display text-white group-hover:text-zinc-200 transition-colors">
                Brand Architecture & Logomarks
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Full 12-column isometric construction grids, minimum clear space guidelines, color balance formulas (CMYK, Pantone, RGB, HEX), and responsive horizontal & stacked mark configurations.
              </p>
              <ul className="text-[11px] font-mono text-zinc-300 space-y-1 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/50" />
                  <span>Aura Studio identity guidelines</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/50" />
                  <span>Collegiate tech summit vector emblems</span>
                </li>
              </ul>
            </div>

            {/* Column 2: Esports & Apparel */}
            <div className="p-6 bg-[#0c0c0c] border border-white/10 hover:border-white/30 transition-all space-y-3 shadow-lg group">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/10 pb-3">
                <span className="text-emerald-400 font-bold">SECTION 02</span>
                <span>APPAREL & MERCH</span>
              </div>
              <h4 className="text-lg font-bold font-display text-white group-hover:text-zinc-200 transition-colors">
                3D Sublimation Jerseys & Merchandise
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Photorealistic athletic garment mockups, vector dye-sublimation pattern schematics, breathable fabric print specifications, and commercial sponsor lockup configurations.
              </p>
              <ul className="text-[11px] font-mono text-zinc-300 space-y-1 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/50" />
                  <span>Axe Owner custom 3D jersey apparel</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/50" />
                  <span>Apex Esports League broadcast tournament kit</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Event Key Visuals & Posters */}
            <div className="p-6 bg-[#0c0c0c] border border-white/10 hover:border-white/30 transition-all space-y-3 shadow-lg group">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/10 pb-3">
                <span className="text-emerald-400 font-bold">SECTION 03</span>
                <span>KEY VISUALS & POSTERS</span>
              </div>
              <h4 className="text-lg font-bold font-display text-white group-hover:text-zinc-200 transition-colors">
                Collegiate Techfest & Event Graphics
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Print-ready A2 & A3 high DPI event posters, stage backdrops, multi-slide social announcement carousels, and high-impact digital campaign visual assets.
              </p>
              <ul className="text-[11px] font-mono text-zinc-300 space-y-1 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/50" />
                  <span>SATI Vidisha Techfest complete visual identity</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/50" />
                  <span>Creator YouTube thumbnails & digital assets</span>
                </li>
              </ul>
            </div>
          </div>
        </SectionReveal3D>

        {/* Client Inquiry Strip */}
        <SectionReveal3D delay={0.25}>
          <div className="p-6 sm:p-8 bg-[#101010] border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="text-base font-bold font-display text-white tracking-wide">
                NEED A TAILORED CLIENT PITCH DECK OR BESPOKE DESIGN PROPOSAL?
              </h4>
              <p className="text-xs text-zinc-400 font-sans">
                Available for branding commissions, commercial tournament graphics, athletic merchandise, and visual direction.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="#contact"
                className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono transition-colors flex items-center gap-2 shadow-lg"
              >
                <span>Inquire About Design Projects</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>
            </div>
          </div>
        </SectionReveal3D>
      </div>

      {/* FULLSCREEN DISTRACTION-FREE PDF READER MODAL */}
      {isFullscreenReaderOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col overflow-hidden"
          role="dialog"
          aria-label="Fullscreen Portfolio PDF Reader"
        >
          {/* Header Toolbar */}
          <div className="p-4 bg-[#0d0d0d] border-b border-white/15 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-950/60 border border-red-500/40 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-red-400" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm font-bold font-mono text-white truncate max-w-[240px] sm:max-w-lg">
                  {portfolioPdf?.fileName || 'Chaitanya_Jain_Creative_Work_Portfolio.pdf'}
                </p>
                <span className="text-[10px] font-mono text-zinc-400 block">
                  Fullscreen Client Presentation · {portfolioPdf?.fileSizeText || '14.8 MB'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isDataUrl ? (
                <a
                  href={portfolioPdf.pdfUrl}
                  download={portfolioPdf.fileName || 'Chaitanya_Jain_Portfolio.pdf'}
                  className="px-3 py-1.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              ) : (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              )}

              <a
                href={portfolioPdf?.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[#1a1a1a] hover:bg-white/20 text-zinc-200 border border-white/20 text-xs transition-colors"
                title="Open in new window"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsFullscreenReaderOpen(false)}
                className="p-2 bg-[#222] hover:bg-red-950 hover:text-red-200 text-zinc-200 border border-white/20 text-xs transition-colors cursor-pointer ml-1"
                title="Close Fullscreen (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fullscreen Canvas Viewport */}
          <div className="flex-1 w-full bg-[#050505] overflow-hidden">
            {portfolioPdf?.pdfUrl && (
              <PdfCanvasViewer
                pdfUrl={portfolioPdf.pdfUrl}
                fileName={portfolioPdf.fileName || 'Portfolio_Document.pdf'}
                downloadUrl={downloadUrl}
                isDataUrl={isDataUrl}
                onToggleFullscreen={() => setIsFullscreenReaderOpen(false)}
                isFullscreen={true}
                className="w-full h-full"
              />
            )}
          </div>
        </div>
      )}

      {/* CLOUD / GOOGLE DRIVE LINK MODAL */}
      {isLinkModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsLinkModalOpen(false)}
        >
          <div 
            className="bg-[#0e0e0e] border border-white/25 max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl font-mono text-zinc-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block">
                  CLOUD DOCUMENT SYNC
                </span>
                <h4 className="text-base font-bold text-white">
                  Link Google Drive / Cloud PDF
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white border border-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCloudLink} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 block">
                  Paste Google Drive view/share link or public PDF URL:
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                  value={driveInputUrl}
                  onChange={(e) => setDriveInputUrl(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black border border-white/20 text-white text-xs font-mono focus:border-white focus:outline-none transition-colors"
                />
                <p className="text-[11px] text-zinc-500 font-sans">
                  Tip: Ensure your Google Drive sharing setting is set to &quot;Anyone with the link can view&quot;. The system will automatically configure it for the embedded reader.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 text-xs border border-white/20 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Save & Link PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Toast */}
      {uploadToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#121212] border border-white/25 px-4 py-3 shadow-2xl text-xs font-mono text-white flex items-center gap-2.5">
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          <span>{uploadToast}</span>
        </div>
      )}
    </section>
  );
}
