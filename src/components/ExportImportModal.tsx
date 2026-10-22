import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, Download, Upload, CheckCircle2 } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportImportModal({ isOpen, onClose }: ExportImportModalProps) {
  const { exportJSON, importJSON, state } = usePortfolio();
  const [importText, setImportText] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = importJSON(importText);
    if (success) {
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 1200);
    } else {
      setErrorMsg('Failed to parse JSON configuration. Please ensure it is valid.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setImportText(content);
          const success = importJSON(content);
          if (success) {
            setSuccessMsg(true);
            setTimeout(() => {
              setSuccessMsg(false);
              onClose();
            }, 1200);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0c0c0c] border border-white/25 shadow-2xl p-6 md:p-8 text-[#F5F5F5] font-mono">
        <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-6">
          <h3 className="text-lg font-bold uppercase tracking-wide">Export / Import Portfolio Config</h3>
          <button onClick={onClose} className="p-2 text-[#929292] hover:text-white cursor-pointer border border-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/25 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Configuration successfully imported!</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Export Section */}
          <div className="p-4 bg-[#121212] border border-white/10 space-y-3">
            <h4 className="text-xs uppercase text-white font-bold">Export Current State</h4>
            <p className="text-xs text-[#929292]">Download your complete portfolio configuration as a JSON file.</p>
            <button
              onClick={exportJSON}
              className="px-4 py-2 bg-white text-black text-xs font-semibold hover:bg-[#C0C0C0] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Config</span>
            </button>
          </div>

          {/* Import Section */}
          <div className="p-4 bg-[#121212] border border-white/10 space-y-3">
            <h4 className="text-xs uppercase text-white font-bold">Import Configuration</h4>
            <p className="text-xs text-[#929292]">Upload a JSON file or paste configuration string.</p>
            
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="text-xs text-[#929292] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-[#C0C0C0] file:cursor-pointer cursor-pointer w-full"
            />

            <form onSubmit={handleImport} className="space-y-3 pt-2">
              <textarea
                rows={4}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Or paste JSON configuration here..."
                className="w-full bg-[#050505] border border-white/15 p-3 text-xs text-white focus:border-white outline-none font-mono resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-white text-black font-semibold text-xs hover:bg-[#C0C0C0] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Import & Apply Config</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
