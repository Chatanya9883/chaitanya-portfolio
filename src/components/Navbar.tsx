import { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { Menu, X, ArrowUpRight, Download, Box, Sliders } from 'lucide-react';

interface NavbarProps {
  onOpenResume: () => void;
}

export default function Navbar({ onOpenResume }: NavbarProps) {
  const { isEditMode, setIsEditMode, isAdminUnlocked, lockAdmin } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // Section detection
      const sections = ['hero', 'creative-work', 'creative-space', 'development', 'academic', 'about', 'skills', 'contact'];
      let current = 'hero';
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 260 && rect.bottom >= 260) {
            current = sectionId;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#creative-work', id: 'creative-work' },
    { label: '3D Studio', href: '#creative-space', id: 'creative-space' },
    { label: 'Tech', href: '#development', id: 'development' },
    { label: 'Academic', href: '#academic', id: 'academic' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Identity Wordmark: CJ & Chaitanya Jain */}
          <a
            href="#hero"
            className="group flex items-center gap-3 cursor-pointer"
            aria-label="Chaitanya Jain Home"
          >
            <div className="w-8 h-8 bg-[#101010] border border-white/20 group-hover:border-white/50 flex items-center justify-center font-mono font-bold text-xs text-[#F5F5F5] group-hover:text-white transition-all shadow-sm">
              CJ
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-tight text-[#F5F5F5] group-hover:text-white transition-colors">
                {PERSONAL_INFO.name}
              </span>
              <span className="text-[10px] font-mono text-[#929292] tracking-wider uppercase">
                STUDIO · PORTFOLIO
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-1 bg-[#0c0c0c]/80 border border-white/10 px-3 py-1.5 backdrop-blur-md"
            aria-label="Primary Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 text-xs font-mono transition-colors cursor-pointer ${
                    isActive ? 'text-[#F5F5F5] font-semibold' : 'text-[#929292] hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C0C0C0]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Right Actions: Download CV & Edit Website */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-medium transition-all cursor-pointer shadow-sm border ${
                isEditMode
                  ? 'text-emerald-300 bg-emerald-950/40 border-emerald-500/40 hover:bg-emerald-900/40'
                  : 'text-white bg-white/10 hover:bg-white/20 border-white/25'
              }`}
              title={isEditMode ? "Exit Edit Mode" : "Open Website Visual Editor"}
            >
              <Sliders className="w-3.5 h-3.5 text-[#C0C0C0]" />
              <span>{isEditMode ? 'EXIT EDIT MODE' : 'EDIT WEBSITE'}</span>
            </button>

            <button
              onClick={onOpenResume}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium text-[#F5F5F5] bg-[#101010] hover:bg-[#181818] border border-white/15 hover:border-white/30 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#C0C0C0]" />
              <span>Download CV</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#929292] hover:text-white border border-white/10 bg-[#101010] cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Navigation' : 'Open Navigation'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/95 backdrop-blur-lg flex flex-col justify-between pt-24 pb-8 px-6 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="space-y-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 pb-2 border-b border-white/10">
              Navigation Menu
            </p>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-2xl font-display font-semibold text-[#F5F5F5] hover:text-[#C0C0C0] py-2 border-b border-white/[0.04]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            {isAdminUnlocked && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsEditMode(true);
                }}
                className="w-full py-3 text-center text-xs font-mono font-semibold text-white bg-white/10 border border-white/25 transition-colors flex items-center justify-center gap-2"
              >
                <Sliders className="w-4 h-4 text-[#C0C0C0]" />
                <span>EDIT WEBSITE MODE</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="w-full py-3 text-center text-xs font-mono font-semibold text-black bg-[#F5F5F5] transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>View & Download Resume</span>
            </button>

            <div className="flex items-center justify-between text-xs font-mono text-[#929292] pt-2">
              <span>{PERSONAL_INFO.name}</span>
              <span>SATI Vidisha</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
