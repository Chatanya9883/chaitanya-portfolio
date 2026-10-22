import { useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  FileCode, 
  ExternalLink, 
  Github, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Check, 
  X, 
  Eye, 
  Sparkles,
  School,
  FileCheck
} from 'lucide-react';
import SectionReveal3D from './SectionReveal3D';
import Tilt3D from './Tilt3D';
import { AcademicItem } from '../data/portfolioData';

const PRESET_ACADEMIC_TEMPLATES = [
  {
    title: 'Tata Group (Tata iQ) — GenAI Powered Data Analytics Job Simulation',
    category: 'Certificates & Hackathons' as const,
    semesterOrDate: '2025',
    description: 'Completed practical industry tasks in Exploratory Data Analysis (EDA), no-code predictive modeling for credit delinquency risk (Geldium Finance case), ethical AI system design, and executive data storytelling on Forage.',
    technologies: 'Generative AI, Data Analytics, Predictive Modeling, Responsible AI, Business Storytelling',
    badge: 'Forage Verified Certificate'
  },
  {
    title: 'Data Structures & Algorithms Laboratory Submissions',
    category: 'Practical & Lab Work' as const,
    semesterOrDate: '3rd & 4th Semester',
    description: 'Comprehensive collection of laboratory implementations in C and C++ covering singly/doubly linked lists, binary search trees, AVL trees, and sorting algorithms as part of SATI curriculum.',
    technologies: 'C, C++, Data Structures, GCC',
    badge: 'SATI Curriculum'
  },
  {
    title: 'Object-Oriented Programming with Java — Mini Project',
    category: 'Academic Mini-Projects' as const,
    semesterOrDate: '4th Semester',
    description: 'Collegiate mini-project modeling a student attendance and laboratory schedule tracking system using Java OOP principles, inheritance, interfaces, and exception handling.',
    technologies: 'Java, OOP, File I/O, Collections',
    badge: 'Coursework Verified'
  },
  {
    title: 'Relational Database Schema Design & SQL Queries',
    category: 'Programming Assignments' as const,
    semesterOrDate: '4th Semester',
    description: 'Academic database project designing 3NF normalized schemas for a campus library and event registration system, including complex joins, triggers, and stored procedures.',
    technologies: 'SQL, MySQL, ER Modeling, Relational Algebra',
    badge: 'DBMS Lab'
  },
  {
    title: 'Hackathon Finalist / Competition Certificate',
    category: 'Certificates & Hackathons' as const,
    semesterOrDate: '2024',
    description: 'Secured podium placement in regional collegiate hackathon by pitching and architecting an algorithmic student management and resource reservation platform.',
    technologies: 'React, Node.js, Team Leadership, Rapid Prototyping',
    badge: 'Hackathon Milestone'
  }
];

