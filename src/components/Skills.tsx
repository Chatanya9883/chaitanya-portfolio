import { useState } from 'react';
import { Layers, Plus, Edit3, Trash2, Check, X, Sparkles, FolderPlus } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import SectionReveal3D from './SectionReveal3D';

const QUICK_SUGGESTIONS = [
  { name: 'OBS Studio', note: 'Live streaming overlays, scene orchestration & multi-track audio' },
  { name: 'YouTube Live Broadcasting', note: 'Stream health monitoring, latency optimization & live chat management' },
  { name: 'Influencer Marketing', note: 'Brand deal negotiation, creator roster management & campaign tracking' },
  { name: 'Sponsorship Pitching', note: 'Deck design, brand deliverables & commercial contract execution' },
  { name: 'Adobe Premiere Pro', note: 'Video cutting, highlight reels, sound syncing & export presets' },
  { name: 'Generative AI Tools', note: 'Prompt engineering, visual generation pipelines, workflow integration' },
  { name: 'SQL & Database Design', note: 'Normalized relational schemas, queries, joins & stored procedures' },
  { name: 'Tournament Operations', note: 'Bracket seeding, rulebook enforcement & dispute resolution' },
  { name: 'Canva Pro', note: 'Rapid social campaign assets, presentation decks' },
  { name: 'Git & GitHub', note: 'Version control, branch workflows, pull requests & code collaboration' }
];

