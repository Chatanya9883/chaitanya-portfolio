import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  Layers, 
  Loader2, 
  AlertCircle,
  FileText,
  Download,
  ExternalLink
} from 'lucide-react';

// Configure PDF.js worker in Vite
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch (err) {
    console.warn('Worker URL resolution fallback:', err);
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
}

interface PdfCanvasViewerProps {
  pdfUrl: string;
  fileName?: string;
  downloadUrl?: string;
  isDataUrl?: boolean;
  className?: string;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

function convertBase64ToUint8Array(base64Data: string): Uint8Array {
  let base64 = base64Data;
  if (base64Data.includes(';base64,')) {
    base64 = base64Data.split(';base64,')[1];
  }
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export default function PdfCanvasViewer({
  pdfUrl,
  fileName = 'Portfolio_Document.pdf',
  downloadUrl,
  isDataUrl = false,
  className = '',
  onToggleFullscreen,
  isFullscreen = false
}: PdfCanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.25);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRenderingPage, setIsRenderingPage] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);

  const renderTaskRef = useRef<any>(null);

  const isGoogleDrive = pdfUrl?.includes('drive.google.com');

  // Load PDF Document
  useEffect(() => {
    if (!pdfUrl) {
      setIsLoading(false);
      return;
    }

    if (isGoogleDrive) {
      // For Google Drive, we let the Google Preview iframe handle it
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setErrorMsg(null);

    async function loadPdf() {
      try {
        let loadingTask: any;

        if (pdfUrl.startsWith('data:') || pdfUrl.includes(';base64,')) {
          const uint8 = convertBase64ToUint8Array(pdfUrl);
          loadingTask = pdfjsLib.getDocument({
            data: uint8,
            cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
            cMapPacked: true,
          });
        } else {
          loadingTask = pdfjsLib.getDocument({
            url: pdfUrl,
            cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
            cMapPacked: true,
          });
        }

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setCurrentPage(1);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('PDF.js loading error:', err);
        if (!isCancelled) {
          setErrorMsg(err.message || 'Failed to render PDF document');
          setIsLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl, isGoogleDrive]);

  // Render Page onto Canvas
  const renderPage = useCallback(async (pageNum: number, currentScale: number, currentRotation: number) => {
    if (!pdfDoc) return;

    try {
      setIsRenderingPage(true);

      // Cancel ongoing render task if any
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Ignore cancellation errors
        }
      }

      const page = await pdfDoc.getPage(pageNum);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const viewport = page.getViewport({ scale: currentScale, rotation: currentRotation });
      const context = canvas.getContext('2d');
      if (!context) return;

      // Handle high DPI displays for ultra-crisp vector typography
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;
      await renderTask.promise;
      setIsRenderingPage(false);
    } catch (err: any) {
      if (err.name !== 'RenderingCancelledException') {
        console.error('Page rendering error:', err);
      }
      setIsRenderingPage(false);
    }
  }, [pdfDoc]);

  // Re-render when page, scale, or rotation changes
  useEffect(() => {
    if (pdfDoc && !isGoogleDrive) {
      renderPage(currentPage, scale, rotation);
    }
  }, [pdfDoc, currentPage, scale, rotation, renderPage, isGoogleDrive]);

  // Navigation handlers
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const fitToWidth = () => {
    if (!containerRef.current || !pdfDoc) return;
    pdfDoc.getPage(currentPage).then((page: any) => {
      const viewport = page.getViewport({ scale: 1.0 });
      const containerWidth = containerRef.current?.clientWidth || 800;
      const targetScale = Math.max((containerWidth - 60) / viewport.width, 0.5);
      setScale(Number(targetScale.toFixed(2)));
    });
  };

  // Google Drive Embed Fallback
  if (isGoogleDrive) {
    const embedSrc = pdfUrl.includes('/preview') 
      ? pdfUrl 
      : pdfUrl.replace(/\/view(\?.*)?$/, '/preview');

    return (
      <div className={`relative w-full h-full bg-[#0a0a0a] flex flex-col ${className}`}>
        <iframe
          src={embedSrc}
          className="w-full h-full border-0 bg-[#0c0c0c]"
          title={fileName}
          allow="autoplay"
        />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-[#080808] flex flex-col select-none overflow-hidden ${className}`}
    >
      {/* Top Reader Controls Bar */}
      <div className="p-2.5 sm:p-3 bg-[#111111] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-300 z-20 shrink-0">
        
        {/* Left: Page Navigator */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={goToPrevPage}
            disabled={currentPage <= 1 || isLoading}
            className="p-1.5 bg-[#1a1a1a] hover:bg-[#252525] disabled:opacity-40 text-white border border-white/10 transition-colors cursor-pointer"
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0a0a0a] border border-white/10">
            <span className="text-white font-bold">{currentPage}</span>
            <span className="text-zinc-500">/</span>
            <span className="text-zinc-400">{numPages || '—'}</span>
          </div>

          <button
            type="button"
            onClick={goToNextPage}
            disabled={currentPage >= numPages || isLoading}
            className="p-1.5 bg-[#1a1a1a] hover:bg-[#252525] disabled:opacity-40 text-white border border-white/10 transition-colors cursor-pointer"
            title="Next Page (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Toggle Thumbnails */}
          {numPages > 1 && (
            <button
              type="button"
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`px-2 py-1 border transition-colors flex items-center gap-1 cursor-pointer ml-1 ${
                showThumbnails
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-[#1a1a1a] hover:bg-[#252525] text-zinc-300 border-white/10'
              }`}
              title="Show all page numbers"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pages</span>
            </button>
          )}
        </div>

        {/* Center: Status indicator */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-zinc-400">
          {isRenderingPage ? (
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Rendering Page {currentPage}...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="truncate max-w-[200px]">{fileName}</span>
            </div>
          )}
        </div>

        {/* Right: Zoom & Orientation Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="p-1.5 bg-[#1a1a1a] hover:bg-[#252525] disabled:opacity-40 text-white border border-white/10 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={fitToWidth}
            className="px-2 py-1 bg-[#1a1a1a] hover:bg-[#252525] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer text-[11px]"
            title="Fit to Width"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= 3.0}
            className="p-1.5 bg-[#1a1a1a] hover:bg-[#252525] disabled:opacity-40 text-white border border-white/10 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={rotate}
            className="p-1.5 bg-[#1a1a1a] hover:bg-[#252525] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Rotate Page 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="p-1.5 bg-[#1a1a1a] hover:bg-white hover:text-black text-zinc-200 border border-white/10 transition-all cursor-pointer ml-1"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reader"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport Body */}
      <div className="relative flex-1 w-full overflow-auto flex bg-[#050505]">
        
        {/* Thumbnails Sidebar / Drawer */}
        {showThumbnails && numPages > 1 && (
          <div className="w-28 sm:w-36 bg-[#0a0a0a] border-r border-white/10 p-2.5 overflow-y-auto shrink-0 space-y-2 z-10">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
              Select Page:
            </span>
            {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setCurrentPage(p);
                  setShowThumbnails(false);
                }}
                className={`w-full py-2 px-3 text-left font-mono text-xs border transition-all cursor-pointer flex items-center justify-between ${
                  currentPage === p
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-[#121212] hover:bg-[#1a1a1a] text-zinc-400 hover:text-white border-white/10'
                }`}
              >
                <span>Page {p}</span>
                {currentPage === p && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
              </button>
            ))}
          </div>
        )}

        {/* Canvas Display Viewport */}
        <div className="flex-1 w-full min-h-full flex items-center justify-center p-4 sm:p-8 overflow-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-3 p-12 text-center">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-xs font-mono text-zinc-300">
                Loading & parsing portfolio PDF...
              </p>
              <span className="text-[10px] font-mono text-zinc-500">{fileName}</span>
            </div>
          ) : errorMsg ? (
            <div className="max-w-md p-6 bg-[#121212] border border-red-500/30 text-center space-y-4">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-mono font-bold text-white">Could not display PDF preview</p>
                <p className="text-xs text-zinc-400 font-sans">{errorMsg}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {isDataUrl ? (
                  <a
                    href={pdfUrl}
                    download={fileName}
                    className="px-4 py-2 bg-white text-black font-bold text-xs font-mono flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Directly</span>
                  </a>
                ) : (
                  <a
                    href={downloadUrl || pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-white text-black font-bold text-xs font-mono flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Browser Reader</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="relative shadow-2xl transition-transform duration-200 ease-out border border-white/20 bg-white">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto block shadow-2xl"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
