import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PERSONAL_INFO, 
  ABOUT_DETAILS, 
  SKILL_CATEGORIES, 
  DESIGN_CASE_STUDIES, 
  TECHNICAL_PROJECTS, 
  ACADEMIC_ITEMS, 
  TIMELINE_DATA,
  DesignCaseStudy,
  TechnicalProject,
  AcademicItem,
  SkillCategory,
  TimelineEntry
} from '../data/portfolioData';
import { saveToIndexedDB, loadFromIndexedDB } from '../utils/indexedDbStorage';

interface PortfolioState {
  personalInfo: typeof PERSONAL_INFO;
  aboutDetails: typeof ABOUT_DETAILS;
  skillCategories: SkillCategory[];
  designCaseStudies: DesignCaseStudy[];
  technicalProjects: TechnicalProject[];
  academicItems: AcademicItem[];
  timelineData: TimelineEntry[];
  sectionVisibility: Record<string, boolean>;
  sectionOrder: string[];
  sectionStyles: Record<string, { bg?: string; padding?: string }>;
}

const DEFAULT_STATE: PortfolioState = {
  personalInfo: PERSONAL_INFO,
  aboutDetails: ABOUT_DETAILS,
  skillCategories: SKILL_CATEGORIES,
  designCaseStudies: DESIGN_CASE_STUDIES,
  technicalProjects: TECHNICAL_PROJECTS,
  academicItems: ACADEMIC_ITEMS,
  timelineData: TIMELINE_DATA,
  sectionVisibility: {
    hero: true,
    'creative-work': true,
    'creative-space': true,
    development: true,
    academic: true,
    about: true,
    skills: true,
    contact: true
  },
  sectionOrder: ['hero', 'creative-work', 'creative-space', 'development', 'academic', 'about', 'skills', 'contact'],
  sectionStyles: {}
};

interface SelectedElement {
  type: 'text' | 'image' | 'section' | 'project';
  id: string;
  sectionKey?: string;
  field?: string;
  value?: string;
}

