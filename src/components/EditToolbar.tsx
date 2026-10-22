import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Check, 
  RotateCcw, 
  Undo2, 
  Redo2, 
  Download, 
  Upload, 
  Plus, 
  X, 
  Sliders, 
  Eye, 
  Save,
  Edit3
} from 'lucide-react';
import AddProjectModal from './AddProjectModal';
import ExportImportModal from './ExportImportModal';
import EditContentModal from './EditContentModal';

export default function EditToolbar() {
  const { 
    isEditMode, 
    setIsEditMode, 
    hasUnsavedChanges, 
    saveChanges, 
    publishChanges, 
    resetToDefault, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = usePortfolio();

  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isEditContentOpen, setIsEditContentOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [showSectionManager, setShowSectionManager] = useState(false);

  if (!isEditMode) return null;

  return (
    <>
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[92%] max-w-5xl bg-[#0c0c0c]/95 backdrop-blur-xl border border-white/25 px-5 py-3 shadow-2xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#F5F5F5]">
        {/* Left: Mode Badge & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-widest uppercase text-white">VISUAL EDIT MODE</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[#929292]">
            {hasUnsavedChanges ? (
              <span className="text-amber-400 font-medium">● Unsaved Changes</span>
            ) : (
              <span className="text-emerald-400 font-medium">✓ Saved</span>
            )}
          </div>
        </div>

        {/* Center: Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-2 border border-white/15 transition-all flex items-center gap-1 ${
              canUndo ? 'hover:bg-white/10 text-white cursor-pointer' : 'opacity-40 cursor-not-allowed text-[#71717a]'
            }`}
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
            <span className="hidden md:inline">Undo</span>
          </button>

          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-2 border border-white/15 transition-all flex items-center gap-1 ${
              canRedo ? 'hover:bg-white/10 text-white cursor-pointer' : 'opacity-40 cursor-not-allowed text-[#71717a]'
            }`}
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
            <span className="hidden md:inline">Redo</span>
          </button>

          <div className="h-4 w-[1px] bg-white/20 mx-1" />

          <button
            onClick={() => setIsEditContentOpen(true)}
            className="px-3 py-2 bg-zinc-800 border border-white/20 text-white hover:bg-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <Edit3 className="w-4 h-4 text-[#C0C0C0]" />
            <span>Edit Content</span>
          </button>

          <button
            onClick={() => setIsAddProjectOpen(true)}
            className="px-3 py-2 bg-white text-black font-semibold hover:bg-[#C0C0C0] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>

          <button
            onClick={() => setShowSectionManager(!showSectionManager)}
            className="px-3 py-2 bg-[#18181b] border border-white/20 hover:border-white/40 text-[#F5F5F5] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">Sections</span>
          </button>

          <button
            onClick={() => setIsExportImportOpen(true)}
            className="px-3 py-2 bg-[#18181b] border border-white/20 hover:border-white/40 text-[#F5F5F5] transition-all flex items-center gap-1.5 cursor-pointer"
            title="Export or Import JSON config"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export / Import</span>
          </button>
        </div>

        {/* Right: Save, Publish, Exit */}
        <div className="flex items-center gap-2">
          <button
            onClick={saveChanges}
            className="px-3 py-2 bg-[#18181b] border border-white/20 hover:border-white/40 text-white transition-all flex items-center gap-1 cursor-pointer"
            title="Save draft"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={publishChanges}
            className="px-3.5 py-2 bg-gradient-to-r from-zinc-200 to-white text-black font-bold hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Publish</span>
          </button>

          <button
            onClick={resetToDefault}
            className="px-3 py-2 bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer font-semibold"
            title="Reset all portfolio content and settings to default"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Reset All</span>
          </button>

          <button
            onClick={() => setIsEditMode(false)}
            className="p-2 bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer ml-1"
            title="Exit Edit Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Section Manager Modal / Dropdown */}
      {showSectionManager && (
        <div className="fixed top-36 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md bg-[#0c0c0c] border border-white/30 p-6 shadow-2xl text-[#F5F5F5] font-mono">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/15">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">Manage Sections</h3>
            <button onClick={() => setShowSectionManager(false)} className="text-[#929292] hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#929292] mb-4">Toggle section visibility or customize order.</p>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {['hero', 'creative-work', 'creative-space', 'development', 'academic', 'about', 'skills', 'contact'].map((sec) => (
              <div key={sec} className="flex items-center justify-between p-2.5 bg-[#121212] border border-white/10">
                <span className="text-xs uppercase">{sec.replace('-', ' ')}</span>
                <button
                  onClick={() => {}}
                  className="px-2.5 py-1 text-[10px] bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" /> Visible
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowSectionManager(false)}
            className="w-full mt-4 py-2 bg-white text-black text-xs font-bold hover:bg-[#C0C0C0] transition-colors cursor-pointer"
          >
            Close Manager
          </button>
        </div>
      )}

      {/* Modals */}
      <AddProjectModal isOpen={isAddProjectOpen} onClose={() => setIsAddProjectOpen(false)} />
      <EditContentModal isOpen={isEditContentOpen} onClose={() => setIsEditContentOpen(false)} />
      <ExportImportModal isOpen={isExportImportOpen} onClose={() => setIsExportImportOpen(false)} />
    </>
  );
}
