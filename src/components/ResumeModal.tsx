import { PERSONAL_INFO, TECHNICAL_PROJECTS, TIMELINE_DATA, SKILL_CATEGORIES } from '../data/portfolioData';
import { X, Printer, Download, Mail, Github, Linkedin, ExternalLink } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestDownload?: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#0c0c0c] border border-white/20 max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar */}
        <div className="sticky top-0 bg-[#101010]/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white font-semibold uppercase tracking-wider">Curriculum Vitae</span>
            <span className="text-zinc-600" aria-hidden="true">·</span>
            <span className="text-xs font-mono text-[#929292]">{PERSONAL_INFO.name}</span>
          </div>

          <div className="flex items-center gap-3">
            {PERSONAL_INFO.resumeUrl && (
              <a
                href={PERSONAL_INFO.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium text-black bg-[#F5F5F5] hover:bg-[#C0C0C0] transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono text-[#F5F5F5] hover:text-white bg-[#191919] hover:bg-[#202020] transition-colors cursor-pointer border border-white/10"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#929292] hover:text-white hover:bg-[#191919] transition-colors cursor-pointer border border-white/10"
              aria-label="Close resume preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resume Content Sheet */}
        <div className="p-8 sm:p-12 space-y-10 text-[#F5F5F5] bg-[#0c0c0c]">
          
          {/* Header */}
          <div className="border-b border-white/10 pb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                {PERSONAL_INFO.name}
              </h2>
              <p className="text-sm font-mono text-[#C0C0C0]">
                Graphic Designer & Computer Science Student (B.Tech CSE)
              </p>
              <p className="text-xs text-[#929292]">
                {PERSONAL_INFO.institution} · {PERSONAL_INFO.location}
              </p>
            </div>

            <div className="text-xs font-mono space-y-1 text-[#929292] sm:text-right">
              <div>
                <a href={`mailto:${PERSONAL_INFO.email}`} className="text-white hover:underline">
                  {PERSONAL_INFO.email}
                </a>
              </div>
              <div>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">
                  linkedin.com/in/chaitanyajain98
                </a>
              </div>
              <div>
                <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="hover:text-white">
                  github.com/Chatanya9883
                </a>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0] border-b border-white/[0.08] pb-1">
              Education
            </h3>
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm font-semibold text-white">
                <span>{PERSONAL_INFO.institution}</span>
                <span className="text-xs font-mono text-[#929292] font-normal">2023 – 2027 (Expected)</span>
              </div>
              <p className="text-xs font-mono text-[#C0C0C0]">
                Bachelor of Technology (B.Tech) in Computer Science and Engineering
              </p>
              <p className="text-xs text-[#929292]">
                Coursework: Data Structures & Algorithms, Object-Oriented Programming (Java/C++), DBMS, Operating Systems, Computer Networks.
              </p>
            </div>
          </div>

          {/* Core Technical & Design Competencies */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0] border-b border-white/[0.08] pb-1">
              Skills & Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <span className="font-mono font-semibold text-white block">{cat.category}</span>
                  <p className="text-[#929292]">
                    {cat.skills.map((s) => s.name).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Work & Leadership Experience */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0] border-b border-white/[0.08] pb-1">
              Practical Experience & Leadership
            </h3>
            <div className="space-y-6">
              {TIMELINE_DATA.map((entry) => (
                <div key={entry.id} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
                    <span className="font-semibold text-white">
                      {entry.role} · <span className="font-normal text-[#C0C0C0]">{entry.organization}</span>
                    </span>
                    <span className="text-xs font-mono text-[#929292]">{entry.period}</span>
                  </div>
                  <p className="text-xs text-[#929292]">{entry.description}</p>
                  <ul className="list-disc list-inside text-xs text-[#F5F5F5] space-y-0.5 pt-0.5">
                    {entry.highlights.map((hl, i) => (
                      <li key={i}>{hl}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Technical & Engineering Projects */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0] border-b border-white/[0.08] pb-1">
              Selected Technical Projects
            </h3>
            <div className="space-y-4">
              {TECHNICAL_PROJECTS.slice(0, 3).map((p) => (
                <div key={p.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm font-semibold text-white">
                    <span>{p.title}</span>
                    <span className="text-xs font-mono text-[#929292] font-normal">{p.category}</span>
                  </div>
                  <p className="text-xs text-[#929292]">{p.shortDescription}</p>
                  <p className="text-[11px] font-mono text-[#C0C0C0]">
                    Tech Stack: {p.technologies.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Notice */}
          <div className="pt-6 border-t border-white/10 text-center text-xs font-mono text-[#929292]">
            Verified Portfolio & Resume of {PERSONAL_INFO.name} · Samrat Ashok Technological Institute (SATI Vidisha)
          </div>

        </div>
      </div>
    </div>
  );
}