interface PortfolioContextType {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  isAdminUnlocked: boolean;
  unlockAdmin: (passcode?: string) => boolean;
  lockAdmin: () => void;
  state: PortfolioState;
  hasUnsavedChanges: boolean;
  selectedElement: SelectedElement | null;
  setSelectedElement: (el: SelectedElement | null) => void;
  updatePersonalInfo: (field: keyof typeof PERSONAL_INFO, value: string) => void;
  updateDesignCaseStudy: (id: string, updated: Partial<DesignCaseStudy>) => void;
  addDesignCaseStudy: (study: DesignCaseStudy) => void;
  addMultipleDesignCaseStudies: (studies: DesignCaseStudy[]) => void;
  deleteDesignCaseStudy: (id: string) => void;
  toggleShowInAllWork: (id: string) => void;
  clearAllUploadedArtworks: () => void;
  restoreAllImages: () => void;
  updateTechnicalProject: (id: string, updated: Partial<TechnicalProject>) => void;
  addTechnicalProject: (proj: TechnicalProject) => void;
  deleteTechnicalProject: (id: string) => void;
  updateTimelineEntry: (id: string, updated: Partial<TimelineEntry>) => void;
  addTimelineEntry: (entry: TimelineEntry) => void;
  deleteTimelineEntry: (id: string) => void;
  updateAcademicItem: (id: string, updated: Partial<AcademicItem>) => void;
  addAcademicItem: (item: AcademicItem) => void;
  deleteAcademicItem: (id: string) => void;
  updateAcademicItems: (items: AcademicItem[]) => void;
  updateEducation: (edu: Partial<typeof ABOUT_DETAILS.education>) => void;
  updateSkillCategories: (cats: SkillCategory[]) => void;
  updateSkillCategory: (categoryIndex: number, updated: Partial<SkillCategory>) => void;
  addSkillCategory: (cat: SkillCategory) => void;
  deleteSkillCategory: (categoryIndex: number) => void;
  addSkillToCategory: (categoryIndex: number, skill: { name: string; note: string }) => void;
  updateSkillInCategory: (categoryIndex: number, skillIndex: number, updated: Partial<{ name: string; note: string }>) => void;
  deleteSkillFromCategory: (categoryIndex: number, skillIndex: number) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  reorderSections: (newOrder: string[]) => void;
  updateSectionStyle: (sectionId: string, style: { bg?: string; padding?: string }) => void;
  saveChanges: () => void;
  publishChanges: () => void;
  resetToDefault: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  toastNotification: string | null;
  setToastNotification: (msg: string | null) => void;
  restoreOriginalDesign: () => void;
  exportJSON: () => void;
  importJSON: (jsonString: string) => boolean;
  saveToPermanentMemory: () => Promise<boolean>;
  isPermanentMemorySaving: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const LEGACY_PLACEHOLDER_TECH_IDS = new Set([
  'tech-exam-eval',
  'tech-dsa-visualizer',
  'tech-c-file-system',
  'tech-ai-vision-exp',
  'tech-portfolio-web'
]);

function migratePortfolioState(raw: PortfolioState): PortfolioState {
  const cleanedTech = (raw.technicalProjects || [])
    .filter((p) => !LEGACY_PLACEHOLDER_TECH_IDS.has(p.id))
    .map((p) =>
      p.id === 'tata-iq-genai-analytics'
        ? { ...p, githubUrl: undefined }
        : p
    );
  const hasTataTech = cleanedTech.some((p) => p.id === 'tata-iq-genai-analytics');
  const finalTech = hasTataTech
    ? cleanedTech
    : [...TECHNICAL_PROJECTS, ...cleanedTech];

  const finalAcademic = Array.isArray(raw.academicItems)
    ? raw.academicItems.filter((a) => a.id !== 'acad-5')
    : DEFAULT_STATE.academicItems;

  const updatedTimeline3 = TIMELINE_DATA.find((t) => t.id === 'time-3')!;
  const updatedInfluencer = TIMELINE_DATA.find((t) => t.id === 'time-influencer-marketing')!;

  const existingTimeline = (raw.timelineData || DEFAULT_STATE.timelineData).map((t) => {
    // Force migrate any legacy coordinator/media designer role or old time-3
    if (
      t.id === 'time-3' || 
      (t.role && (t.role.includes('Coordinator') || t.role.includes('Media Designer') || t.role.includes('Collegiate Esports')))
    ) {
      return updatedTimeline3;
    }
    return t;
  });
  const hasTataTimeline = existingTimeline.some((t) => t.id === 'time-tata-iq');
  const hasInfluencer = existingTimeline.some((t) => t.id === 'time-influencer-marketing');
  
  let finalTimeline = hasTataTimeline ? existingTimeline : [TIMELINE_DATA[0], ...existingTimeline];
  if (!hasInfluencer) {
    const t3Index = finalTimeline.findIndex((t) => t.id === 'time-3');
    if (t3Index !== -1) {
      finalTimeline.splice(t3Index + 1, 0, updatedInfluencer);
    } else {
      finalTimeline.push(updatedInfluencer);
    }
  }

  // Migrate avatar to user's photo if empty or legacy github/unsplash placeholder
  const rawAvatar = raw.personalInfo?.avatarUrl;
  const isOldDefaultAvatar = !rawAvatar || 
    rawAvatar.includes('Chatanya9883.png') || 
    rawAvatar.includes('unsplash.com');
  const finalAvatar = isOldDefaultAvatar ? '/assets/aistudio/image_6021aaae.png' : rawAvatar;

  // Restore and preserve all images and artworks without stripping or filtering
  const rawStudies = Array.isArray(raw.designCaseStudies) && raw.designCaseStudies.length > 0
    ? raw.designCaseStudies
    : DEFAULT_STATE.designCaseStudies;

  const hasAxeJersey = rawStudies.some((s: any) => s.id === 'design-axe-owner-jersey');
  const finalDesignStudies = hasAxeJersey
    ? rawStudies
    : [DEFAULT_STATE.designCaseStudies[0], ...rawStudies];

  return {
    ...DEFAULT_STATE,
    ...raw,
    personalInfo: {
      ...DEFAULT_STATE.personalInfo,
      ...(raw.personalInfo || {}),
      avatarUrl: finalAvatar
    },
    aboutDetails: {
      ...DEFAULT_STATE.aboutDetails,
      ...(raw.aboutDetails || {}),
      education: {
        ...DEFAULT_STATE.aboutDetails.education,
        ...(raw.aboutDetails?.education || {})
      },
      pillars: DEFAULT_STATE.aboutDetails.pillars
    },
    designCaseStudies: finalDesignStudies,
    technicalProjects: finalTech,
    academicItems: finalAcademic,
    timelineData: finalTimeline,
    skillCategories: (raw.skillCategories && Array.isArray(raw.skillCategories) && raw.skillCategories.length > 0)
      ? raw.skillCategories
      : DEFAULT_STATE.skillCategories
  };
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => {
      setToastNotification(prev => (prev === msg ? null : prev));
    }, 4500);
  };

  const [state, setState] = useState<PortfolioState>(() => {
    // Ensure admin is always unlocked in storage
    localStorage.setItem('chaitanya_admin_unlocked', 'true');
    const saved = localStorage.getItem('chaitanya_portfolio_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migrated = migratePortfolioState(parsed);
        localStorage.setItem('chaitanya_portfolio_state', JSON.stringify(migrated));
        return migrated;
      } catch (e) {
        console.error('Failed to load saved state', e);
      }
    }
    return DEFAULT_STATE;
  });

  // Admin access is permanently unlocked for the portfolio owner
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(true);

  const unlockAdmin = (): boolean => {
    setIsAdminUnlocked(true);
    localStorage.setItem('chaitanya_admin_unlocked', 'true');
    return true;
  };

  const lockAdmin = () => {
    // Never lock owner out; just disable edit mode if active
    setIsEditMode(false);
  };

  // Seed history with prior state so Ctrl+Z can restore previous design/photo immediately
  const [portfolioHistory, setPortfolioHistory] = useState<PortfolioState[]>(() => {
    const priorState: PortfolioState = {
      ...state,
      personalInfo: {
        ...state.personalInfo,
        avatarUrl: 'https://github.com/Chatanya9883.png'
      }
    };
    return [priorState, state];
  });
  const [historyIndex, setHistoryIndex] = useState<number>(1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [isPermanentMemorySaving, setIsPermanentMemorySaving] = useState<boolean>(false);

  function safeSavePortfolioState(st: PortfolioState) {
    try {
      localStorage.setItem('chaitanya_portfolio_state', JSON.stringify(st));
    } catch (err) {
      console.warn('localStorage write reached quota; state safely retained in IndexedDB & server permanent memory:', err);
    }
  }

  // Sync state to permanent IndexedDB and Server Disk
  async function syncStateToPermanentStorage(stateToSync: PortfolioState): Promise<PortfolioState> {
    try {
      // 1. Immediately save to browser permanent IndexedDB (no 5MB quota limit)
      await saveToIndexedDB('chaitanya_portfolio_state', stateToSync);

      // 2. Persist to server permanent disk storage (/public/uploads/ & data/portfolio-state.json)
      const res = await fetch('/api/portfolio/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: stateToSync })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          // Server converted bulky base64 data URLs to permanent disk files (/uploads/...)
          await saveToIndexedDB('chaitanya_portfolio_state', data.state);
          safeSavePortfolioState(data.state);
          return data.state;
        }
      }
    } catch (err) {
      console.warn('Permanent storage sync note:', err);
    }
    return stateToSync;
  }

  // Hydrate from permanent memory on startup
  useEffect(() => {
    let isMounted = true;

    async function initPermanentStorage() {
      try {
        // 1. Try server permanent storage first
        const serverRes = await fetch('/api/portfolio/state');
        if (serverRes.ok) {
          const serverData = await serverRes.json();
          if (serverData.success && serverData.state) {
            const migrated = migratePortfolioState(serverData.state);
            if (isMounted) {
              setState(migrated);
              safeSavePortfolioState(migrated);
              await saveToIndexedDB('chaitanya_portfolio_state', migrated);
              return;
            }
          }
        }

        // 2. Try browser IndexedDB permanent storage
        const idbState = await loadFromIndexedDB<PortfolioState>('chaitanya_portfolio_state');
        if (idbState && isMounted) {
          const migrated = migratePortfolioState(idbState);
          setState(migrated);
          safeSavePortfolioState(migrated);
          syncStateToPermanentStorage(migrated);
          return;
        }

        // 3. Fallback: sync initial state to permanent memory
        if (isMounted) {
          syncStateToPermanentStorage(state);
        }
      } catch (err) {
        console.warn('Permanent storage initialization note:', err);
      }
    }

    initPermanentStorage();

    return () => {
      isMounted = false;
    };
  }, []);

  const pushHistory = (newState: PortfolioState) => {
    const sliced = portfolioHistory.slice(Math.max(0, historyIndex - 9), historyIndex + 1);
    sliced.push(newState);
    setPortfolioHistory(sliced);
    setHistoryIndex(sliced.length - 1);
    setState(newState);
    setHasUnsavedChanges(true);
    safeSavePortfolioState(newState);

    // Asynchronously flush to permanent IndexedDB and Server Disk
    syncStateToPermanentStorage(newState).then((cleaned) => {
      if (cleaned && cleaned !== newState) {
        setState(cleaned);
        safeSavePortfolioState(cleaned);
      }
    }).catch((err) => {
      console.warn('Permanent background sync note:', err);
    });
  };

  const saveToPermanentMemory = async (): Promise<boolean> => {
    setIsPermanentMemorySaving(true);
    try {
      const cleaned = await syncStateToPermanentStorage(state);
      setState(cleaned);
      safeSavePortfolioState(cleaned);
      triggerToast('💾 All uploaded images & artworks permanently saved to memory & disk!');
      return true;
    } catch (err) {
      console.error('Failed to save to permanent memory:', err);
      triggerToast('⚠️ Error saving to permanent storage.');
      return false;
    } finally {
      setIsPermanentMemorySaving(false);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setState(portfolioHistory[newIndex]);
      setHasUnsavedChanges(true);
      safeSavePortfolioState(portfolioHistory[newIndex]);
      triggerToast('↩️ Restored previous design (Ctrl + Z)');
    } else {
      triggerToast('ℹ️ Already at initial state');
    }
  };

  const redo = () => {
    if (historyIndex < portfolioHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setState(portfolioHistory[newIndex]);
      setHasUnsavedChanges(true);
      safeSavePortfolioState(portfolioHistory[newIndex]);
      triggerToast('🔁 Redo applied (Ctrl + Y)');
    }
  };

  const restoreOriginalDesign = () => {
    const oldAvatar = 'https://github.com/Chatanya9883.png';
    const newState = {
      ...state,
      personalInfo: {
        ...state.personalInfo,
        avatarUrl: oldAvatar
      }
    };
    pushHistory(newState);
    triggerToast('↩️ Restored previous photo / design (Ctrl + Z to undo)');
  };

  // Global Ctrl + Z (Undo) and Ctrl + Y / Ctrl + Shift + Z (Redo) listener across entire website
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow native undo in inputs/textareas
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < portfolioHistory.length - 1;

  const updatePersonalInfo = (field: keyof typeof PERSONAL_INFO, value: string) => {
    const newState = {
      ...state,
      personalInfo: {
        ...state.personalInfo,
        [field]: value
      }
    };
    pushHistory(newState);
  };

  const updateDesignCaseStudy = (id: string, updated: Partial<DesignCaseStudy>) => {
    const newState = {
      ...state,
      designCaseStudies: state.designCaseStudies.map(item => 
        item.id === id ? { ...item, ...updated } : item
      )
    };
    pushHistory(newState);
  };

  const addDesignCaseStudy = (study: DesignCaseStudy) => {
    const newState = {
      ...state,
      designCaseStudies: [study, ...state.designCaseStudies]
    };
    pushHistory(newState);
  };

  const addMultipleDesignCaseStudies = (studies: DesignCaseStudy[]) => {
    if (!studies || studies.length === 0) return;
    const newState = {
      ...state,
      designCaseStudies: [...studies, ...state.designCaseStudies]
    };
    pushHistory(newState);
  };

  const deleteDesignCaseStudy = (id: string) => {
    const newState = {
      ...state,
      designCaseStudies: state.designCaseStudies.filter(item => item.id !== id)
    };
    pushHistory(newState);
  };

  const toggleShowInAllWork = (id: string) => {
    const target = state.designCaseStudies.find(item => item.id === id);
    if (!target) return;
    const currentVal = target.showInAllWork !== false;
    const nextVal = !currentVal;

    const newState = {
      ...state,
      designCaseStudies: state.designCaseStudies.map(item =>
        item.id === id ? { ...item, showInAllWork: nextVal } : item
      )
    };
    pushHistory(newState);
    triggerToast(
      nextVal
        ? `⭐ Added to Front Page ("All Work")`
        : `📁 Set to Category Only ("${target.category}")`
    );
  };

  const clearAllUploadedArtworks = () => {
    const filtered = state.designCaseStudies.filter(
      (item) =>
        !item.id.startsWith('artwork-') &&
        !item.id.startsWith('custom-') &&
        !item.id.startsWith('batch-') &&
        !(item.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.startsWith('data:'))
    );
    const newState = {
      ...state,
      designCaseStudies: filtered.length > 0 ? filtered : DEFAULT_STATE.designCaseStudies
    };
    pushHistory(newState);
    triggerToast('🧹 Removed all uploaded images from Selected Creative Work');
  };

  const restoreAllImages = () => {
    const newState = {
      ...state,
      designCaseStudies: DEFAULT_STATE.designCaseStudies
    };
    pushHistory(newState);
    triggerToast('✨ Restored all images & creative works!');
  };

  const updateTechnicalProject = (id: string, updated: Partial<TechnicalProject>) => {
    const newState = {
      ...state,
      technicalProjects: state.technicalProjects.map(item =>
        item.id === id ? { ...item, ...updated } : item
      )
    };
    pushHistory(newState);
  };

  const addTechnicalProject = (proj: TechnicalProject) => {
    const newState = {
      ...state,
      technicalProjects: [proj, ...state.technicalProjects]
    };
    pushHistory(newState);
  };

  const deleteTechnicalProject = (id: string) => {
    const newState = {
      ...state,
      technicalProjects: state.technicalProjects.filter(item => item.id !== id)
    };
    pushHistory(newState);
  };

  const updateTimelineEntry = (id: string, updated: Partial<TimelineEntry>) => {
    const newState = {
      ...state,
      timelineData: state.timelineData.map(item =>
        item.id === id ? { ...item, ...updated } : item
      )
    };
    pushHistory(newState);
  };

  const addTimelineEntry = (entry: TimelineEntry) => {
    const newState = {
      ...state,
      timelineData: [entry, ...state.timelineData]
    };
    pushHistory(newState);
  };

  const deleteTimelineEntry = (id: string) => {
    const newState = {
      ...state,
      timelineData: state.timelineData.filter(item => item.id !== id)
    };
    pushHistory(newState);
  };

  const updateAcademicItem = (id: string, updated: Partial<AcademicItem>) => {
    const newState = {
      ...state,
      academicItems: state.academicItems.map(item =>
        item.id === id ? { ...item, ...updated } : item
      )
    };
    pushHistory(newState);
  };

  const addAcademicItem = (item: AcademicItem) => {
    const newState = {
      ...state,
      academicItems: [item, ...state.academicItems]
    };
    pushHistory(newState);
  };

  const deleteAcademicItem = (id: string) => {
    const newState = {
      ...state,
      academicItems: state.academicItems.filter(item => item.id !== id)
    };
    pushHistory(newState);
  };

  const updateAcademicItems = (items: AcademicItem[]) => {
    const newState = {
      ...state,
      academicItems: items
    };
    pushHistory(newState);
  };

  const updateEducation = (edu: Partial<typeof ABOUT_DETAILS.education>) => {
    const newState = {
      ...state,
      aboutDetails: {
        ...state.aboutDetails,
        education: {
          ...state.aboutDetails.education,
          ...edu
        }
      }
    };
    pushHistory(newState);
  };

  const updateSkillCategories = (cats: SkillCategory[]) => {
    const newState = {
      ...state,
      skillCategories: cats
    };
    pushHistory(newState);
  };

  const updateSkillCategory = (categoryIndex: number, updated: Partial<SkillCategory>) => {
    const updatedCategories = state.skillCategories.map((cat, idx) => 
      idx === categoryIndex ? { ...cat, ...updated } : cat
    );
    updateSkillCategories(updatedCategories);
  };

  const addSkillCategory = (cat: SkillCategory) => {
    updateSkillCategories([...state.skillCategories, cat]);
  };

  const deleteSkillCategory = (categoryIndex: number) => {
    updateSkillCategories(state.skillCategories.filter((_, idx) => idx !== categoryIndex));
  };

  const addSkillToCategory = (categoryIndex: number, skill: { name: string; note: string }) => {
    const updatedCategories = state.skillCategories.map((cat, idx) => {
      if (idx === categoryIndex) {
        return {
          ...cat,
          skills: [...cat.skills, skill]
        };
      }
      return cat;
    });
    updateSkillCategories(updatedCategories);
  };

  const updateSkillInCategory = (categoryIndex: number, skillIndex: number, updated: Partial<{ name: string; note: string }>) => {
    const updatedCategories = state.skillCategories.map((cat, idx) => {
      if (idx === categoryIndex) {
        const newSkills = cat.skills.map((s, sIdx) => sIdx === skillIndex ? { ...s, ...updated } : s);
        return {
          ...cat,
          skills: newSkills
        };
      }
      return cat;
    });
    updateSkillCategories(updatedCategories);
  };

  const deleteSkillFromCategory = (categoryIndex: number, skillIndex: number) => {
    const updatedCategories = state.skillCategories.map((cat, idx) => {
      if (idx === categoryIndex) {
        return {
          ...cat,
          skills: cat.skills.filter((_, sIdx) => sIdx !== skillIndex)
        };
      }
      return cat;
    });
    updateSkillCategories(updatedCategories);
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const newState = {
      ...state,
      sectionVisibility: {
        ...state.sectionVisibility,
        [sectionId]: !state.sectionVisibility[sectionId]
      }
    };
    pushHistory(newState);
  };

  const reorderSections = (newOrder: string[]) => {
    const newState = {
      ...state,
      sectionOrder: newOrder
    };
    pushHistory(newState);
  };

  const updateSectionStyle = (sectionId: string, style: { bg?: string; padding?: string }) => {
    const newState = {
      ...state,
      sectionStyles: {
        ...state.sectionStyles,
        [sectionId]: {
          ...(state.sectionStyles[sectionId] || {}),
          ...style
        }
      }
    };
    pushHistory(newState);
  };

  const saveChanges = () => {
    safeSavePortfolioState(state);
    setHasUnsavedChanges(false);
  };

  const publishChanges = () => {
    safeSavePortfolioState(state);
    setHasUnsavedChanges(false);
  };

  const resetToDefault = () => {
    setState(DEFAULT_STATE);
    setPortfolioHistory([DEFAULT_STATE]);
    setHistoryIndex(0);
    try {
      localStorage.removeItem('chaitanya_portfolio_state');
    } catch (e) {
      // ignore
    }
    setHasUnsavedChanges(false);
    setSelectedElement(null);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "chaitanya_portfolio_config.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.personalInfo) {
        setState(parsed);
        pushHistory(parsed);
        safeSavePortfolioState(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON configuration', e);
    }
    return false;
  };

  return (
    <PortfolioContext.Provider value={{
      isEditMode,
      setIsEditMode,
      isAdminUnlocked,
      unlockAdmin,
      lockAdmin,
      state,
      hasUnsavedChanges,
      selectedElement,
      setSelectedElement,
      updatePersonalInfo,
      updateDesignCaseStudy,
      addDesignCaseStudy,
      addMultipleDesignCaseStudies,
      deleteDesignCaseStudy,
      toggleShowInAllWork,
      clearAllUploadedArtworks,
      restoreAllImages,
      updateTechnicalProject,
      addTechnicalProject,
      deleteTechnicalProject,
      updateTimelineEntry,
      addTimelineEntry,
      deleteTimelineEntry,
      updateAcademicItem,
      addAcademicItem,
      deleteAcademicItem,
      updateAcademicItems,
      updateEducation,
      updateSkillCategories,
      updateSkillCategory,
      addSkillCategory,
      deleteSkillCategory,
      addSkillToCategory,
      updateSkillInCategory,
      deleteSkillFromCategory,
      toggleSectionVisibility,
      reorderSections,
      updateSectionStyle,
      saveChanges,
      publishChanges,
      resetToDefault,
      undo,
      redo,
      canUndo,
      canRedo,
      toastNotification,
      setToastNotification,
      restoreOriginalDesign,
      exportJSON,
      importJSON,
      saveToPermanentMemory,
      isPermanentMemorySaving
    }}>
      {children}

      {/* GLOBAL TOAST & UNDO NOTIFICATION */}
      {toastNotification && (
        <div 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 bg-[#0c0c0c]/95 text-white border border-white/30 backdrop-blur-xl shadow-2xl flex items-center gap-3 text-xs font-mono shadow-black/80"
          role="status"
          aria-live="polite"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastNotification}</span>
          <div className="flex items-center gap-1.5 ml-2 border-l border-white/20 pl-2">
            <button
              type="button"
              onClick={() => undo()}
              className="text-[11px] text-zinc-300 hover:text-white underline cursor-pointer"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={() => setToastNotification(null)}
              className="text-zinc-500 hover:text-white text-xs cursor-pointer ml-1"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
