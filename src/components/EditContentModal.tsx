import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, Save, Plus, Trash2, Upload, Image as ImageIcon, Check, Award, GraduationCap } from 'lucide-react';
import { DesignCaseStudy, TechnicalProject, AcademicItem, SkillCategory, TimelineEntry } from '../data/portfolioData';

interface EditContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditContentModal({ isOpen, onClose }: EditContentModalProps) {
  const { 
    state, 
    updatePersonalInfo, 
    deleteDesignCaseStudy,
    deleteTechnicalProject,
    updateTimelineEntry,
    addTimelineEntry,
    deleteTimelineEntry,
    updateAcademicItem,
    addAcademicItem,
    deleteAcademicItem,
    updateEducation,
    addSkillToCategory,
    updateSkillInCategory,
    deleteSkillFromCategory,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'design' | 'tech' | 'images' | 'skills' | 'academic' | 'timeline'>('hero');
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Local form state to prevent focus loss during typing
  const [formData, setFormData] = useState(state.personalInfo);
  const [summaryData, setSummaryData] = useState<string[]>(state.aboutDetails.summary);

  useEffect(() => {
    setFormData(state.personalInfo);
    setSummaryData(state.aboutDetails.summary);
  }, [state.personalInfo, state.aboutDetails.summary, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (field: keyof typeof state.personalInfo, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    updatePersonalInfo(field, value);
    triggerSuccess();
  };

  const handleSummaryChange = (idx: number, value: string) => {
    const newSummary = [...summaryData];
    newSummary[idx] = value;
    setSummaryData(newSummary);
    triggerSuccess();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, avatarUrl: result }));
        updatePersonalInfo('avatarUrl', result);
        triggerSuccess();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemCertUpload = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateAcademicItem(itemId, { certificateUrl: result });
        triggerSuccess();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const triggerSuccess = () => {
    setSuccessMsg('Changes saved instantly!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto font-mono">
      <div className="relative w-full max-w-5xl bg-[#0c0c0c] border border-white/25 shadow-2xl my-auto text-[#F5F5F5] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/15 flex items-center justify-between bg-[#101010]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-emerald-400 animate-pulse" />
            <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-white">
              Universal Website Content & Image Editor
            </h3>
            {successMsg && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-1 border border-emerald-500/30">
                <Check className="w-3 h-3" /> {successMsg}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#929292] hover:text-white border border-white/10 hover:border-white/30 transition-all cursor-pointer bg-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-3 bg-[#080808] border-b border-white/10 overflow-x-auto">
          {[
            { id: 'hero', label: '1. Hero & Personal' },
            { id: 'about', label: '2. About & Bio' },
            { id: 'design', label: '3. Creative Projects' },
            { id: 'tech', label: '4. Tech Projects' },
            { id: 'images', label: '5. Image Uploader' },
            { id: 'skills', label: '6. Skills & Arsenal' },
            { id: 'academic', label: '7. Academic & Certs' },
            { id: 'timeline', label: '8. Experience & Timeline' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs transition-all whitespace-nowrap cursor-pointer border ${
                activeTab === tab.id
                  ? 'bg-white text-black font-semibold border-white'
                  : 'bg-[#121212] text-[#929292] hover:text-white border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: HERO & PERSONAL INFO */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase text-[#929292] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="w-full bg-[#121212] border border-white/20 p-3 text-xs text-white focus:border-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-[#929292] mb-1.5">Primary Headline / Role Pill</label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => handleFieldChange('headline', e.target.value)}
                    className="w-full bg-[#121212] border border-white/20 p-3 text-xs text-white focus:border-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#929292] mb-1.5">Supporting Subtitle</label>
                <input
                  type="text"
                  value={formData.supportingHeadline}
                  onChange={(e) => handleFieldChange('supportingHeadline', e.target.value)}
                  className="w-full bg-[#121212] border border-white/20 p-3 text-xs text-white focus:border-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#929292] mb-1.5">Short Hero Description</label>
                <textarea
                  rows={3}
                  value={formData.shortDescription}
                  onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
                  className="w-full bg-[#121212] border border-white/20 p-3 text-xs text-white focus:border-white outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[11px] uppercase text-[#929292] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="w-full bg-[#121212] border border-white/20 p-3 text-xs text-white focus:border-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-[#929292] mb-1.5">GitHub URL</label>
                  <input
                    type="text"
                    value={formData.github}
                    onChange={(e) => handleFieldChange('github', e.target.value)}
                    className="w-full bg-[#121212] border border-white/20 p-3 text-xs text-white focus:border-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-[#929292] mb-1.5">LinkedIn URL</label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => handleFieldChange('linkedin', e.target.value)}
                    className="w-full bg-[#121212] border border-white/20 p-3 text-xs text-white focus:border-white outline-none"
                  />
                </div>
              </div>

              {/* Avatar Upload */}
              <div className="p-4 bg-[#121212] border border-white/15 space-y-3">
                <label className="block text-[11px] uppercase text-[#C0C0C0]">Profile / Avatar Image Upload</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-black border border-white/25 overflow-hidden flex items-center justify-center">
                    <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="text-xs text-[#929292] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-[#C0C0C0] file:cursor-pointer cursor-pointer"
                    />
                    <p className="text-[10px] text-[#71717a] mt-1">Upload your personal photo or avatar graphic.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT & BIO */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-white">About Biography Summary</h4>
                {summaryData.map((para, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[10px] text-[#929292]">Paragraph {idx + 1}</span>
                    <textarea
                      rows={3}
                      value={para}
                      onChange={(e) => handleSummaryChange(idx, e.target.value)}
                      className="w-full bg-[#121212] border border-white/20 p-3 text-xs text-white focus:border-white outline-none resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DESIGN PROJECTS */}
          {activeTab === 'design' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase font-bold tracking-wider text-white">Manage Selected Creative Work ({state.designCaseStudies.length})</h4>
                <span className="text-xs text-[#929292]">Click 'Add Project' in top toolbar to add more.</span>
              </div>

              <div className="space-y-4">
                {state.designCaseStudies.map((study) => (
                  <div key={study.id} className="p-4 bg-[#121212] border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] text-[#C0C0C0] uppercase font-mono">{study.category} · {study.year}</span>
                      <h5 className="text-sm font-bold text-white">{study.title}</h5>
                      <p className="text-xs text-[#929292] line-clamp-1">{study.brief}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteDesignCaseStudy(study.id)}
                        className="px-3 py-1.5 bg-red-950/50 border border-red-500/40 text-red-400 hover:bg-red-500/20 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TECH PROJECTS */}
          {activeTab === 'tech' && (
            <div className="space-y-6">
              <h4 className="text-xs uppercase font-bold tracking-wider text-white">Manage Technical Projects ({state.technicalProjects.length})</h4>
              <div className="space-y-4">
                {state.technicalProjects.map((proj) => (
                  <div key={proj.id} className="p-4 bg-[#121212] border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] text-[#C0C0C0] uppercase font-mono">{proj.category} · {proj.status}</span>
                      <h5 className="text-sm font-bold text-white">{proj.title}</h5>
                      <p className="text-xs text-[#929292] line-clamp-1">{proj.shortDescription}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteTechnicalProject(proj.id)}
                        className="px-3 py-1.5 bg-red-950/50 border border-red-500/40 text-red-400 hover:bg-red-500/20 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: IMAGE UPLOADER & ASSETS */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <h4 className="text-xs uppercase font-bold tracking-wider text-white">No-Code Image Upload Center</h4>
              <p className="text-xs text-[#929292]">
                Upload and replace portfolio imagery instantly without modifying any source code.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-[#121212] border border-white/15 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black border border-white/20 overflow-hidden flex items-center justify-center">
                      <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white uppercase">Profile Avatar / Photo</h5>
                      <p className="text-[10px] text-[#929292]">Appears in hero and about sections.</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="w-full text-xs text-[#929292] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-[#C0C0C0] file:cursor-pointer cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SKILLS & CATEGORIES */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-white">
                    Skills & Arsenal Categories ({state.skillCategories.length})
                  </h4>
                  <p className="text-xs text-[#929292]">
                    Add, edit, or delete skills and proficiency notes across all categories.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addSkillCategory({
                      category: 'New Domain Category',
                      description: 'Specialized competencies and technical toolsets.',
                      skills: []
                    });
                    triggerSuccess();
                  }}
                  className="px-3.5 py-2 bg-white text-black font-semibold text-xs hover:bg-[#C0C0C0] transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="space-y-6">
                {state.skillCategories.map((cat, catIdx) => (
                  <div key={catIdx} className="p-5 bg-[#121212] border border-white/15 space-y-4">
                    {/* Category Header Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase text-[#929292] mb-1">Category Title</label>
                          <input
                            type="text"
                            value={cat.category}
                            onChange={(e) => {
                              updateSkillCategory(catIdx, { category: e.target.value });
                              triggerSuccess();
                            }}
                            className="w-full bg-[#181818] border border-white/20 p-2 text-xs text-white focus:border-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-[#929292] mb-1">Category Description</label>
                          <input
                            type="text"
                            value={cat.description}
                            onChange={(e) => {
                              updateSkillCategory(catIdx, { description: e.target.value });
                              triggerSuccess();
                            }}
                            className="w-full bg-[#181818] border border-white/20 p-2 text-xs text-white focus:border-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            addSkillToCategory(catIdx, {
                              name: 'New Skill',
                              note: 'Practical workflow and software proficiency'
                            });
                            triggerSuccess();
                          }}
                          className="px-2.5 py-1.5 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-500/30 text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Skill</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteSkillCategory(catIdx);
                            triggerSuccess();
                          }}
                          className="px-2.5 py-1.5 bg-red-950/40 text-red-400 hover:bg-red-900/50 border border-red-500/30 text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete Group</span>
                        </button>
                      </div>
                    </div>

                    {/* Skills in this Category */}
                    <div className="space-y-2.5 pl-2">
                      <div className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">
                        Skills inside "{cat.category}" ({cat.skills.length})
                      </div>
                      {cat.skills.length === 0 ? (
                        <div className="text-xs text-zinc-600 font-mono italic py-2">
                          No skills added to this group yet. Click "+ Add Skill" above to insert.
                        </div>
                      ) : (
                        cat.skills.map((skill, sIdx) => (
                          <div key={sIdx} className="p-3 bg-[#181818] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                              <div>
                                <label className="block text-[9px] uppercase text-zinc-500 mb-0.5">Skill Name</label>
                                <input
                                  type="text"
                                  value={skill.name}
                                  onChange={(e) => {
                                    updateSkillInCategory(catIdx, sIdx, { name: e.target.value });
                                    triggerSuccess();
                                  }}
                                  className="w-full bg-[#111111] border border-white/15 p-1.5 text-xs text-white focus:border-emerald-400 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase text-zinc-500 mb-0.5">Proficiency / Scope Note</label>
                                <input
                                  type="text"
                                  value={skill.note}
                                  onChange={(e) => {
                                    updateSkillInCategory(catIdx, sIdx, { note: e.target.value });
                                    triggerSuccess();
                                  }}
                                  className="w-full bg-[#111111] border border-white/15 p-1.5 text-xs text-zinc-300 focus:border-emerald-400 outline-none"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                deleteSkillFromCategory(catIdx, sIdx);
                                triggerSuccess();
                              }}
                              title={`Delete ${skill.name}`}
                              className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded border border-white/5 transition-colors self-end sm:self-center"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ACADEMIC & CERTIFICATIONS */}
          {activeTab === 'academic' && (
            <div className="space-y-8">
              {/* College & Degree Credentials */}
              <div className="p-5 bg-[#121212] border border-white/15 space-y-4">
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-white flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <span>Academic History & Degree Credentials</span>
                    </h4>
                    <p className="text-[11px] text-[#929292]">
                      Edit college institution, degree program, and core coursework subjects.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase text-[#929292] mb-1">College / University</label>
                    <input
                      type="text"
                      value={state.aboutDetails.education?.college || ''}
                      onChange={(e) => {
                        updateEducation({ college: e.target.value });
                        triggerSuccess();
                      }}
                      className="w-full bg-[#181818] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#929292] mb-1">Degree Program</label>
                    <input
                      type="text"
                      value={state.aboutDetails.education?.degree || ''}
                      onChange={(e) => {
                        updateEducation({ degree: e.target.value });
                        triggerSuccess();
                      }}
                      className="w-full bg-[#181818] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-[#929292] mb-1">
                    Coursework & Curricular Subjects (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(state.aboutDetails.education?.coursework || []).join(', ')}
                    onChange={(e) => {
                      const courses = e.target.value.split(',').map((c) => c.trim()).filter(Boolean);
                      updateEducation({ coursework: courses });
                      triggerSuccess();
                    }}
                    className="w-full bg-[#181818] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none"
                  />
                </div>
              </div>

              {/* Academic Repository Items & Certificates */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-white" />
                      <span>Curricular Submissions, Milestones & Certificates ({state.academicItems.length})</span>
                    </h4>
                    <p className="text-xs text-[#929292]">
                      Upload certificates, edit descriptions, adjust semesters, or add new academic coursework entries.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      addAcademicItem({
                        id: `acad-${Date.now()}`,
                        title: 'New Academic Submission / Certificate',
                        subjectOrCategory: 'Certificates & Hackathons',
                        description: 'Coursework completion, laboratory implementation, or competitive milestone.',
                        semesterOrDate: '2025',
                        technologiesUsed: ['Computer Science', 'Algorithms'],
                        verifiedBadge: 'Verified Submission'
                      });
                      triggerSuccess();
                    }}
                    className="px-3.5 py-2 bg-white text-black font-semibold text-xs hover:bg-[#C0C0C0] transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Academic Item</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {state.academicItems.map((item) => (
                    <div key={item.id} className="p-5 bg-[#121212] border border-white/15 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                        <div className="flex-1">
                          <label className="block text-[10px] uppercase text-[#929292] mb-1">Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              updateAcademicItem(item.id, { title: e.target.value });
                              triggerSuccess();
                            }}
                            className="w-full bg-[#181818] border border-white/20 p-2 text-xs text-white focus:border-white outline-none font-semibold"
                          />
                        </div>

                        {deleteConfirmId === item.id ? (
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <span className="text-[11px] text-red-400 font-mono">Delete item?</span>
                            <button
                              type="button"
                              onClick={() => {
                                deleteAcademicItem(item.id);
                                setDeleteConfirmId(null);
                                triggerSuccess();
                              }}
                              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Yes, Delete</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1.5 bg-white/10 hover:bg-white/20 text-zinc-300 text-xs transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="px-3 py-1.5 bg-red-950/40 text-red-400 hover:bg-red-900/50 border border-red-500/30 text-xs transition-colors flex items-center gap-1 cursor-pointer self-end sm:self-auto"
                            title="Delete this item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase text-[#929292] mb-1">Category</label>
                          <select
                            value={item.subjectOrCategory}
                            onChange={(e) => {
                              updateAcademicItem(item.id, { subjectOrCategory: e.target.value as any });
                              triggerSuccess();
                            }}
                            className="w-full bg-[#181818] border border-white/20 p-2 text-xs text-white focus:border-white outline-none cursor-pointer"
                          >
                            <option value="Certificates & Hackathons">Certificates & Hackathons</option>
                            <option value="Practical & Lab Work">Practical & Lab Work</option>
                            <option value="Academic Mini-Projects">Academic Mini-Projects</option>
                            <option value="Programming Assignments">Programming Assignments</option>
                            <option value="Notes & Learning Resources">Notes & Learning Resources</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-[#929292] mb-1">Semester / Date</label>
                          <input
                            type="text"
                            value={item.semesterOrDate}
                            onChange={(e) => {
                              updateAcademicItem(item.id, { semesterOrDate: e.target.value });
                              triggerSuccess();
                            }}
                            className="w-full bg-[#181818] border border-white/20 p-2 text-xs text-white focus:border-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-[#929292] mb-1">Verified Badge</label>
                          <input
                            type="text"
                            value={item.verifiedBadge || ''}
                            onChange={(e) => {
                              updateAcademicItem(item.id, { verifiedBadge: e.target.value });
                              triggerSuccess();
                            }}
                            placeholder="e.g. Forage Verified Certificate"
                            className="w-full bg-[#181818] border border-white/20 p-2 text-xs text-white focus:border-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-[#929292] mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            updateAcademicItem(item.id, { description: e.target.value });
                            triggerSuccess();
                          }}
                          className="w-full bg-[#181818] border border-white/20 p-2 text-xs text-white focus:border-white outline-none resize-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-[#929292] mb-1">
                          Technologies Used (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={(item.technologiesUsed || []).join(', ')}
                          onChange={(e) => {
                            const techs = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                            updateAcademicItem(item.id, { technologiesUsed: techs });
                            triggerSuccess();
                          }}
                          className="w-full bg-[#181818] border border-white/20 p-2 text-xs text-white focus:border-white outline-none"
                        />
                      </div>

                      {/* Certificate Upload & URL Controls */}
                      <div className="p-3 bg-[#161616] border border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-white flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Certificate Credential</span>
                          </span>
                          {item.certificateUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                updateAcademicItem(item.id, { certificateUrl: undefined });
                                triggerSuccess();
                              }}
                              className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              Remove Certificate
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                          <div>
                            <label className="block text-[9px] uppercase text-zinc-500 mb-1">Upload Certificate File</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleItemCertUpload(item.id, e)}
                              className="w-full text-[10px] text-zinc-400 file:mr-3 file:py-1 file:px-2.5 file:border-0 file:text-[10px] file:bg-white file:text-black hover:file:bg-zinc-200 file:cursor-pointer cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase text-zinc-500 mb-1">Or Certificate Image URL</label>
                            <input
                              type="text"
                              value={item.certificateUrl || ''}
                              onChange={(e) => {
                                updateAcademicItem(item.id, { certificateUrl: e.target.value });
                                triggerSuccess();
                              }}
                              placeholder="https://... or data:image/..."
                              className="w-full bg-[#101010] border border-white/15 p-1.5 text-[10px] text-white focus:border-white outline-none"
                            />
                          </div>
                        </div>

                        {item.certificateUrl && (
                          <div className="mt-2 flex items-center gap-3 p-2 bg-black border border-white/15">
                            <img src={item.certificateUrl} alt="Certificate" className="h-12 w-20 object-cover border border-white/10" />
                            <span className="text-[10px] text-emerald-400 font-mono">
                              ✓ Certificate preview active on academic card
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase text-[#929292] mb-1">GitHub URL</label>
                          <input
                            type="url"
                            value={item.repoUrl || ''}
                            onChange={(e) => {
                              updateAcademicItem(item.id, { repoUrl: e.target.value });
                              triggerSuccess();
                            }}
                            className="w-full bg-[#181818] border border-white/20 p-2 text-xs text-white focus:border-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-[#929292] mb-1">Reference URL</label>
                          <input
                            type="url"
                            value={item.docUrl || ''}
                            onChange={(e) => {
                              updateAcademicItem(item.id, { docUrl: e.target.value });
                              triggerSuccess();
                            }}
                            className="w-full bg-[#181818] border border-white/20 p-2 text-xs text-white focus:border-white outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: EXPERIENCE & TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-white">
                    Practical Experience & Timeline ({state.timelineData.length})
                  </h4>
                  <p className="text-xs text-[#929292]">
                    Edit dates, roles, organizations, descriptions, and achievements in real time.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newEntry: TimelineEntry = {
                      id: `time-${Date.now()}`,
                      period: '2025',
                      role: 'New Role / Position',
                      organization: 'Organization Name',
                      location: 'Remote',
                      type: 'Esports & Management',
                      description: 'Overview of work and responsibilities...',
                      highlights: ['Key achievement or highlight']
                    };
                    addTimelineEntry(newEntry);
                    triggerSuccess();
                  }}
                  className="px-3.5 py-2 bg-white text-black font-semibold text-xs hover:bg-[#C0C0C0] transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-6">
                {state.timelineData.map((entry) => (
                  <div key={entry.id} className="p-5 bg-[#121212] border border-white/15 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <span className="text-[11px] font-mono uppercase text-[#C0C0C0] bg-white/[0.05] px-2.5 py-1 border border-white/10 self-start">
                        {entry.type} · {entry.period}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          deleteTimelineEntry(entry.id);
                          triggerSuccess();
                        }}
                        className="px-2.5 py-1 bg-red-950/40 text-red-400 hover:bg-red-900/50 border border-red-500/30 text-[11px] transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Entry</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase text-[#929292] mb-1">Role / Title</label>
                        <input
                          type="text"
                          value={entry.role}
                          onChange={(e) => {
                            updateTimelineEntry(entry.id, { role: e.target.value });
                            triggerSuccess();
                          }}
                          className="w-full bg-[#181818] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-[#929292] mb-1">Organization / Company</label>
                        <input
                          type="text"
                          value={entry.organization}
                          onChange={(e) => {
                            updateTimelineEntry(entry.id, { organization: e.target.value });
                            triggerSuccess();
                          }}
                          className="w-full bg-[#181818] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase text-[#929292] mb-1">Period / Years</label>
                        <input
                          type="text"
                          value={entry.period}
                          onChange={(e) => {
                            updateTimelineEntry(entry.id, { period: e.target.value });
                            triggerSuccess();
                          }}
                          className="w-full bg-[#181818] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-[#929292] mb-1">Location</label>
                        <input
                          type="text"
                          value={entry.location}
                          onChange={(e) => {
                            updateTimelineEntry(entry.id, { location: e.target.value });
                            triggerSuccess();
                          }}
                          className="w-full bg-[#181818] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-[#929292] mb-1">Category / Track</label>
                        <select
                          value={entry.type}
                          onChange={(e) => {
                            updateTimelineEntry(entry.id, { type: e.target.value as any });
                            triggerSuccess();
                          }}
                          className="w-full bg-[#181818] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none cursor-pointer"
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
                      <label className="block text-[10px] uppercase text-[#929292] mb-1">Summary Description</label>
                      <textarea
                        rows={2}
                        value={entry.description}
                        onChange={(e) => {
                          updateTimelineEntry(entry.id, { description: e.target.value });
                          triggerSuccess();
                        }}
                        className="w-full bg-[#181818] border border-white/20 p-2.5 text-xs text-white focus:border-white outline-none resize-none"
                      />
                    </div>

                    {/* Bullet Highlights */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10px] uppercase text-[#C0C0C0]">
                          Bullet Highlights ({entry.highlights.length})
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            updateTimelineEntry(entry.id, {
                              highlights: [...entry.highlights, '']
                            });
                            triggerSuccess();
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Bullet
                        </button>
                      </div>

                      <div className="space-y-2">
                        {entry.highlights.map((hl, hlIdx) => (
                          <div key={hlIdx} className="flex items-center gap-2">
                            <span className="text-[11px] text-zinc-500 font-mono w-4">{hlIdx + 1}.</span>
                            <input
                              type="text"
                              value={hl}
                              onChange={(e) => {
                                const newHl = [...entry.highlights];
                                newHl[hlIdx] = e.target.value;
                                updateTimelineEntry(entry.id, { highlights: newHl });
                                triggerSuccess();
                              }}
                              className="flex-1 bg-[#181818] border border-white/15 p-2 text-xs text-white focus:border-white outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newHl = entry.highlights.filter((_, i) => i !== hlIdx);
                                updateTimelineEntry(entry.id, { highlights: newHl });
                                triggerSuccess();
                              }}
                              className="p-2 text-red-400 hover:text-red-300 bg-red-950/30 border border-red-500/20 cursor-pointer"
                              title="Delete bullet"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/15 bg-[#101010] flex items-center justify-between">
          <p className="text-xs text-[#929292]">Changes apply in real time and persist automatically.</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-black font-bold text-xs hover:bg-[#C0C0C0] transition-colors cursor-pointer"
          >
            Done Editing
          </button>
        </div>

      </div>
    </div>
  );
}
