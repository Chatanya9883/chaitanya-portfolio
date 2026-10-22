export interface DesignCaseStudy {
  id: string;
  title: string;
  category: 'Posters & Social Media' | 'Branding & Visual Identity' | 'Esports & Gaming' | 'Thumbnails & Digital Creatives' | 'Other Creative Work';
  brief: string;
  audience: string;
  role: string;
  direction: string;
  process: string[];
  deliverables: string[];
  software: string[];
  year: string;
  clientOrContext: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
  svgVisualType: 'poster' | 'brand' | 'social' | 'thumb' | 'artwork';
  imageUrl?: string;
  showInAllWork?: boolean;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface TechnicalProject {
  id: string;
  title: string;
  category: 'C & Java Programming' | 'Python Applications' | 'Web Development' | 'AI & Data Experiments' | 'Academic Mini-Projects' | 'Automation & Tools';
  shortDescription: string;
  problemSolved: string;
  featuresImplemented: string[];
  technologies: string[];
  myContribution: string;
  githubUrl?: string;
  liveUrl?: string;
  certificateUrl?: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  caseStudy?: {
    problemStatement: string;
    architectureNotes: string;
    implementationDecisions: string[];
    challengesAndSolutions: { challenge: string; solution: string }[];
    whatILearned: string;
    futureImprovements: string[];
  };
}

export interface AcademicItem {
  id: string;
  title: string;
  subjectOrCategory: 'Academic Mini-Projects' | 'Programming Assignments' | 'Practical & Lab Work' | 'Notes & Learning Resources' | 'Certificates & Hackathons';
  description: string;
  semesterOrDate: string;
  technologiesUsed: string[];
  repoUrl?: string;
  docUrl?: string; // only real link if available
  certificateUrl?: string;
  verifiedBadge?: string;
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: { name: string; note: string }[];
}

export interface TimelineEntry {
  id: string;
  period: string;
  role: string;
  organization: string;
  location: string;
  type: 'Education' | 'Design & Creative' | 'Esports & Management' | 'Technical' | 'Influencer Marketing';
  description: string;
  highlights: string[];
}

export const PERSONAL_INFO = {
  name: 'CHAITANYA JAIN',
  headline: 'GRAPHIC DESIGNER × CSE STUDENT',
  supportingHeadline: 'Designing visuals. Building digital experiences.',
  shortDescription: 'I combine visual design, technology, and problem-solving to create compelling digital experiences and practical projects.',
  
  institution: 'Samrat Ashok Technological Institute (SATI)',
  location: 'Vidisha, Madhya Pradesh, India',
  degree: 'Bachelor of Technology (B.Tech)',
  branch: 'Computer Science and Engineering',
  graduationYear: '2027 (Expected)',
  
  primaryFocus: 'Graphic Designer & Visual Communications',
  secondaryFocus: 'CSE Student, Aspiring AI Practitioner & Creative Technologist',
  
  email: 'jainchaitanya102@gmail.com',
  github: 'https://github.com/Chatanya9883',
  linkedin: 'https://www.linkedin.com/in/chaitanyajain98/',
  instagram: 'https://www.instagram.com/jainchaitanya_/',
  avatarUrl: '/assets/aistudio/image_6021aaae.png',
  resumeUrl: 'https://drive.google.com/file/d/11p3ISQBihimp6bUkyUd02jTxf0uIvFOf/view?usp=sharing'
};

export const ABOUT_DETAILS = {
  summary: [
    'I am a Computer Science & Engineering student at Samrat Ashok Technological Institute (SATI), Vidisha, with a primary creative career in graphic design and visual communications.',
    'I am also the founder and owner of a competitive esports organization where I host tournaments, sponsor teams under my organization, broadcast live events on YouTube, and execute large-scale gaming events for external partner companies.',
    'Additionally, I lead influencer marketing initiatives where I negotiate and crack commercial sponsorship deals with brands and deliver them directly to gaming creators and digital influencers.'
  ],
  education: {
    college: 'Samrat Ashok Technological Institute (SATI), Vidisha, M.P.',
    degree: 'B.Tech in Computer Science & Engineering',
    coursework: ['Data Structures & Algorithms', 'Object-Oriented Programming (Java/C++)', 'Database Management Systems', 'Operating Systems', 'Computer Networks', 'Machine Learning Foundations']
  },
  pillars: [
    {
      title: 'Graphic Design & Art Direction',
      focus: 'Visual Identity, Typography, Posters, Digital Creatives',
      description: 'Creating high-impact branding, editorial layouts, thumbnail systems, and marketing collateral with deliberate visual hierarchy.'
    },
    {
      title: 'Computer Science Engineering',
      focus: 'Systems, Algorithms, Programming & Web Development',
      description: 'Academically trained in algorithm design, object-oriented architecture, relational databases, and modern frontend/backend web stacks.'
    },
    {
      title: 'Esports Organization & Tournament Direction',
      focus: 'Organization Ownership, Tournament Hosting, Team Sponsorship & YouTube Live',
      description: 'Founder and owner of a competitive esports organization. Hosting competitive tournaments, sponsoring rosters to represent the org, live broadcasting on YouTube, and managing events for partner organizations and corporate brands.'
    },
    {
      title: 'Influencer Marketing & Brand Deals',
      focus: 'Commercial Brand Deals, Creator Sponsorships & Campaign Direction',
      description: 'Negotiating direct sponsorship and promotional deals with commercial brands and placing them directly with digital creators and gaming influencers to drive high-retention campaigns.'
    }
  ]
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'Design',
    description: 'Visual communication, layout design, branding, and creative software.',
    skills: [
      { name: 'Graphic Design', note: 'Visual composition, color theory, editorial hierarchy' },
      { name: 'Adobe Photoshop', note: 'Photo manipulation, composition, digital mockups' },
      { name: 'Adobe Illustrator', note: 'Vector brand marks, typography, iconography' },
      { name: 'Canva Pro', note: 'Rapid social campaign assets, presentation decks' },
      { name: 'Figma', note: 'UI/UX wireframes, responsive components, design systems' },
      { name: 'Visual Communication', note: 'Brand guidelines, signage, event branding' }
    ]
  },
  {
    category: 'Programming',
    description: 'Core languages studied through CSE curriculum and self-directed building.',
    skills: [
      { name: 'C', note: 'Pointers, memory management, core data structures' },
      { name: 'Python', note: 'Scripting, automation, data handling, API development' },
      { name: 'Java', note: 'Object-oriented programming, classes, collections, JVM fundamentals' },
      { name: 'C++', note: 'Algorithm implementation, competitive programming foundation' }
    ]
  },
  {
    category: 'Web Development',
    description: 'Modern markup, styling, client scripting, and responsive application interfaces.',
    skills: [
      { name: 'HTML5 & Semantic Markup', note: 'Accessible structure, SEO metadata, form controls' },
      { name: 'CSS3 & Tailwind CSS', note: 'Modern utility layout, responsive grids, dark palettes' },
      { name: 'JavaScript (ES6+)', note: 'DOM manipulation, asynchronous fetch, modern syntax' },
      { name: 'React & TypeScript', note: 'Component hierarchy, state management, typed interfaces' }
    ]
  },
  {
    category: 'AI & Data',
    description: 'Practical exploration of machine intelligence and analytical concepts.',
    skills: [
      { name: 'Generative AI Tools', note: 'Prompt engineering, visual generation pipelines, workflow integration' },
      { name: 'AI Fundamentals', note: 'Supervised learning concepts, evaluation metrics, neural architectures' },
      { name: 'Data Handling with Python', note: 'NumPy, Pandas tabular data manipulation, basic visualization' }
    ]
  },
  {
    category: 'Professional & Operations',
    description: 'Execution capabilities developed across events, client projects, and college chapters.',
    skills: [
      { name: 'Esports Event Management', note: 'Tournament coordination, participant scheduling, bracket administration' },
      { name: 'Digital Marketing & Content', note: 'Social distribution, thumbnail retention optimization, audience engagement' },
      { name: 'Team Coordination & Leadership', note: 'Leading college creative wings, delegating project tasks' },
      { name: 'Creative Problem Solving', note: 'Translating client briefs into measurable design outcomes' }
    ]
  }
];

