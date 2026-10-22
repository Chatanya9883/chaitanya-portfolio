import { PERSONAL_INFO } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUp, Github, Linkedin, Instagram, Mail, Lock, Unlock } from 'lucide-react';

export default function Footer() {
  const { isEditMode, setIsEditMode } = usePortfolio();

  const handleOwnerAccess = () => {
    setIsEditMode(!isEditMode);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#050505] py-12 text-[#929292] text-xs">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand Wordmark & Academic Context */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <a
            href="#hero"
            className="text-sm font-bold font-display text-white hover:text-[#C0C0C0] transition-colors"
          >
            {PERSONAL_INFO.name}
          </a>
          <span className="hidden sm:inline text-zinc-700" aria-hidden="true">·</span>
          <span>Graphic Designer × B.Tech CSE (SATI Vidisha)</span>
          <span className="hidden sm:inline text-zinc-700" aria-hidden="true">·</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        {/* Right: Quick actions, Owner login & Back-to-top */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-[#929292] hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-[#929292] hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.instagram}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-[#929292] hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="p-1.5 text-[#929292] hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <span className="text-zinc-800" aria-hidden="true">|</span>

          {/* Owner Visual Editor Toggle */}
          <button
            onClick={handleOwnerAccess}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#101010] hover:bg-[#191919] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer font-mono text-[11px]"
            title={isEditMode ? "Exit Website Editor" : "Open Website Visual Editor"}
          >
            <Unlock className="w-3 h-3 text-emerald-400" />
            <span className={isEditMode ? "text-emerald-400 font-bold" : "text-zinc-300"}>
              {isEditMode ? "Editor Open" : "Edit Website"}
            </span>
          </button>

          <span className="text-zinc-800" aria-hidden="true">|</span>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#101010] hover:bg-[#191919] text-[#F5F5F5] hover:text-white border border-white/10 transition-colors cursor-pointer text-xs font-mono"
            aria-label="Scroll back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