export default function AcademicHub() {
  const { 
    state, 
    updateTechnicalProject, 
    updateAcademicItem, 
    addAcademicItem, 
    deleteAcademicItem,
    updateEducation 
  } = usePortfolio();

  const academicItems = state.academicItems;
  const tataProject = state.technicalProjects.find((p) => p.id === 'tata-iq-genai-analytics');
  const education = state.aboutDetails.education;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [previewCertUrl, setPreviewCertUrl] = useState<string | null>(null);
  const [previewCertTitle, setPreviewCertTitle] = useState<string>('Certificate');
  const [notification, setNotification] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  // Modal States
  const [isEditingItemModalOpen, setIsEditingItemModalOpen] = useState<boolean>(false);
  const [itemFormData, setItemFormData] = useState<Partial<AcademicItem> & { technologiesText?: string }>({
    id: '',
    title: '',
    subjectOrCategory: 'Certificates & Hackathons',
    description: '',
    semesterOrDate: '2025',
    technologiesUsed: [],
    technologiesText: '',
    repoUrl: '',
    docUrl: '',
    certificateUrl: '',
    verifiedBadge: ''
  });
  const [isNewItem, setIsNewItem] = useState<boolean>(false);

  // Education / Academic History Modal State
  const [isEducationModalOpen, setIsEducationModalOpen] = useState<boolean>(false);
  const [educationFormData, setEducationFormData] = useState({
    college: education?.college || 'Samrat Ashok Technological Institute (SATI), Vidisha, M.P.',
    degree: education?.degree || 'B.Tech in Computer Science & Engineering',
    courseworkText: (education?.coursework || []).join(', ')
  });

  // Dedicated hidden file input ref for direct card upload
  const activeUploadItemIdRef = useRef<string | null>(null);
  const cardFileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    'All',
    'Certificates & Hackathons',
    'Practical & Lab Work',
    'Academic Mini-Projects',
    'Programming Assignments',
    'Notes & Learning Resources'
  ];

  const filteredItems = activeCategory === 'All'
    ? academicItems
    : academicItems.filter((item) => item.subjectOrCategory === activeCategory);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Direct certificate upload from individual card
  const handleDirectCardCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetItemId = activeUploadItemIdRef.current;
    if (!file || !targetItemId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateAcademicItem(targetItemId, { certificateUrl: result });
        if (targetItemId === 'acad-tata-iq' && tataProject) {
          updateTechnicalProject(tataProject.id, { certificateUrl: result });
        }
        triggerToast('Certificate uploaded and attached successfully!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const openDirectUploadFor = (itemId: string) => {
    activeUploadItemIdRef.current = itemId;
    cardFileInputRef.current?.click();
  };

  const removeCertificate = (itemId: string) => {
    updateAcademicItem(itemId, { certificateUrl: undefined });
    if (itemId === 'acad-tata-iq' && tataProject) {
      updateTechnicalProject(tataProject.id, { certificateUrl: undefined });
    }
    triggerToast('Certificate removed.');
  };

  // Open Edit Modal for existing item
  const openEditItemModal = (item: AcademicItem) => {
    const isTata = item.id === 'acad-tata-iq';
    const effectiveCert = isTata ? (tataProject?.certificateUrl || item.certificateUrl) : item.certificateUrl;

    setItemFormData({
      id: item.id,
      title: item.title,
      subjectOrCategory: item.subjectOrCategory,
      description: item.description,
      semesterOrDate: item.semesterOrDate,
      technologiesUsed: item.technologiesUsed,
      technologiesText: (item.technologiesUsed || []).join(', '),
      repoUrl: item.repoUrl || '',
      docUrl: item.docUrl || '',
      certificateUrl: effectiveCert || '',
      verifiedBadge: item.verifiedBadge || ''
    });
    setIsNewItem(false);
    setIsEditingItemModalOpen(true);
  };

  // Open Modal for adding new item
  const openAddItemModal = () => {
    setItemFormData({
      id: `acad-${Date.now()}`,
      title: '',
      subjectOrCategory: (activeCategory !== 'All' ? activeCategory : 'Certificates & Hackathons') as any,
      description: '',
      semesterOrDate: '2025',
      technologiesUsed: ['Computer Science'],
      technologiesText: 'Computer Science, Algorithms',
      repoUrl: '',
      docUrl: '',
      certificateUrl: '',
      verifiedBadge: 'Verified Submission'
    });
    setIsNewItem(true);
    setIsEditingItemModalOpen(true);
  };

  // Save Academic Item from modal
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemFormData.title?.trim()) {
      triggerToast('Please provide a title for the academic item.');
      return;
    }

    const techArray = (itemFormData.technologiesText || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedItem: AcademicItem = {
      id: itemFormData.id || `acad-${Date.now()}`,
      title: itemFormData.title.trim(),
      subjectOrCategory: (itemFormData.subjectOrCategory || 'Certificates & Hackathons') as any,
      description: itemFormData.description || '',
      semesterOrDate: itemFormData.semesterOrDate || '2025',
      technologiesUsed: techArray.length > 0 ? techArray : ['CSE'],
      repoUrl: itemFormData.repoUrl?.trim() || undefined,
      docUrl: itemFormData.docUrl?.trim() || undefined,
      certificateUrl: itemFormData.certificateUrl?.trim() || undefined,
      verifiedBadge: itemFormData.verifiedBadge?.trim() || undefined
    };

    if (isNewItem) {
      addAcademicItem(updatedItem);
      triggerToast('New academic item added to repository!');
    } else {
      updateAcademicItem(updatedItem.id, updatedItem);
      if (updatedItem.id === 'acad-tata-iq' && tataProject) {
        updateTechnicalProject(tataProject.id, { certificateUrl: updatedItem.certificateUrl });
      }
      triggerToast('Academic item updated successfully!');
    }

    setIsEditingItemModalOpen(false);
  };

  // Trigger Delete confirmation dialog (zero window.confirm)
  const handleDeleteItem = (itemId: string, itemTitle: string) => {
    setItemToDelete({ id: itemId, title: itemTitle });
  };

  // Actually execute delete
  const executeDeleteItem = (itemId: string, itemTitle?: string) => {
    deleteAcademicItem(itemId);
    if (isEditingItemModalOpen && itemFormData.id === itemId) {
      setIsEditingItemModalOpen(false);
    }
    setItemToDelete(null);
    triggerToast(`Deleted "${itemTitle || 'Academic item'}" from repository.`);
  };

  // Certificate upload in modal
  const handleModalCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setItemFormData((prev) => ({ ...prev, certificateUrl: result }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Save Education History
  const handleSaveEducation = (e: React.FormEvent) => {
    e.preventDefault();
    const courseworkArray = educationFormData.courseworkText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    updateEducation({
      college: educationFormData.college.trim(),
      degree: educationFormData.degree.trim(),
      coursework: courseworkArray
    });

    setIsEducationModalOpen(false);
    triggerToast('Academic history & college credentials updated!');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Practical & Lab Work':
        return <FileCode className="w-4 h-4 text-[#F5F5F5]" />;
      case 'Academic Mini-Projects':
        return <BookOpen className="w-4 h-4 text-[#C0C0C0]" />;
      case 'Certificates & Hackathons':
        return <Award className="w-4 h-4 text-white" />;
      default:
        return <GraduationCap className="w-4 h-4 text-[#929292]" />;
    }
  };

  return (
    <section id="academic" className="py-28 relative border-t border-white/[0.08] bg-[#050505]">
      {/* Hidden file input for single-click card certificate uploads */}
      <input
        ref={cardFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleDirectCardCertUpload}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-10">
        
        {/* Floating Toast Notification */}
        {notification && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-2xl backdrop-blur-md rounded-none">
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

        {/* Section Header with Quick Controls */}
        <SectionReveal3D className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0] flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-[#F5F5F5]" />
              <span>
                ACADEMIC REPOSITORY · {education?.college ? education.college.split(',')[0].toUpperCase() : 'SATI VIDISHA CSE'}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-[#F5F5F5]">
              ACADEMIC HUB
            </h2>
            
            <p className="text-sm md:text-base text-[#929292] font-normal leading-relaxed">
              Curricular coursework, lab submissions in C/C++/Java, relational database assignments, and verifiable collegiate certifications.
            </p>

            {/* Editable Education Summary Pill */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0e0e0e] border border-white/15 text-xs text-zinc-300 font-mono">
                <School className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-semibold text-white">{education?.degree || 'B.Tech in CSE'}</span>
                <span className="text-zinc-600">·</span>
                <span>{education?.college?.split('(')[1]?.replace(')', '') || 'SATI Vidisha'}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEducationFormData({
                    college: education?.college || 'Samrat Ashok Technological Institute (SATI), Vidisha, M.P.',
                    degree: education?.degree || 'B.Tech in Computer Science & Engineering',
                    courseworkText: (education?.coursework || []).join(', ')
                  });
                  setIsEducationModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white hover:text-white border border-white/20 hover:border-white/40 text-xs font-mono transition-colors cursor-pointer"
                title="Edit college name, degree, and semester coursework"
              >
                <Edit3 className="w-3 h-3 text-[#C0C0C0]" />
                <span>Edit Academic History</span>
              </button>
            </div>
          </div>

          {/* Action Button: Add Academic Work */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={openAddItemModal}
              className="px-4 py-2.5 bg-white text-black font-semibold text-xs font-mono hover:bg-[#C0C0C0] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-white/10"
            >
              <Plus className="w-4 h-4" />
              <span>Add Academic Work / Certificate</span>
            </button>
          </div>
        </SectionReveal3D>

        {/* Academic Categories Filter Tabs */}
        <div className="flex items-center p-1 bg-[#0c0c0c] border border-white/10 overflow-x-auto max-w-full shadow-2xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#F5F5F5] text-black font-semibold'
                  : 'text-[#929292] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Academic Repository Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => {
            const isTataCert = item.id === 'acad-tata-iq';
            const certUrl = isTataCert ? (tataProject?.certificateUrl || item.certificateUrl) : item.certificateUrl;

            return (
              <SectionReveal3D key={item.id} delay={idx * 0.05}>
                <Tilt3D maxAngle={3}>
                  <div className="h-full bg-[#0a0a0a] border border-white/10 hover:border-white/30 p-6 md:p-7 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-5 relative group">
                    
                    {/* Fine metallic accent on card hover */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="space-y-3.5">
                      {/* Top Bar: Category, Date & Card Action Buttons */}
                      <div className="flex items-center justify-between text-xs font-mono gap-2 border-b border-white/5 pb-2.5">
                        <div className="flex items-center gap-2 text-[#C0C0C0] truncate">
                          {getCategoryIcon(item.subjectOrCategory)}
                          <span className="truncate">{item.subjectOrCategory}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] text-[#929292] mr-1">{item.semesterOrDate}</span>
                          
                          {/* Card Edit Button */}
                          <button
                            type="button"
                            onClick={() => openEditItemModal(item)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/20 text-[10px] font-mono transition-colors cursor-pointer"
                            title="Edit this academic work"
                          >
                            <Edit3 className="w-3 h-3 text-[#C0C0C0]" />
                            <span>Edit</span>
                          </button>

                          {/* Card Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-950/50 hover:bg-red-900/70 text-red-300 hover:text-white border border-red-500/40 text-[10px] font-mono transition-colors cursor-pointer"
                            title="Delete this academic item"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold font-display text-white group-hover:text-white transition-colors leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#929292] leading-relaxed">
                        {item.description}
                      </p>

                      {/* Certificate Upload / Preview Section */}
                      {certUrl ? (
                        <div className="space-y-2 pt-1">
                          <div
                            onClick={() => {
                              setPreviewCertUrl(certUrl);
                              setPreviewCertTitle(item.title);
                            }}
                            className="h-32 w-full bg-black border border-white/20 overflow-hidden cursor-pointer relative group/img shadow-inner"
                            title="Click to view full certificate"
                          >
                            <img 
                              src={certUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform" 
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center gap-2 text-white text-xs font-mono transition-opacity">
                              <Eye className="w-4 h-4" />
                              <span>View Certificate</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-zinc-400">
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewCertUrl(certUrl);
                                setPreviewCertTitle(item.title);
                              }}
                              className="inline-flex items-center gap-1 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            >
                              <Award className="w-3 h-3 text-emerald-400" />
                              <span>View Full Size</span>
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openDirectUploadFor(item.id)}
                                className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                title="Replace certificate image"
                              >
                                <Upload className="w-3 h-3" />
                                <span>Replace</span>
                              </button>
                              
                              <span className="text-zinc-600">·</span>

                              <button
                                type="button"
                                onClick={() => removeCertificate(item.id)}
                                className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                                title="Remove certificate from this entry"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Direct Certificate Upload Prompt on Cards */
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => openDirectUploadFor(item.id)}
                            className="w-full py-2.5 px-3 border border-dashed border-white/20 hover:border-white/50 bg-white/[0.02] hover:bg-white/[0.05] text-[11px] font-mono text-zinc-400 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5 text-zinc-400" />
                            <span>+ Upload Certificate / Credential</span>
                          </button>
                        </div>
                      )}

                      {/* Verified Badge */}
                      {item.verifiedBadge && (
                        <div className="pt-1">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#141414] border border-white/15 text-[10px] font-mono text-white">
                            <FileCheck className="w-3 h-3 text-emerald-400" />
                            <span>{item.verifiedBadge}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tech Stack & Links */}
                    <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                      <div className="flex flex-wrap gap-1.5">
                        {item.technologiesUsed?.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 bg-[#141414] border border-white/10 text-[10px] font-mono text-[#C0C0C0]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs font-mono">
                        <div className="flex items-center gap-3">
                          {item.repoUrl && (
                            <a
                              href={item.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[#929292] hover:text-white transition-colors"
                            >
                              <Github className="w-3.5 h-3.5" />
                              <span>Code</span>
                            </a>
                          )}
                          
                          {item.docUrl && (
                            <a
                              href={item.docUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[#C0C0C0] hover:text-white transition-colors"
                            >
                              <span>Reference</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          {!item.repoUrl && !item.docUrl && (
                            <span className="text-[10px] text-zinc-500 font-mono">Curricular Verified</span>
                          )}
                        </div>

                        <span className="text-[10px] text-zinc-600">
                          {education?.college?.split('(')[1]?.replace(')', '') || 'SATI CSE'}
                        </span>
                      </div>
                    </div>

                  </div>
                </Tilt3D>
              </SectionReveal3D>
            );
          })}
        </div>

      </div>

      {/* MODAL 1: ADD / EDIT ACADEMIC ITEM MODAL */}
      {isEditingItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div 
            className="relative max-w-2xl w-full bg-[#0c0c0c] border border-white/20 p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-white" />
                  <span>{isNewItem ? 'Create New Entry' : 'Edit Academic Repository Entry'}</span>
                </div>
                <h3 className="text-xl font-bold font-display text-white">
                  {isNewItem ? 'Add Academic Work / Certificate' : 'Edit Academic Submission'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingItemModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick 1-Click Autofill Templates (especially helpful for user) */}
            {isNewItem && (
              <div className="p-3 bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-zinc-400">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Quick Template Presets:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_ACADEMIC_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setItemFormData({
                          ...itemFormData,
                          title: tmpl.title,
                          subjectOrCategory: tmpl.category,
                          semesterOrDate: tmpl.semesterOrDate,
                          description: tmpl.description,
                          technologiesText: tmpl.technologies,
                          verifiedBadge: tmpl.badge
                        });
                      }}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {tmpl.title.split('—')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveItem} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1 uppercase text-[10px]">
                  Title / Milestone Name *
                </label>
                <input
                  type="text"
                  required
                  value={itemFormData.title || ''}
                  onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                  placeholder="e.g. Tata Group (Tata iQ) — GenAI Powered Data Analytics Job Simulation"
                  className="w-full bg-[#141414] border border-white/15 p-2.5 text-white focus:border-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1 uppercase text-[10px]">
                    Category / Track *
                  </label>
                  <select
                    value={itemFormData.subjectOrCategory || 'Certificates & Hackathons'}
                    onChange={(e) => setItemFormData({ ...itemFormData, subjectOrCategory: e.target.value as any })}
                    className="w-full bg-[#141414] border border-white/15 p-2.5 text-white focus:border-white outline-none cursor-pointer"
                  >
                    <option value="Certificates & Hackathons">Certificates & Hackathons</option>
                    <option value="Practical & Lab Work">Practical & Lab Work</option>
                    <option value="Academic Mini-Projects">Academic Mini-Projects</option>
                    <option value="Programming Assignments">Programming Assignments</option>
                    <option value="Notes & Learning Resources">Notes & Learning Resources</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 uppercase text-[10px]">
                    Semester or Academic Year
                  </label>
                  <input
                    type="text"
                    value={itemFormData.semesterOrDate || ''}
                    onChange={(e) => setItemFormData({ ...itemFormData, semesterOrDate: e.target.value })}
                    placeholder="e.g. 2025, 4th Semester, 3rd & 4th Semester"
                    className="w-full bg-[#141414] border border-white/15 p-2.5 text-white focus:border-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase text-[10px]">
                  Academic Description & Learning Highlights
                </label>
                <textarea
                  rows={3}
                  value={itemFormData.description || ''}
                  onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                  placeholder="Summarize the coursework problem, implementation details, algorithm used, or certificate milestone..."
                  className="w-full bg-[#141414] border border-white/15 p-2.5 text-white focus:border-white outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase text-[10px]">
                  Technologies / Subjects Used (comma-separated)
                </label>
                <input
                  type="text"
                  value={itemFormData.technologiesText || ''}
                  onChange={(e) => setItemFormData({ ...itemFormData, technologiesText: e.target.value })}
                  placeholder="e.g. Generative AI, Python, C++, Data Structures, MySQL"
                  className="w-full bg-[#141414] border border-white/15 p-2.5 text-white focus:border-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1 uppercase text-[10px]">
                    Verified Badge Label (optional)
                  </label>
                  <input
                    type="text"
                    value={itemFormData.verifiedBadge || ''}
                    onChange={(e) => setItemFormData({ ...itemFormData, verifiedBadge: e.target.value })}
                    placeholder="e.g. Forage Verified Certificate, SATI Curriculum"
                    className="w-full bg-[#141414] border border-white/15 p-2.5 text-white focus:border-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 uppercase text-[10px]">
                    GitHub Code Repository URL (optional)
                  </label>
                  <input
                    type="url"
                    value={itemFormData.repoUrl || ''}
                    onChange={(e) => setItemFormData({ ...itemFormData, repoUrl: e.target.value })}
                    placeholder="https://github.com/Chatanya9883/..."
                    className="w-full bg-[#141414] border border-white/15 p-2.5 text-white focus:border-white outline-none"
                  />
                </div>
              </div>

              {/* Certificate File Upload / Image URL Box */}
              <div className="p-4 bg-[#141414] border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase font-bold text-white flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Upload Certificate / Credential Image</span>
                  </div>
                  {itemFormData.certificateUrl && (
                    <button
                      type="button"
                      onClick={() => setItemFormData({ ...itemFormData, certificateUrl: '' })}
                      className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      Clear Certificate
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">Upload File (Image/PDF screenshot)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleModalCertUpload}
                      className="w-full text-[10px] text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-[10px] file:bg-white file:text-black hover:file:bg-zinc-200 file:cursor-pointer cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">Or Certificate Image URL</label>
                    <input
                      type="text"
                      value={itemFormData.certificateUrl || ''}
                      onChange={(e) => setItemFormData({ ...itemFormData, certificateUrl: e.target.value })}
                      placeholder="https://... or data:image/..."
                      className="w-full bg-[#0e0e0e] border border-white/15 p-2 text-[10px] text-white focus:border-white outline-none"
                    />
                  </div>
                </div>

                {itemFormData.certificateUrl && (
                  <div className="mt-2 border border-white/20 p-2 bg-black flex items-center gap-3">
                    <img 
                      src={itemFormData.certificateUrl} 
                      alt="Certificate Preview" 
                      className="h-16 w-24 object-cover border border-white/15" 
                    />
                    <div className="text-[10px] text-zinc-400">
                      <span className="text-emerald-400 block font-semibold">✓ Certificate Image Attached</span>
                      <span>This will preview on your academic card and expand into full size when clicked.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                {!isNewItem ? (
                  <button
                    type="button"
                    onClick={() => {
                      setItemToDelete({ id: itemFormData.id!, title: itemFormData.title || 'Academic Item' });
                    }}
                    className="px-3.5 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-500/30 text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Delete this entry completely"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Delete Entry</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingItemModalOpen(false)}
                    className="px-4 py-2 border border-white/15 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-white text-black font-semibold hover:bg-zinc-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isNewItem ? 'Add to Academic Hub' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ACADEMIC HISTORY & DEGREE MODAL */}
      {isEducationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div 
            className="relative max-w-xl w-full bg-[#0c0c0c] border border-white/20 p-6 md:p-8 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-white" />
                  <span>Credentials & Education Details</span>
                </div>
                <h3 className="text-xl font-bold font-display text-white">
                  Edit Academic History & Degree
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEducationModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEducation} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1 uppercase text-[10px]">
                  College / Institute Name
                </label>
                <input
                  type="text"
                  required
                  value={educationFormData.college}
                  onChange={(e) => setEducationFormData({ ...educationFormData, college: e.target.value })}
                  placeholder="e.g. Samrat Ashok Technological Institute (SATI), Vidisha, M.P."
                  className="w-full bg-[#141414] border border-white/15 p-2.5 text-white focus:border-white outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase text-[10px]">
                  Degree & Branch
                </label>
                <input
                  type="text"
                  required
                  value={educationFormData.degree}
                  onChange={(e) => setEducationFormData({ ...educationFormData, degree: e.target.value })}
                  placeholder="e.g. B.Tech in Computer Science & Engineering"
                  className="w-full bg-[#141414] border border-white/15 p-2.5 text-white focus:border-white outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase text-[10px]">
                  Core Coursework & Subjects (comma-separated)
                </label>
                <textarea
                  rows={4}
                  value={educationFormData.courseworkText}
                  onChange={(e) => setEducationFormData({ ...educationFormData, courseworkText: e.target.value })}
                  placeholder="Data Structures & Algorithms, Object-Oriented Programming (Java/C++), Database Management Systems, Operating Systems, Computer Networks..."
                  className="w-full bg-[#141414] border border-white/15 p-2.5 text-white focus:border-white outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEducationModalOpen(false)}
                  className="px-4 py-2 border border-white/15 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black font-semibold hover:bg-zinc-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: HIGH-RES CERTIFICATE LIGHTBOX VIEWER */}
      {previewCertUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
          onClick={() => setPreviewCertUrl(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#0c0c0c] border border-white/25 p-4 md:p-6 shadow-2xl space-y-4" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase text-white font-bold tracking-wide">
                  {previewCertTitle}
                </span>
              </div>
              <button 
                onClick={() => setPreviewCertUrl(null)} 
                className="text-xs font-mono text-zinc-400 hover:text-white px-2 py-1 bg-white/5 hover:bg-white/15 border border-white/10 cursor-pointer"
              >
                Close ✕
              </button>
            </div>
            
            <div className="w-full max-h-[75vh] overflow-auto flex items-center justify-center bg-black/80 p-2 border border-white/10">
              <img 
                src={previewCertUrl} 
                alt={previewCertTitle} 
                className="max-w-full max-h-[70vh] object-contain shadow-2xl" 
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-1">
              <span>Verified Collegiate Milestone & Certificate</span>
              <a 
                href={previewCertUrl} 
                download="academic-certificate.png"
                target="_blank" 
                rel="noreferrer" 
                className="text-white underline hover:text-zinc-300"
              >
                Open in Full Tab
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION MODAL (No window.confirm, 100% reliable in iframes) */}
      {itemToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setItemToDelete(null)}
        >
          <div 
            className="relative max-w-md w-full bg-[#0e0e0e] border border-red-500/40 p-6 space-y-5 shadow-2xl font-mono text-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 bg-red-950/70 border border-red-500/40">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Delete Academic Item?</h4>
                <p className="text-[11px] text-zinc-400">This will remove this entry from your portfolio.</p>
              </div>
            </div>

            <div className="p-3 bg-black/80 border border-white/10 text-xs space-y-1">
              <span className="text-zinc-500 block text-[10px] uppercase font-mono">Item to delete:</span>
              <span className="font-semibold text-white break-words">{itemToDelete.title}</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 border border-white/20 text-zinc-300 hover:text-white hover:bg-white/5 text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeDeleteItem(itemToDelete.id, itemToDelete.title)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-950"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