export const DESIGN_CASE_STUDIES: DesignCaseStudy[] = [
  {
    id: 'design-axe-owner-jersey',
    title: 'Axe Owner — Custom Esports Apparel & 3D Jersey Series',
    category: 'Esports & Gaming',
    brief: 'Custom 3D athletic esports jersey with sharp cyan accents, tournament team typography, and modern performance cut.',
    audience: 'Competitive esports players, gaming organizations, and athletic apparel fans.',
    role: 'Lead Visual Designer & Apparel Specialist',
    direction: 'High-contrast cyan and obsidian color blocking with aerodynamic geometric lines.',
    process: [
      'Developed vector graphic templates and crest layout in Adobe Illustrator.',
      'Constructed realistic 3D athletic garment mockups in Photoshop.',
      'Engineered dye-sublimation print patterns optimized for breathable sportswear fabric.'
    ],
    deliverables: [
      'Full Resolution 3D Jersey Apparel Visuals',
      'Team Crest & Sponsor Placement Vector Kit',
      'Production-Ready Sublimation Print Layouts'
    ],
    software: ['Adobe Illustrator', 'Adobe Photoshop', '3D Apparel Mockups'],
    year: '2025',
    clientOrContext: 'Competitive Gaming Team',
    aspectRatio: 'landscape',
    svgVisualType: 'artwork',
    imageUrl: '/assets/aistudio/restored_jersey_axe_owner.png'
  },
  {
    id: 'design-sati-techfest',
    title: 'SATI National Techfest — Official Visual Identity & Posters',
    category: 'Posters & Social Media',
    brief: 'Create an authoritative yet futuristic visual identity and promotional poster series for the collegiate technology and innovation summit at SATI Vidisha.',
    audience: 'Engineering students, professors, technical guests, and collegiate participants across Madhya Pradesh.',
    role: 'Lead Visual Designer & Creative Coordinator',
    direction: 'Monochrome precision with sharp geometric grids, heavy typography, and high-contrast silver/chrome structural accents.',
    process: [
      'Researched technical festival themes across premier Indian institutes (IITs/NITs) to understand modern student visual reception.',
      'Developed modular grid templates in Adobe Illustrator allowing rapid adaptation across print banners and Instagram posts.',
      'Refined typography hierarchy to ensure dates, prize pools, and QR registration links remained legible from a distance.',
      'Engineered digital social assets with high contrast for mobile displays.'
    ],
    deliverables: [
      'Official Event A2 & A3 Print Posters',
      'Instagram Grid & Story Announcement Carousel Series',
      'Stage Backdrop Vector Assets & Digital Screen Banners',
      'Participant ID Badges & Guest Invitation Cards'
    ],
    software: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
    year: '2024 — 2025',
    clientOrContext: 'Samrat Ashok Technological Institute',
    aspectRatio: 'portrait',
    svgVisualType: 'poster'
  },
  {
    id: 'design-esports-arena',
    title: 'Apex Esports League — Championship Broadcast & Team Branding',
    category: 'Esports & Gaming',
    brief: 'Design a high-energy broadcast graphics package, team banner templates, and social matchday creatives for an inter-college esports tournament series.',
    audience: 'Competitive gaming audience, esports athletes, student stream viewers, and brand sponsors.',
    role: 'Creative Designer & Esports Asset Director',
    direction: 'Aggressive angular silhouettes, high-contrast dark metallic surfaces, sharp badge geometries, and clear tournament scoreboard layouts.',
    process: [
      'Mapped the live stream broadcast pipeline to design lower thirds, match schedule screens, and bracket views.',
      'Created bespoke vector emblems for top participating squads adhering to a unified 45-degree angle visual language.',
      'Tested assets on YouTube and Twitch stream overlays for legibility during fast-paced match commentary.',
      'Standardized matchday scorecards in Photoshop with smart object layers for fast updates between games.'
    ],
    deliverables: [
      'Live Stream Overlays, Lower-Thirds & Match Banners',
      'Team Emblem Identity Suite (Vector Badges)',
      'Tournament Bracket Graphics & Match MVP Cards',
      'Sponsor Showcase Deck & Social Teasers'
    ],
    software: ['Photoshop', 'Illustrator', 'Canva'],
    year: '2024',
    clientOrContext: 'Collegiate Esports Circuit',
    aspectRatio: 'landscape',
    svgVisualType: 'artwork'
  },
  {
    id: 'design-aura-brand',
    title: 'Aura Studio — Minimalist Visual Identity & Brand System',
    category: 'Branding & Visual Identity',
    brief: 'Establish a refined brand mark, typography system, and collateral suite for a digital creator collective focused on modern media and tech.',
    audience: 'Technology startups, creators, commercial clients, and digital product teams.',
    role: 'Brand Identity Designer',
    direction: 'Swiss editorial minimalism, subtle silver borders, deep obsidian surfaces, and timeless geometric letterforms.',
    process: [
      'Explored over 30 initial sketch concepts combining the initials with abstract optical apertures.',
      'Engineered a balanced vector logomark on a strict 12-column isometric grid in Illustrator.',
      'Established a typography hierarchy combining a bold grotesque heading face with a clean sans body font.',
      'Produced a practical brand guideline sheet outlining minimum clear space, incorrect usage, and color specifications.'
    ],
    deliverables: [
      'Primary Logomark & Responsive Icon Suite',
      'Typography System & Spacing Guidelines',
      'Stationery Mockups & Presentation Deck Template',
      'Social Profile Kits & Digital Media Assets'
    ],
    software: ['Adobe Illustrator', 'Figma', 'Photoshop'],
    year: '2024',
    clientOrContext: 'Independent Creative Collective',
    aspectRatio: 'square',
    svgVisualType: 'brand'
  },
  {
    id: 'design-thumbnails-youtube',
    title: 'High-Retention Tech & Coding Thumbnail Series',
    category: 'Thumbnails & Digital Creatives',
    brief: 'Develop a cohesive, high-click-through-rate YouTube thumbnail system for computer science tutorials, tech reviews, and project walkthroughs.',
    audience: 'Aspiring programmers, tech enthusiasts, engineering students, and software developers.',
    role: 'Visual Designer & Thumbnail Specialist',
    direction: 'Single clear focal point, expressive facial or code asset framing, high-contrast 3D text styling, and zero visual clutter.',
    process: [
      'Analyzed YouTube CTR metrics across programming niches to identify common readability bottlenecks on mobile feeds.',
      'Implemented the 3-element visual rule: Subject + 3 words maximum + High-contrast context badge.',
      'Hand-crafted custom lighting effects and color separation in Photoshop to make titles pop on mobile screens.',
      'Created reusable thumbnail master templates for rapid production while keeping individual titles visually unique.'
    ],
    deliverables: [
      '12+ High-Resolution YouTube Thumbnails (1920×1080)',
      'Modular Photoshop PSD Template Kits with Smart Objects',
      'Title Hierarchy Guideline for Content Creators'
    ],
    software: ['Adobe Photoshop', 'Illustrator'],
    year: '2024 — 2025',
    clientOrContext: 'Tech Creator Channels',
    aspectRatio: 'landscape',
    svgVisualType: 'thumb'
  },
  {
    id: 'design-social-campaign',
    title: 'SATI Student Chapter — Social Media Campaign & Carousels',
    category: 'Posters & Social Media',
    brief: 'Create an engaging weekly carousel campaign covering tech tips, coding fundamentals, and club announcements for the student technical chapter.',
    audience: 'Collegiate CSE students, juniors preparing for technical interviews, and club members.',
    role: 'Social Media Graphic Designer',
    direction: 'Dark theme with clean white typography, modular informational cards, clear code snippets, and swipe-encouraging visual cues.',
    process: [
      'Structured educational topics into multi-slide narratives (Problem → Code Solution → Takeaway).',
      'Standardized slide dimensions (1080×1350 4:5 ratio) for maximum vertical screen coverage on Instagram.',
      'Incorporated authentic syntax highlighting and clean vector diagrams rather than blurry screenshots.',
      'Maintained consistent chapter branding across all published issues.'
    ],
    deliverables: [
      'Weekly Multi-Slide Informational Carousels',
      'Event Announcement Story Templates',
      'Member Spotlight & Achievement Cards'
    ],
    software: ['Figma', 'Adobe Photoshop', 'Canva'],
    year: '2024',
    clientOrContext: 'Campus Technical Society',
    aspectRatio: 'square',
    svgVisualType: 'social'
  },
  {
    id: 'design-freelance-brand',
    title: 'Nexus Freelance Creative Assets & Client Showcases',
    category: 'Other Creative Work',
    brief: 'Delivered client marketing collateral, digital merchandise banners, business proposals, and creative showreels for diverse regional businesses.',
    audience: 'Regional commercial clients, retail businesses, and digital entrepreneurs.',
    role: 'Freelance Graphic Designer',
    direction: 'Versatile commercial visual styles tailored to specific industry needs while maintaining high aesthetic standards.',
    process: [
      'Conducted discovery calls to translate ambiguous client requests into concrete creative briefs.',
      'Delivered iterative drafts with transparent revision cycles.',
      'Prepared print-ready CMYK PDFs and web-optimized sRGB digital assets for distribution.'
    ],
    deliverables: [
      'Commercial Brochures & Promotional Flyers',
      'Digital Banner Sets for Multi-Platform Ads',
      'Client Presentation Pitch Decks'
    ],
    software: ['Adobe Photoshop', 'Adobe Illustrator', 'Canva'],
    year: '2023 — 2024',
    clientOrContext: 'Freelance Client Engagements',
    aspectRatio: 'portrait',
    svgVisualType: 'poster'
  }
];