export default function Skills() {
  const {
    state,
    addSkillToCategory,
    updateSkillInCategory,
    deleteSkillFromCategory,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory
  } = usePortfolio();

  const skillCategories = state.skillCategories || [];

  // Skill Add / Edit Modal State
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [selectedCatIdx, setSelectedCatIdx] = useState<number>(0);
  const [editingSkillIdx, setEditingSkillIdx] = useState<number | null>(null);
  const [skillName, setSkillName] = useState('');
  const [skillNote, setSkillNote] = useState('');

  // Category Add / Edit Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCatIdx, setEditingCatIdx] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  // Open modal to add a skill to a specific category
  const handleOpenAddSkill = (catIdx: number = 0) => {
    setSelectedCatIdx(catIdx);
    setEditingSkillIdx(null);
    setSkillName('');
    setSkillNote('');
    setIsSkillModalOpen(true);
  };

  // Open modal to edit an existing skill
  const handleOpenEditSkill = (catIdx: number, sIdx: number) => {
    const skill = skillCategories[catIdx]?.skills[sIdx];
    if (!skill) return;
    setSelectedCatIdx(catIdx);
    setEditingSkillIdx(sIdx);
    setSkillName(skill.name);
    setSkillNote(skill.note);
    setIsSkillModalOpen(true);
  };

  // Save skill (Add or Update)
  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    if (editingSkillIdx !== null) {
      updateSkillInCategory(selectedCatIdx, editingSkillIdx, {
        name: skillName.trim(),
        note: skillNote.trim()
      });
      triggerToast(`Updated skill: "${skillName.trim()}"`);
    } else {
      addSkillToCategory(selectedCatIdx, {
        name: skillName.trim(),
        note: skillNote.trim() || 'Software proficiency & practical workflow'
      });
      triggerToast(`Added skill: "${skillName.trim()}"`);
    }

    setIsSkillModalOpen(false);
  };

  // Delete skill
  const handleDeleteSkill = (catIdx: number, sIdx: number, sName: string) => {
    deleteSkillFromCategory(catIdx, sIdx);
    triggerToast(`Deleted skill: "${sName}"`);
  };

  // Open modal to add a new category
  const handleOpenAddCategory = () => {
    setEditingCatIdx(null);
    setCategoryName('');
    setCategoryDesc('');
    setIsCategoryModalOpen(true);
  };

  // Open modal to edit category
  const handleOpenEditCategory = (catIdx: number) => {
    const cat = skillCategories[catIdx];
    if (!cat) return;
    setEditingCatIdx(catIdx);
    setCategoryName(cat.category);
    setCategoryDesc(cat.description);
    setIsCategoryModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingCatIdx !== null) {
      updateSkillCategory(editingCatIdx, {
        category: categoryName.trim(),
        description: categoryDesc.trim()
      });
      triggerToast(`Updated category: "${categoryName.trim()}"`);
    } else {
      addSkillCategory({
        category: categoryName.trim(),
        description: categoryDesc.trim() || 'Domain competencies & specialized toolkit.',
        skills: []
      });
      triggerToast(`Created category: "${categoryName.trim()}"`);
    }

    setIsCategoryModalOpen(false);
  };

  // Delete Category
  const handleDeleteCategory = (catIdx: number, catName: string) => {
    deleteSkillCategory(catIdx);
    triggerToast(`Deleted category: "${catName}"`);
  };

  return (
    <section id="skills" className="py-28 relative border-t border-white/[0.08] bg-[#050505]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#111111] border border-emerald-500/50 text-white font-mono text-xs shadow-2xl rounded-sm backdrop-blur-md animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage('')}
            className="ml-2 text-zinc-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-12">
        
        {/* Section Header with Direct Action Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionReveal3D className="space-y-3 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0] flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#F5F5F5]" />
              <span>CAPABILITIES & ARSENAL</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-[#F5F5F5]">
              SKILLS & TOOLS
            </h2>
            <p className="text-sm md:text-base text-[#929292] font-normal leading-relaxed">
              Concrete software proficiencies, programming languages, and practical workflows without fake percentage bars or arbitrary meters.
            </p>
          </SectionReveal3D>

          {/* Section Action Buttons: Add Skill & Add Category */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => handleOpenAddSkill(0)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-[#C0C0C0] text-xs font-mono font-semibold transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Skill</span>
            </button>

            <button
              onClick={handleOpenAddCategory}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#141414] hover:bg-[#1f1f1f] text-zinc-300 hover:text-white border border-white/20 text-xs font-mono font-medium transition-all cursor-pointer active:scale-95"
            >
              <FolderPlus className="w-4 h-4 text-[#C0C0C0]" />
              <span>+ Add Category</span>
            </button>
          </div>
        </div>

        {/* Skill Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, catIdx) => (
            <SectionReveal3D key={cat.category + catIdx} delay={catIdx * 0.05}>
              <div className="h-full p-6 md:p-7 bg-[#0a0a0a] border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between space-y-5 shadow-xl relative group">
                
                {/* Metallic Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-4">
                  {/* Category Header with Index & Controls */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold font-display text-white">
                          {cat.category}
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-500">
                          ({cat.skills.length})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-[#929292] mr-1">
                          0{catIdx + 1}
                        </span>

                        {/* Quick Edit Category */}
                        <button
                          onClick={() => handleOpenEditCategory(catIdx)}
                          title="Edit Category Name & Description"
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick Delete Category (if has 0 skills or upon user request) */}
                        <button
                          onClick={() => handleDeleteCategory(catIdx, cat.category)}
                          title="Delete this Category"
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#929292] mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* Skills List with In-Place Edit & Delete Controls */}
                  <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
                    {cat.skills.length === 0 ? (
                      <div className="py-6 text-center border border-dashed border-white/10 text-xs text-zinc-500 font-mono">
                        No skills in this category yet.
                      </div>
                    ) : (
                      cat.skills.map((skill, sIdx) => (
                        <div
                          key={skill.name + sIdx}
                          className="p-3 bg-[#111111] border border-white/[0.06] hover:border-white/20 transition-colors group/skill relative"
                        >
                          <div className="flex items-start justify-between gap-2 text-xs">
                            <span className="font-mono font-medium text-white group-hover/skill:text-emerald-400 transition-colors">
                              {skill.name}
                            </span>

                            {/* Direct Skill Edit & Delete Action Buttons */}
                            <div className="flex items-center gap-1 opacity-90 sm:opacity-70 group-hover/skill:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleOpenEditSkill(catIdx, sIdx)}
                                title={`Edit "${skill.name}"`}
                                className="p-1 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                              >
                                <Edit3 className="w-3 h-3 text-emerald-400" />
                              </button>
                              <button
                                onClick={() => handleDeleteSkill(catIdx, sIdx, skill.name)}
                                title={`Delete "${skill.name}"`}
                                className="p-1 text-zinc-400 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors"
                              >
                                <Trash2 className="w-3 h-3 text-red-400" />
                              </button>
                            </div>
                          </div>

                          <p className="text-[11px] text-[#929292] mt-0.5 leading-relaxed pr-8">
                            {skill.note}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Bottom Card Action: Add Skill to This Category */}
                <button
                  onClick={() => handleOpenAddSkill(catIdx)}
                  className="w-full py-2.5 px-3 border border-dashed border-white/15 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.06] text-zinc-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-none group-hover:border-white/30"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+ Add Skill to {cat.category}</span>
                </button>
              </div>
            </SectionReveal3D>
          ))}
        </div>
      </div>

      {/* MODAL: ADD / EDIT SKILL */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto font-mono">
          <div className="relative w-full max-w-lg bg-[#0e0e0e] border border-white/20 p-6 md:p-7 shadow-2xl text-white space-y-6 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <h3 className="text-base font-bold uppercase tracking-wider text-white">
                  {editingSkillIdx !== null ? 'Edit Skill Details' : 'Add New Skill'}
                </h3>
              </div>
              <button
                onClick={() => setIsSkillModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-5">
              {/* Target Category Select */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  Select Category
                </label>
                <select
                  value={selectedCatIdx}
                  onChange={(e) => setSelectedCatIdx(Number(e.target.value))}
                  disabled={editingSkillIdx !== null}
                  className="w-full bg-[#141414] border border-white/15 p-2.5 text-xs text-white focus:border-white outline-none"
                >
                  {skillCategories.map((cat, idx) => (
                    <option key={cat.category + idx} value={idx}>
                      {cat.category} ({cat.skills.length} skills)
                    </option>
                  ))}
                </select>
              </div>

              {/* Skill Name */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  Skill or Software Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OBS Studio, Adobe Premiere, Python, Generative AI"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="w-full bg-[#141414] border border-white/20 p-2.5 text-xs text-white focus:border-emerald-400 outline-none"
                />
              </div>

              {/* Skill Note / Description */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  Proficiency Note or Scope Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Multi-scene switching, audio routing, overlays and stream bitrate optimization"
                  value={skillNote}
                  onChange={(e) => setSkillNote(e.target.value)}
                  className="w-full bg-[#141414] border border-white/20 p-2.5 text-xs text-white focus:border-emerald-400 outline-none resize-none"
                />
              </div>

              {/* Quick Preset Recommendations */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Click to Autofill Suggestions:</span>
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {QUICK_SUGGESTIONS.map((sug) => (
                    <button
                      key={sug.name}
                      type="button"
                      onClick={() => {
                        setSkillName(sug.name);
                        setSkillNote(sug.note);
                      }}
                      className="px-2 py-1 text-[10px] bg-white/[0.04] hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                    >
                      + {sug.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-3">
                {editingSkillIdx !== null ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteSkill(selectedCatIdx, editingSkillIdx, skillName);
                      setIsSkillModalOpen(false);
                    }}
                    className="px-3.5 py-2 bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/30 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Skill</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSkillModalOpen(false)}
                    className="px-4 py-2 border border-white/15 text-zinc-300 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-semibold flex items-center gap-1.5 shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingSkillIdx !== null ? 'Save Changes' : 'Add Skill'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto font-mono">
          <div className="relative w-full max-w-lg bg-[#0e0e0e] border border-white/20 p-6 md:p-7 shadow-2xl text-white space-y-6 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <FolderPlus className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold uppercase tracking-wider text-white">
                  {editingCatIdx !== null ? 'Edit Skill Category' : 'Create New Skill Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-5">
              {/* Category Name */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Esports & Broadcasting, Influencer Marketing, Cloud & DevOps"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full bg-[#141414] border border-white/20 p-2.5 text-xs text-white focus:border-emerald-400 outline-none"
                />
              </div>

              {/* Category Description */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  Category Description / Focus
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Tournament management, commercial brand partnerships, creator negotiations."
                  value={categoryDesc}
                  onChange={(e) => setCategoryDesc(e.target.value)}
                  className="w-full bg-[#141414] border border-white/20 p-2.5 text-xs text-white focus:border-emerald-400 outline-none resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-3">
                {editingCatIdx !== null ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteCategory(editingCatIdx, categoryName);
                      setIsCategoryModalOpen(false);
                    }}
                    className="px-3.5 py-2 bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/30 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Category</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 border border-white/15 text-zinc-300 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-semibold flex items-center gap-1.5 shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingCatIdx !== null ? 'Save Category' : 'Create Category'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
