import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Mail, Github, Linkedin, Instagram, Copy, Check, Send, ArrowUpRight } from 'lucide-react';
import SectionReveal3D from './SectionReveal3D';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: 'Graphic Design',
    budget: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setErrorMsg('Please complete all required fields (Name, Email, and Message).');
      return;
    }

    setSending(true);

    // Direct mailto fallback construction for transparent communication
    const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry - ${formState.projectType}] from ${formState.name}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\nProject Type: ${formState.projectType}\nBudget Range: ${formState.budget || 'Not specified'}\n\nMessage:\n${formState.message}`
    );
    const mailtoLink = `mailto:${PERSONAL_INFO.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      window.location.href = mailtoLink;
    }, 600);
  };

  return (
    <section id="contact" className="py-28 relative border-t border-white/[0.08] bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-16">
        
        {/* Section Header */}
        <SectionReveal3D className="space-y-3 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0] flex items-center gap-2">
            <span className="w-2 h-0.5 bg-white" />
            <span>LET'S CONNECT</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-[#F5F5F5]">
            START A PROJECT
          </h2>
          <p className="text-sm md:text-base text-[#929292] font-normal leading-relaxed">
            Available for graphic design client commissions, branding systems, esports tournament packages, and technical internship inquiries.
          </p>
        </SectionReveal3D>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Channels */}
          <SectionReveal3D delay={0.1} className="lg:col-span-5 space-y-6">
            
            {/* Primary Email Card */}
            <div className="p-6 md:p-7 bg-[#0a0a0a] border border-white/10 space-y-4 shadow-xl">
              <span className="text-[11px] font-mono text-[#929292] uppercase block">
                Direct Email Inbox
              </span>
              <div className="text-base sm:text-lg font-mono font-medium text-white break-all">
                {PERSONAL_INFO.email}
              </div>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="px-4 py-2 bg-[#F5F5F5] hover:bg-[#C0C0C0] text-black text-xs font-mono font-semibold transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open Email Client</span>
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="px-3.5 py-2 bg-[#141414] hover:bg-[#1a1a1a] text-[#F5F5F5] text-xs font-mono border border-white/10 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Address'}</span>
                </button>
              </div>
            </div>

            {/* Social Links Grid */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#929292]">
                Verified Profiles
              </span>
              <div className="grid grid-cols-3 gap-3">
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-[#0a0a0a] border border-white/10 hover:border-white/30 transition-all text-center space-y-1.5"
                >
                  <Github className="w-4 h-4 text-white mx-auto" />
                  <span className="text-xs font-mono text-white block">GitHub</span>
                </a>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-[#0a0a0a] border border-white/10 hover:border-white/30 transition-all text-center space-y-1.5"
                >
                  <Linkedin className="w-4 h-4 text-white mx-auto" />
                  <span className="text-xs font-mono text-white block">LinkedIn</span>
                </a>
                <a
                  href={PERSONAL_INFO.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-[#0a0a0a] border border-white/10 hover:border-white/30 transition-all text-center space-y-1.5"
                >
                  <Instagram className="w-4 h-4 text-white mx-auto" />
                  <span className="text-xs font-mono text-white block">Instagram</span>
                </a>
              </div>
            </div>

            {/* Academic Information Notice */}
            <div className="p-4 bg-[#0a0a0a] border border-white/[0.08] text-xs font-mono text-[#929292] space-y-1.5">
              <span className="text-white font-medium block">Academic Inquiries</span>
              <p>For college mini-project documentation, code walkthroughs, or SATI peer collaborations, connect via email or GitHub.</p>
            </div>
          </SectionReveal3D>

          {/* Right Column: Professional Inquiries Form */}
          <SectionReveal3D delay={0.2} className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-[#0a0a0a] border border-white/10 shadow-2xl space-y-6">
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  Send a Direct Project Brief
                </h3>
                <p className="text-xs text-[#929292] mt-1">
                  Submitting will launch your verified email client with this structured brief pre-filled.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-300">
                  {errorMsg}
                </div>
              )}

              {submitted ? (
                <div className="p-8 bg-[#101010] border border-white/15 text-center space-y-3">
                  <div className="w-9 h-9 bg-white text-black flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">Email Client Prepared</h4>
                  <p className="text-xs text-[#929292]">
                    Your default mail program has been triggered with the inquiry to {PERSONAL_INFO.email}.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-mono text-white underline pt-2 cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#929292] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Alex Sharma"
                        className="w-full px-3.5 py-2.5 bg-[#050505] border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#929292] mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="alex@example.com"
                        className="w-full px-3.5 py-2.5 bg-[#050505] border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#929292] mb-1.5">
                        Project Type
                      </label>
                      <select
                        value={formState.projectType}
                        onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#050505] border border-white/10 text-xs text-white focus:outline-none focus:border-white transition-colors"
                      >
                        <option value="Graphic Design">Graphic Design & Posters</option>
                        <option value="Brand Identity">Brand Identity & Logo</option>
                        <option value="Esports Creatives">Esports Tournament Graphics</option>
                        <option value="Technical Project">CSE / Web Development</option>
                        <option value="Other Inquiries">General Collaboration</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#929292] mb-1.5">
                        Budget Range (Optional)
                      </label>
                      <input
                        type="text"
                        value={formState.budget}
                        onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                        placeholder="e.g. ₹5,000 - ₹20,000 or Flexible"
                        className="w-full px-3.5 py-2.5 bg-[#050505] border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#929292] mb-1.5">
                      Project Message & Scope *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Outline your objectives, timeline, deliverables, or questions..."
                      className="w-full px-3.5 py-2.5 bg-[#050505] border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3.5 bg-[#F5F5F5] hover:bg-[#C0C0C0] text-black text-xs font-mono font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{sending ? 'Preparing Email...' : 'Send Message'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </SectionReveal3D>

        </div>

      </div>
    </section>
  );
}