export const TECHNICAL_PROJECTS: TechnicalProject[] = [
  {
    id: 'tata-iq-genai-analytics',
    title: 'Tata iQ (Forage) — GenAI Powered Data Analytics Job Simulation',
    category: 'AI & Data Experiments',
    shortDescription: 'Completed an industry job simulation for Tata Insights and Quants (Tata iQ) acting as an AI Transformation Consultant for Geldium Finance to combat rising credit card delinquency using Generative AI and predictive analytics.',
    problemSolved: 'Addressed high credit card delinquency rates at Geldium Finance by auditing raw customer financial telemetry, designing a no-code predictive risk modeling framework, and architecting an ethical, bias-mitigated AI collections strategy.',
    featuresImplemented: [
      'Exploratory Data Analysis (EDA) & Data Hygiene: Audited customer credit records using GenAI to identify missing values, utilization skew, income anomalies, and key delinquency risk drivers',
      'Predictive Delinquency Risk Modeling: Formulated and justified a no-code machine learning framework evaluating Logistic Regression, Decision Trees, and Gradient Boosting with SMOTE class-imbalance handling',
      'Ethical & Explainable AI Governance: Integrated SHAP feature attribution, demographic fairness audits, and regulatory compliance guardrails into automated decisioning',
      'AI-Driven Collections & Business Storytelling: Designed a tiered, human-in-the-loop (HITL) intervention roadmap presented to the Head of Collections to reduce defaults while preserving customer trust'
    ],
    technologies: [
      'Generative AI',
      'Data Analytics',
      'Exploratory Data Analysis (EDA)',
      'Predictive Modeling',
      'Prompt Engineering',
      'Responsible AI & SHAP',
      'Business Storytelling'
    ],
    myContribution: 'Executed all four consulting modules independently: data quality assessment, predictive model selection & justification, ethical AI system design, and executive recommendation storytelling.',
    status: 'Completed',
    caseStudy: {
      problemStatement: 'Geldium Finance faced rising credit card delinquency rates across diverse customer segments. Leadership needed a scalable, data-driven early warning and collections intervention system powered by Generative AI that remained transparent, fair, and compliant with financial regulations.',
      architectureNotes: 'Four-stage AI consulting architecture: (1) GenAI-assisted Exploratory Data Analysis & Data Quality Profiling → (2) No-Code Predictive Risk Scoring Pipeline (Classification with Imbalance Mitigation) → (3) Explainable AI (XAI) & Fairness Auditing Layer → (4) Tiered Automated & Human-in-the-Loop (HITL) Collections Strategy.',
      implementationDecisions: [
        'Leveraged structured Generative AI prompts to profile customer credit utilization, payment history delays, and debt-to-income ratios before modeling.',
        'Proposed an interpretable ensemble framework (Decision Trees / Gradient Boosting paired with Logistic Regression baseline) using Recall, Precision, F1-Score, and ROC-AUC rather than raw accuracy due to class imbalance.',
        'Incorporated SHAP (SHapley Additive exPlanations) values so collections officers can see exact risk factors behind every flagged account.',
        'Designed a multi-tier intervention workflow: automated empathetic nudges for low-risk late payers, flexible restructuring plans for medium-risk accounts, and human agent escalation for vulnerable customers.'
      ],
      challengesAndSolutions: [
        {
          challenge: 'Severe class imbalance between non-delinquent and delinquent customer accounts combined with missing income and credit history fields.',
          solution: 'Applied median/mode imputation with missingness indicator flags and designed the modeling pipeline around SMOTE oversampling and cost-sensitive evaluation metrics (F1 & Recall).'
        },
        {
          challenge: 'Risk of algorithmic bias and opaque black-box decisions in automated financial collections.',
          solution: 'Excluded protected demographic attributes, mandated disparate impact fairness checks across customer cohorts, and enforced human-in-the-loop review before any adverse credit action.'
        }
      ],
      whatILearned: 'Mastered practical application of Generative AI for structured data exploration, translating raw financial indicators into predictive modeling architectures, and embedding Responsible AI principles (fairness, explainability, and governance) into real-world business recommendations.',
      futureImprovements: [
        'Deploy an interactive Python & Streamlit delinquency risk simulator demonstrating real-time SHAP waterfall explanations on synthetic Geldium customer profiles.'
      ]
    }
  }
];

