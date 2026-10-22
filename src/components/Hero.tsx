import { usePortfolio } from '../context/PortfolioContext';
import { ArrowDown, ArrowUpRight, Github, Linkedin, Instagram, Mail } from 'lucide-react';
import AsciiPortraitCard from './AsciiPortraitCard';
import { motion } from 'motion/react';

export default function Hero() {
  const { state } = usePortfolio();
  const { personalInfo } = state;

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Column: Focused Headline & Minimal Supporting Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Subtle Institutional Role Pill */}
          <div>
            <span className="inline-block px-3 py-1 bg-[#101010] border border-white/10 text-xs font-mono font-medium tracking-widest text-[#C0C0C0] uppercase">
              {personalInfo.headline}
            </span>
          </div>

          {/* Main Heading: Chaitanya Jain */}
          <div className="space-y-3">
            <h1 
              style={{ fontFamily: 'Arial, sans-serif', fontStyle: 'normal' }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F5F5F5] leading-[1.02]"
            >
              {personalInfo.name}
            </h1>

            {/* Supporting Headline */}
            <p className="text-xl sm:text-2xl font-display font-medium text-[#C0C0C0] leading-snug">
              {personalInfo.supportingHeadline}
            </p>
          </div>

          {/* Short Description */}
          <p className="text-base sm:text-lg text-[#929292] font-normal leading-relaxed max-w-xl text-balance">
            {personalInfo.shortDescription}
          </p>

          {/* Institutional / Academic Context Credibility */}
          <div className="text-xs font-mono text-[#929292] flex flex-wrap items-center gap-2 pt-1">
            <span>{personalInfo.institution} ({personalInfo.degree} {personalInfo.branch})</span>
            <span className="text-zinc-600" aria-hidden="true">·</span>
            <span>{personalInfo.location}</span>
          </div>

          {/* Two Prominent CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <a
              href="#creative-work"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-mono font-semibold text-black bg-[#F5F5F5] hover:bg-[#C0C0C0] transition-all shadow-lg cursor-pointer border border-transparent"
            >
              <span>EXPLORE MY WORK</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <a
              href="#development"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-mono font-medium text-[#F5F5F5] hover:text-white bg-[#101010] hover:bg-[#191919] border border-white/15 hover:border-white/30 transition-all cursor-pointer"
            >
              <span>VIEW TECH PROJECTS</span>
              <ArrowUpRight className="w-4 h-4 text-[#929292]" />
            </a>
          </div>

          {/* Discreet Contact Action & Social Links */}
          <div className="pt-5 flex items-center gap-6 text-xs text-[#929292] border-t border-white/[0.08]">
            <a
              href="#contact"
              className="font-mono text-[#C0C0C0] hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-white"
            >
              Let's Connect
            </a>

            <span className="text-zinc-700" aria-hidden="true">·</span>

            <div className="flex items-center gap-4">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="text-[#929292] hover:text-white transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-[#929292] hover:text-white transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href={personalInfo.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-[#929292] hover:text-white transition-colors"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${personalInfo.email}`}
                className="text-[#929292] hover:text-white transition-colors"
                aria-label="Direct Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Portrait Photo with background removed */}
        <div className="lg:col-span-5 flex justify-center">
          <AsciiPortraitCard />
        </div>
      </div>
    </section>
  );
}
