import React, { useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { TechnicalProject } from '../data/portfolioData';
import { ExternalLink, Code2, ArrowUpRight, X, Upload, Award, Eye, CheckCircle2 } from 'lucide-react';
import SectionReveal3D from './SectionReveal3D';
import Tilt3D from './Tilt3D';

export default function DevelopmentProjects() {
  const { state, updateTechnicalProject } = usePortfolio();
  const technicalProjects = state.technicalProjects;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<TechnicalProject | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<{ title: string; url: string; projectId: string } | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const modalCertInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    'All',
    'AI & Data Experiments',
    'Python Applications',
    'Web Development',
    'C & Java Programming'
  ];

  const filteredProjects = activeCategory === 'All'
    ? technicalProjects
    : technicalProjects.filter((p) => p.category === activeCategory);

  const isSingleFeatured = filteredProjects.length === 1;

  const handleCertificateUpload = (projectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateTechnicalProject(projectId, { certificateUrl: result });
        if (selectedCaseStudy && selectedCaseStudy.id === projectId) {
          setSelectedCaseStudy({ ...selectedCaseStudy, certificateUrl: result });
        }
        if (viewingCertificate && viewingCertificate.projectId === projectId) {
          setViewingCertificate({ ...viewingCertificate, url: result });
        }
        setUploadNotice('Internship certificate uploaded & saved permanently!');
        setTimeout(() => setUploadNotice(null), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="development" className="py-28 relative border-t border-white/[0.08] bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <SectionReveal3D className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0] flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[#F5F5F5]" />
              <span>TECHNICAL PORTFOLIO · VERIFIED INDUSTRY SIMULATION</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-[#F5F5F5]">
              TECHNICAL PROJECTS & INTERNSHIP
            </h2>
            <p className="text-sm md:text-base text-[#929292] max-w-2xl font-normal leading-relaxed">
              Verified industry simulation experience with Tata Insights and Quants (Tata iQ) on Forage, complete with official credential verification.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            {uploadNotice && (
              <div className="px-3.5 py-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{uploadNotice}</span>
              </div>
            )}

            {/* Clean Segmented Filter Tabs */}
            {technicalProjects.length > 1 && (
              <div className="flex items-center p-1 bg-[#0c0c0c] border border-white/10 self-start md:self-auto overflow-x-auto max-w-full shadow-2xl">
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
            )}
          </div>
        </SectionReveal3D>

        {/* Technical Projects Grid with Adaptive Editorial Architecture */}
        <div className={`grid grid-cols-1 ${isSingleFeatured ? 'lg:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {filteredProjects.map((project, idx) => (
            <SectionReveal3D key={project.id} delay={idx * 0.06}>
              <Tilt3D maxAngle={isSingleFeatured ? 2 : 4}>
                <div className="h-full bg-[#0a0a0a] border border-white/15 hover:border-white/35 p-6 sm:p-8 md:p-10 transition-all duration-300 shadow-2xl flex flex-col justify-between space-y-6 relative group">
                  
                  {/* Fine metallic accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Hidden file input for certificate upload */}
                  <input
                    ref={(el) => {
                      fileInputRefs.current[project.id] = el;
                    }}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleCertificateUpload(project.id, e)}
                  />

                  <div className="space-y-6">
                    {/* Header: Category & Real Status Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-2 text-[#C0C0C0]">
                        <span>{project.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#F5F5F5]">Tata Insights and Quants (Tata iQ) · Forage</span>
                      </div>
                      <span className="text-xs font-mono text-[#C0C0C0]">
                        Status: <strong className="text-white font-semibold">{project.status}</strong>
                      </span>
                    </div>

                    <h3 className={`${isSingleFeatured ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-xl'} font-bold font-display text-white group-hover:text-white transition-colors tracking-tight`}>
                      {project.title}
                    </h3>

                    {/* Problem Solved & Deliverables Grid */}
                    <div className={`grid grid-cols-1 ${isSingleFeatured ? 'lg:grid-cols-12 gap-8 pt-2' : 'gap-4'}`}>
                      <div className={`${isSingleFeatured ? 'lg:col-span-5 space-y-4' : 'space-y-3'}`}>
                        <p className="text-sm sm:text-base text-[#F5F5F5] leading-relaxed">
                          {project.shortDescription}
                        </p>
                        {project.problemSolved && (
                          <p className="text-xs sm:text-sm text-[#929292] leading-relaxed">
                            {project.problemSolved}
                          </p>
                        )}
                        {project.myContribution && isSingleFeatured && (
                          <div className="pt-2 border-t border-white/[0.08]">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-[#C0C0C0] block mb-1">
                              Role & Scope
                            </span>
                            <p className="text-xs text-[#929292] leading-relaxed">
                              {project.myContribution}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Features / Consulting Modules Implemented */}
                      <div className={`${isSingleFeatured ? 'lg:col-span-7 lg:pl-8 lg:border-l border-white/[0.08]' : 'pt-3 border-t border-white/[0.06]'} space-y-3`}>
                        <span className="text-xs font-mono uppercase tracking-wider text-[#C0C0C0] block">
                          Key Consulting Deliverables & Modules Completed:
                        </span>
                        <ul className="space-y-2.5">
                          {(isSingleFeatured ? project.featuresImplemented : project.featuresImplemented.slice(0, 3)).map((feat, fIdx) => (
                            <li key={fIdx} className="text-xs sm:text-sm text-[#F5F5F5] flex items-start gap-2.5 leading-relaxed">
                              <span className="w-1.5 h-1.5 bg-[#C0C0C0] mt-2 shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Dedicated Internship Certificate Verification Section */}
                    <div className="pt-5 border-t border-white/[0.08]">
                      <div className="p-5 bg-[#0f0f0f] border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-start sm:items-center gap-4">
                          {project.certificateUrl ? (
                            <div
                              onClick={() => setViewingCertificate({ title: project.title, url: project.certificateUrl!, projectId: project.id })}
                              className="w-28 h-20 sm:w-36 sm:h-24 bg-black border border-white/25 overflow-hidden shrink-0 cursor-pointer relative group/cert shadow-lg"
                              title="Click to view full-size certificate"
                            >
                              <img
                                src={project.certificateUrl}
                                alt="Tata iQ Internship Certificate"
                                className="w-full h-full object-cover group-hover/cert:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/cert:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => fileInputRefs.current[project.id]?.click()}
                              className="w-20 h-20 sm:w-24 sm:h-20 bg-[#141414] border border-dashed border-white/25 hover:border-white/60 flex flex-col items-center justify-center gap-1 shrink-0 cursor-pointer transition-colors text-[#C0C0C0] hover:text-white"
                              title="Upload your completed Tata iQ Certificate"
                            >
                              <Award className="w-5 h-5" />
                              <span className="text-[10px] font-mono uppercase">Upload</span>
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-mono text-[#C0C0C0]">
                              <Award className="w-3.5 h-3.5 text-white shrink-0" />
                              <span>OFFICIAL CREDENTIAL · TATA iQ FORAGE CERTIFICATE</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold font-display text-white">
                              {project.certificateUrl
                                ? 'Verified Certificate of Completion Attached'
                                : 'Upload Your Completed Tata iQ Internship Certificate'}
                            </h4>
                            <p className="text-xs text-[#929292] max-w-xl leading-relaxed">
                              {project.certificateUrl
                                ? 'Click the certificate preview or "View Certificate" to inspect the full-resolution Forage credential. Saved automatically in your browser.'
                                : 'Attach your official Tata iQ Forage completion certificate (PNG, JPG, or WebP) to display verifiable proof of completion directly on your portfolio.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
                          {project.certificateUrl && (
                            <button
                              onClick={() => setViewingCertificate({ title: project.title, url: project.certificateUrl!, projectId: project.id })}
                              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-black hover:bg-[#C0C0C0] text-xs font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Certificate</span>
                            </button>
                          )}
                          <button
                            onClick={() => fileInputRefs.current[project.id]?.click()}
                            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                              project.certificateUrl
                                ? 'bg-[#181818] text-[#F5F5F5] hover:bg-[#222222] border border-white/20'
                                : 'bg-white text-black hover:bg-[#C0C0C0]'
                            }`}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{project.certificateUrl ? 'Replace Certificate' : 'Upload Certificate'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack & Action Bar (Certificate Verification in place of GitHub) */}
                  <div className="space-y-4 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-[#C0C0C0]">
                      {project.technologies.map((t, idx) => (
                        <span key={t} className="inline-flex items-center gap-3">
                          <span>{t}</span>
                          {idx < project.technologies.length - 1 && (
                            <span className="text-zinc-700" aria-hidden="true">·</span>
                          )}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {project.certificateUrl ? (
                        <button
                          onClick={() => setViewingCertificate({ title: project.title, url: project.certificateUrl!, projectId: project.id })}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#141414] hover:bg-[#1f1f1f] border border-white/20 text-xs font-mono text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Award className="w-3.5 h-3.5 text-[#C0C0C0]" />
                          <span>Verified Certificate</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => fileInputRefs.current[project.id]?.click()}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#141414] hover:bg-[#1f1f1f] border border-white/20 text-xs font-mono text-[#C0C0C0] hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Certificate</span>
                        </button>
                      )}

                      {project.liveUrl && project.liveUrl !== '#' && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-white hover:text-[#C0C0C0] transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>Verification</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {project.caseStudy && (
                        <button
                          onClick={() => setSelectedCaseStudy(project)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F5F5F5] text-black hover:bg-[#C0C0C0] text-xs font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <span>View Full Case Study</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Tilt3D>
            </SectionReveal3D>
          ))}
        </div>
      </div>

      {/* Fullscreen Certificate Lightbox Modal */}
      {viewingCertificate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-md overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0"
            onClick={() => setViewingCertificate(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-4xl bg-[#0c0c0c] border border-white/25 shadow-2xl my-auto z-10 overflow-hidden text-[#F5F5F5]">
            <div className="p-5 md:p-6 border-b border-white/15 flex items-center justify-between bg-[#101010]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C0C0C0]">
                  <Award className="w-4 h-4 text-white" />
                  <span>Verified Internship Credential</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold font-display text-white">
                  {viewingCertificate.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingCertificate(null)}
                className="p-2 text-[#929292] hover:text-white border border-white/10 hover:border-white/30 transition-all cursor-pointer bg-[#0a0a0a]"
                aria-label="Close Certificate Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-8 bg-[#050505] flex items-center justify-center max-h-[75vh] overflow-y-auto">
              <img
                src={viewingCertificate.url}
                alt={viewingCertificate.title}
                className="max-w-full max-h-[68vh] object-contain border border-white/15 shadow-2xl"
              />
            </div>

            <div className="p-4 md:p-5 border-t border-white/15 bg-[#101010] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => fileInputRefs.current[viewingCertificate.projectId]?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#191919] hover:bg-[#252525] border border-white/20 text-xs font-mono text-white transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Replace Certificate Image</span>
              </button>
              <button
                onClick={() => setViewingCertificate(null)}
                className="px-5 py-2 bg-[#F5F5F5] hover:bg-[#C0C0C0] text-black text-xs font-mono font-semibold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Case Study Modal */}
      {selectedCaseStudy && selectedCaseStudy.caseStudy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0"
            onClick={() => setSelectedCaseStudy(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-3xl bg-[#0c0c0c] border border-white/20 shadow-2xl my-auto z-10 overflow-hidden text-[#F5F5F5]">
            <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between bg-[#101010]">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0]">
                  {selectedCaseStudy.category} · Case Study
                </span>
                <h3 className="text-2xl font-bold font-display text-white">
                  {selectedCaseStudy.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCaseStudy(null)}
                className="p-2 text-[#929292] hover:text-white border border-white/10 hover:border-white/30 transition-all cursor-pointer bg-[#0a0a0a]"
                aria-label="Close Case Study"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Certificate Preview inside Case Study Modal */}
              {selectedCaseStudy.certificateUrl && (
                <div className="p-4 bg-[#101010] border border-white/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#C0C0C0] flex items-center gap-2">
                      <Award className="w-4 h-4 text-white" />
                      <span>Verified Completion Certificate</span>
                    </span>
                    <button
                      onClick={() => modalCertInputRef.current?.click()}
                      className="text-xs font-mono text-[#C0C0C0] hover:text-white underline cursor-pointer"
                    >
                      Replace Certificate
                    </button>
                  </div>
                  <img
                    src={selectedCaseStudy.certificateUrl}
                    alt="Completion Certificate"
                    className="w-full max-h-72 object-contain bg-black border border-white/10"
                  />
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-[#C0C0C0] tracking-wider">
                  Problem Statement
                </h4>
                <p className="text-sm text-[#929292] leading-relaxed">
                  {selectedCaseStudy.caseStudy.problemStatement}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-[#C0C0C0] tracking-wider">
                  Architecture & Design Decisions
                </h4>
                <p className="text-sm text-[#929292] leading-relaxed">
                  {selectedCaseStudy.caseStudy.architectureNotes}
                </p>
                <ul className="space-y-1.5 pt-2">
                  {selectedCaseStudy.caseStudy.implementationDecisions.map((dec, i) => (
                    <li key={i} className="text-xs text-[#F5F5F5] flex items-start gap-2">
                      <span className="text-[#C0C0C0] font-mono font-bold">·</span>
                      <span>{dec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-[#C0C0C0] tracking-wider">
                  Engineering Challenges & Solutions
                </h4>
                <div className="space-y-3">
                  {selectedCaseStudy.caseStudy.challengesAndSolutions.map((cs, i) => (
                    <div key={i} className="p-4 bg-[#101010] border border-white/[0.08] space-y-1.5">
                      <p className="text-xs font-semibold text-white">
                        Challenge: <span className="text-[#C0C0C0] font-normal">{cs.challenge}</span>
                      </p>
                      <p className="text-xs text-[#929292]">
                        Solution: <span className="text-[#F5F5F5]">{cs.solution}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-[#C0C0C0] tracking-wider">
                  Key Learnings
                </h4>
                <p className="text-sm text-[#929292] leading-relaxed">
                  {selectedCaseStudy.caseStudy.whatILearned}
                </p>
              </div>
            </div>

            <div className="p-4 md:p-6 border-t border-white/10 bg-[#101010] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <input
                  ref={modalCertInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleCertificateUpload(selectedCaseStudy.id, e)}
                />
                <button
                  onClick={() => modalCertInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#191919] hover:bg-[#252525] border border-white/20 text-xs font-mono text-white transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{selectedCaseStudy.certificateUrl ? 'Replace Certificate' : 'Upload Internship Certificate'}</span>
                </button>
              </div>
              <button
                onClick={() => setSelectedCaseStudy(null)}
                className="px-5 py-2 bg-[#F5F5F5] hover:bg-[#C0C0C0] text-black text-xs font-mono font-semibold transition-colors cursor-pointer"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