export const ACADEMIC_ITEMS: AcademicItem[] = [
  {
    id: 'acad-tata-iq',
    title: 'Tata Group (Tata iQ) — GenAI Powered Data Analytics Job Simulation',
    subjectOrCategory: 'Certificates & Hackathons',
    description: 'Completed practical industry tasks in Exploratory Data Analysis (EDA), no-code predictive modeling for credit delinquency risk (Geldium Finance case), ethical AI system design, and executive data storytelling on Forage.',
    semesterOrDate: '2025',
    technologiesUsed: ['Generative AI', 'Data Analytics', 'Predictive Modeling', 'Responsible AI', 'Business Storytelling'],
    verifiedBadge: 'Forage Verified Certificate'
  },
  {
    id: 'acad-1',
    title: 'Data Structures & Algorithms Laboratory Submissions',
    subjectOrCategory: 'Practical & Lab Work',
    description: 'Comprehensive collection of laboratory implementations in C and C++ covering singly/doubly linked lists, binary search trees, AVL trees, and sorting algorithms as part of SATI curriculum.',
    semesterOrDate: '3rd & 4th Semester',
    technologiesUsed: ['C', 'C++', 'Data Structures', 'GCC'],
    repoUrl: 'https://github.com/Chatanya9883',
    verifiedBadge: 'SATI Curriculum'
  },
  {
    id: 'acad-2',
    title: 'Object-Oriented Programming with Java — Mini Project',
    subjectOrCategory: 'Academic Mini-Projects',
    description: 'Collegiate mini-project modeling a student attendance and laboratory schedule tracking system using Java OOP principles, inheritance, interfaces, and exception handling.',
    semesterOrDate: '4th Semester',
    technologiesUsed: ['Java', 'OOP', 'File I/O', 'Collections'],
    repoUrl: 'https://github.com/Chatanya9883',
    verifiedBadge: 'Coursework Verified'
  },
  {
    id: 'acad-3',
    title: 'Relational Database Schema Design & SQL Queries',
    subjectOrCategory: 'Programming Assignments',
    description: 'Academic database project designing 3NF normalized schemas for a campus library and event registration system, including complex joins, triggers, and stored procedures.',
    semesterOrDate: '4th Semester',
    technologiesUsed: ['SQL', 'MySQL', 'ER Modeling', 'Relational Algebra'],
    verifiedBadge: 'DBMS Lab'
  },
  {
    id: 'acad-4',
    title: 'Python for Data Analysis & Scientific Computing',
    subjectOrCategory: 'Notes & Learning Resources',
    description: 'Personal study notes, Jupyter notebooks, and annotated code snippets exploring NumPy array indexing, Pandas series operations, and Matplotlib data visualization.',
    semesterOrDate: 'Self-Study & 5th Semester',
    technologiesUsed: ['Python', 'Jupyter', 'Pandas', 'NumPy'],
    repoUrl: 'https://github.com/Chatanya9883'
  },
  {
    id: 'acad-6',
    title: 'Technical Chapter Creative Wing Head & Organizer',
    subjectOrCategory: 'Certificates & Hackathons',
    description: 'Coordinated student design workshops, created publicity branding, and managed technical event logistics across collegiate departments.',
    semesterOrDate: '2023 — Present',
    technologiesUsed: ['Event Management', 'Graphic Design', 'Publicity'],
    verifiedBadge: 'Leadership Record'
  }
];

