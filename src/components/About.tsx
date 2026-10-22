import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { TimelineEntry } from '../data/portfolioData';
import { GraduationCap, Palette, Users, Brain, MapPin, Calendar, Trophy, TrendingUp, Edit3, Plus, Trash2, X, Check, Save } from 'lucide-react';
import SectionReveal3D from './SectionReveal3D';
import Tilt3D from './Tilt3D';

export default function About() {
  const { state, updateTimelineEntry, addTimelineEntry, deleteTimelineEntry } = usePortfolio();
  const aboutDetails = state.aboutDetails;
  const timelineData = state.timelineData;

  const [editingEntry, setEditingEntry] = useState<TimelineEntry | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveEntry = () => {
    if (!editingEntry) return;
    if (!editingEntry.role.trim()) {
      showNotification('Please enter a role or title.');
      return;
    }

    if (isCreatingNew) {
      addTimelineEntry(editingEntry);
      showNotification('New experience added & saved successfully!');
    } else {
      updateTimelineEntry(editingEntry.id, editingEntry);
      showNotification('Experience updated & saved successfully!');
    }
    setEditingEntry(null);
    setIsCreatingNew(false);
  };

  const handleDeleteEntry = (id: string) => {
    deleteTimelineEntry(id);
    showNotification('Experience deleted.');
    setEditingEntry(null);
    setIsCreatingNew(false);
  };

  const handleAddHighlight = () => {
    if (!editingEntry) return;
    setEditingEntry({
      ...editingEntry,
      highlights: [...editingEntry.highlights, '']
    });
  };

  const handleUpdateHighlight = (idx: number, val: string) => {
    if (!editingEntry) return;
    const updated = [...editingEntry.highlights];
    updated[idx] = val;
    setEditingEntry({
      ...editingEntry,
      highlights: updated
    });
  };

  const handleDeleteHighlight = (idx: number) => {
    if (!editingEntry) return;
    const updated = editingEntry.highlights.filter((_, i) => i !== idx);
    setEditingEntry({
      ...editingEntry,
      highlights: updated
    });
  };

  const getPillarIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Palette className="w-4 h-4 text-[#F5F5F5]" />;
      case 1:
        return <GraduationCap className="w-4 h-4 text-[#C0C0C0]" />;
      case 2:
        return <Trophy className="w-4 h-4 text-white" />;
      case 3:
        return <TrendingUp className="w-4 h-4 text-[#C0C0C0]" />;
      default:
        return <Brain className="w-4 h-4 text-[#929292]" />;
    }
  };

  return (
    <section id="about" className="py-28 relative border-t border-white/[0.08] bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-16">
        
        {/* Section Header */}
        <SectionReveal3D className="space-y-3 max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0] flex items-center gap-2">
            <span className="w-2 h-0.5 bg-white" />
            <span>BACKGROUND & IDENTITY</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-[#F5F5F5]">
            ABOUT & EXPERIENCE
          </h2>
          <p className="text-sm md:text-base text-[#929292] font-normal leading-relaxed">
            Bridging creative graphic communications with Computer Science engineering at Samrat Ashok Technological Institute.
          </p>
        </SectionReveal3D>

        {/* Concise Narrative & Education Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Authentic Bio */}
          <SectionReveal3D delay={0.1} className="lg:col-span-7 space-y-5 text-sm sm:text-base text-[#929292] leading-relaxed">
            {aboutDetails.summary.map((paragraph, idx) => (
              <p key={idx} className="text-[#F5F5F5]">
                {paragraph}
              </p>
            ))}

            {/* Key Fact Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-[#0a0a0a] border border-white/10">
                <span className="text-[10px] font-mono uppercase text-[#929292] block">Degree</span>
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {aboutDetails.education?.degree || 'B.Tech in CSE'}
                </span>
              </div>
              <div className="p-4 bg-[#0a0a0a] border border-white/10">
                <span className="text-[10px] font-mono uppercase text-[#929292] block">College</span>
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {aboutDetails.education?.college 
                    ? (aboutDetails.education.college.includes('(') 
                        ? aboutDetails.education.college.split('(')[1].replace(')', '').split(',')[0] 
                        : aboutDetails.education.college)
                    : 'SATI Vidisha'}
                </span>
              </div>
              <div className="p-4 bg-[#0a0a0a] border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono uppercase text-[#929292] block">Primary Craft</span>
                <span className="text-xs sm:text-sm font-semibold text-white">Graphic Designer</span>
              </div>
            </div>
          </SectionReveal3D>

          {/* Right Column: 4 Distinctive Focus Pillars */}
          <SectionReveal3D delay={0.2} className="lg:col-span-5 space-y-3">
            {aboutDetails.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all space-y-1.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#121212] border border-white/10">
                    {getPillarIcon(idx)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-display text-white">{pillar.title}</h4>
                    <span className="text-[10px] font-mono text-[#C0C0C0] block">{pillar.focus}</span>
                  </div>
                </div>
                <p className="text-xs text-[#929292] leading-relaxed pt-1">
                  {pillar.description}
                </p>
              </div>
            ))}
          </SectionReveal3D>

        </div>

        {/* Compact Verifiable Experience Timeline */}
        <div className="pt-8 border-t border-white/[0.08] space-y-8">
          
          {/* Notification banner */}
          {notification && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> {notification}
              </span>
              <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0] flex items-center gap-2">
                <span>CHRONOLOGY</span>
                <span className="text-zinc-600">·</span>
                <span className="text-emerald-400">EDITABLE ON DEMAND</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold font-display text-white">
                Practical Experience & Milestones
              </h3>
            </div>

            {/* Quick Add Experience Button */}
            <button
              onClick={() => {
                setEditingEntry({
                  id: `time-${Date.now()}`,
                  period: '2025',
                  role: '',
                  organization: '',
                  location: 'Remote',
                  type: 'Esports & Management',
                  description: '',
                  highlights: ['']
                });
                setIsCreatingNew(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-[#C0C0C0] text-xs font-mono font-semibold transition-all cursor-pointer shadow-lg self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Experience</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {timelineData.map((entry, idx) => (
              <SectionReveal3D key={entry.id} delay={idx * 0.06}>
                <Tilt3D maxAngle={4}>
                  <div className="h-full p-6 bg-[#0a0a0a] border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl relative group">
                    
                    {/* Metallic Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="space-y-4">
                      {/* Top Header: Type, Period & Edit Action */}
                      <div className="flex items-center justify-between text-xs font-mono gap-2 flex-wrap">
                        <span className="text-[#C0C0C0] px-2 py-0.5 bg-white/[0.04] border border-white/10">
                          {entry.type}
                        </span>
                        
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => {
                              setEditingEntry({ ...entry });
                              setIsCreatingNew(false);
                            }}
                            className="text-[#929292] hover:text-white flex items-center gap-1 font-mono hover:underline cursor-pointer"
                            title="Click to edit time period"
                          >
                            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{entry.period}</span>
                          </button>

                          {/* Primary Edit Button */}
                          <button
                            onClick={() => {
                              setEditingEntry({ ...entry });
                              setIsCreatingNew(false);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white text-white hover:text-black border border-white/25 hover:border-white text-xs font-mono font-medium transition-all cursor-pointer shadow-sm"
                            title="Edit this experience entry"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 
                            onClick={() => {
                              setEditingEntry({ ...entry });
                              setIsCreatingNew(false);
                            }}
                            className="text-lg font-bold font-display text-white hover:text-emerald-300 transition-colors cursor-pointer"
                            title="Click to edit role"
                          >
                            {entry.role}
                          </h4>
                        </div>
                        <div className="text-xs text-[#929292] flex items-center gap-1.5 mt-0.5 font-mono">
                          <span className="text-white font-medium">{entry.organization}</span>
                          <span className="text-zinc-600">·</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-[#929292]" />
                            {entry.location}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#929292] leading-relaxed">
                        {entry.description}
                      </p>

                      <ul className="space-y-1.5 pt-3 border-t border-white/[0.06]">
                        {entry.highlights.map((hl, hIdx) => (
                          <li key={hIdx} className="text-xs text-[#F5F5F5] flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-[#C0C0C0] mt-1 shrink-0" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Quick Edit Footer */}
                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                      <button
                        onClick={() => {
                          setEditingEntry({ ...entry });
                          setIsCreatingNew(false);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white text-zinc-200 hover:text-black border border-white/15 hover:border-white text-xs font-mono font-medium transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Edit Experience & Timeline Details</span>
                      </button>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase hidden sm:inline">
                        Editable
                      </span>
                    </div>

                  </div>
                </Tilt3D>
              </SectionReveal3D>
            ))}
          </div>
        </div>

      </div>

      {/* Experience Timeline Editor Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto font-mono">
          <div className="relative w-full max-w-2xl bg-[#0c0c0c] border border-white/25 shadow-2xl my-auto text-[#F5F5F5] flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-white/15 flex items-center justify-between bg-[#101010]">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-white">
                  {isCreatingNew ? 'Add New Experience Milestone' : 'Edit Experience Milestone'}
                </h3>
              </div>
              <button
                onClick={() => setEditingEntry(null)}
                className="p-1.5 text-[#929292] hover:text-white border border-white/10 hover:border-white/30 transition-all cursor-pointer bg-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase text-[#929292] mb-1.5">
                    Role / Title <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingEntry.role}
                    onChange={(e) => setEditingEntry({ ...editingEntry, role: e.target.value })}
                    placeholder="e.g. Esports Organization Founder & Tournament Director"
                    className="w-full bg-[#121212] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-[#929292] mb-1.5">
                    Organization / Company <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingEntry.organization}
                    onChange={(e) => setEditingEntry({ ...editingEntry, organization: e.target.value })}
                    placeholder="e.g. Competitive Esports Organization"
                    className="w-full bg-[#121212] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase text-[#929292] mb-1.5">
                    Period / Time Range
                  </label>
                  <input
                    type="text"
                    value={editingEntry.period}
                    onChange={(e) => setEditingEntry({ ...editingEntry, period: e.target.value })}
                    placeholder="e.g. 2023 — Present"
                    className="w-full bg-[#121212] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none mb-1.5"
                  />
                  <div className="flex flex-wrap gap-1">
                    {['2023 — Present', '2024 — Present', '2025', '2023 — 2024'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setEditingEntry({ ...editingEntry, period: preset })}
                        className="px-1.5 py-0.5 text-[10px] bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-[#929292] mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingEntry.location}
                    onChange={(e) => setEditingEntry({ ...editingEntry, location: e.target.value })}
                    placeholder="e.g. Hybrid / Remote"
                    className="w-full bg-[#121212] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-[#929292] mb-1.5">
                    Track / Category
                  </label>
                  <select
                    value={editingEntry.type}
                    onChange={(e) => setEditingEntry({ ...editingEntry, type: e.target.value as any })}
                    className="w-full bg-[#121212] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none cursor-pointer"
                  >
                    <option value="Esports & Management">Esports & Management</option>
                    <option value="Influencer Marketing">Influencer Marketing</option>
                    <option value="Technical">Technical</option>
                    <option value="Design & Creative">Design & Creative</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#929292] mb-1.5">
                  Summary Description
                </label>
                <textarea
                  rows={3}
                  value={editingEntry.description}
                  onChange={(e) => setEditingEntry({ ...editingEntry, description: e.target.value })}
                  placeholder="Concise overview of your responsibilities, operations, and achievements..."
                  className="w-full bg-[#121212] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none resize-none"
                />
              </div>

              {/* Highlights Bullet Points */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] uppercase text-[#C0C0C0]">
                    Key Highlights & Achievements ({editingEntry.highlights.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Highlight
                  </button>
                </div>

                <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                  {editingEntry.highlights.map((hl, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-500 font-mono w-4">{hIdx + 1}.</span>
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => handleUpdateHighlight(hIdx, e.target.value)}
                        placeholder={`Highlight #${hIdx + 1}`}
                        className="flex-1 bg-[#121212] border border-white/15 p-2 text-xs text-white focus:border-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteHighlight(hIdx)}
                        className="p-2 text-red-400 hover:text-red-300 bg-red-950/30 border border-red-500/20 transition-colors cursor-pointer shrink-0"
                        title="Delete highlight"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-5 border-t border-white/15 bg-[#101010] flex items-center justify-between">
              <div>
                {!isCreatingNew && (
                  <button
                    type="button"
                    onClick={() => handleDeleteEntry(editingEntry.id)}
                    className="px-3.5 py-2 bg-red-950/50 border border-red-500/40 text-red-400 hover:bg-red-500/20 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 border border-white/20 text-[#929292] hover:text-white hover:bg-white/5 text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEntry}
                  className="px-5 py-2 bg-white text-black font-bold text-xs hover:bg-[#C0C0C0] transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Experience</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