export const TIMELINE_DATA: TimelineEntry[] = [
  {
    id: 'time-tata-iq',
    period: '2025',
    role: 'GenAI Powered Data Analytics Virtual Intern (Job Simulation)',
    organization: 'Tata Insights and Quants (Tata iQ) · Forage',
    location: 'Remote',
    type: 'Technical',
    description: 'Completed the Tata iQ AI transformation consulting job simulation focused on solving credit card delinquency challenges for Geldium Finance through Generative AI and responsible analytics.',
    highlights: [
      'Conducted GenAI-assisted Exploratory Data Analysis (EDA) to uncover data quality gaps and delinquency risk indicators',
      'Designed and justified a no-code predictive modeling framework optimizing for imbalanced credit default detection',
      'Architected an ethical, explainable AI-driven collections strategy with human-in-the-loop guardrails and executive recommendations'
    ]
  },
  {
    id: 'time-1',
    period: '2023 — Present',
    role: 'B.Tech Student (Computer Science & Engineering)',
    organization: 'Samrat Ashok Technological Institute (SATI)',
    location: 'Vidisha, Madhya Pradesh',
    type: 'Education',
    description: 'Pursuing undergraduate degree in Computer Science & Engineering. Focusing on core theoretical computer science, programming languages, and practical software engineering.',
    highlights: [
      'Coursework across C, Java, Python, Data Structures, and Database Systems',
      'Actively bridging technical problem solving with visual communication design',
      'Participating in campus developer meetups and technical societies'
    ]
  },
  {
    id: 'time-2',
    period: '2023 — Present',
    role: 'Freelance Graphic Designer & Visual Specialist',
    organization: 'Independent Client Practice',
    location: 'Remote',
    type: 'Design & Creative',
    description: 'Delivering commercial branding marks, social media promotional collateral, posters, and YouTube thumbnails for creators, regional businesses, and collegiate initiatives.',
    highlights: [
      'Created 50+ distinctive design assets using Adobe Illustrator, Photoshop, and Figma',
      'Specialized in high-retention digital visuals and editorial print posters',
      'Maintained consistent client communication, revision cycles, and on-time delivery'
    ]
  },
  {
    id: 'time-3',
    period: '2023 — Present',
    role: 'Esports Organization Founder & Tournament Director',
    organization: 'Competitive Esports Organization',
    location: 'Hybrid / Remote',
    type: 'Esports & Management',
    description: 'Founder and owner of a competitive esports organization. Hosting high-stakes tournaments, sponsoring rosters to compete under the organization banner, directing live YouTube broadcasts, and executing events for partner companies and corporate organizations.',
    highlights: [
      'Founder & owner of competitive esports organization hosting multi-tier gaming tournaments',
      'Sponsoring and funding competitive esports rosters to represent the organization across tournament circuits',
      'Directing live tournament broadcasting, stream production, and viewer engagement on YouTube',
      'Managing and executing esports events end-to-end for external partner organizations and corporate brands'
    ]
  },
  {
    id: 'time-influencer-marketing',
    period: '2023 — Present',
    role: 'Influencer Marketing Lead & Brand Deal Strategist',
    organization: 'Creator & Brand Commercial Network',
    location: 'Remote',
    type: 'Influencer Marketing',
    description: 'Spearheading influencer marketing pipelines and brand monetization. Cracking and negotiating commercial sponsorship deals directly with brands, and connecting those deals directly to top gaming creators and digital influencers for execution.',
    highlights: [
      'Negotiating and cracking high-value sponsorship and promotional deals directly with brands',
      'Connecting commercial brand budgets directly to gaming creators and digital influencers',
      'Managing creator deliverables, campaign messaging, contract timelines, and performance metrics',
      'Delivering verified conversion and audience engagement across YouTube, Instagram, and live stream channels'
    ]
  },
  {
    id: 'time-4',
    period: '2024 — Present',
    role: 'Creative Wing Lead & Technical Chapter Contributor',
    organization: 'Student Technical Chapters & Event Committees',
    location: 'SATI Vidisha',
    type: 'Design & Creative',
    description: 'Spearheading visual communications and social publicity for technical seminars, coding challenges, and collegiate festivals.',
    highlights: [
      'Directed official poster campaigns for campus technical events',
      'Standardized social media carousel designs for higher student engagement',
      'Collaborated closely with faculty coordinators and student council members'
    ]
  }
];
