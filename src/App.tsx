import { useState } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DesignWork from './components/DesignWork';
import CreativeSpace from './components/CreativeSpace';
import DevelopmentProjects from './components/DevelopmentProjects';
import AcademicHub from './components/AcademicHub';
import About from './components/About';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ResumeModal from './components/ResumeModal';
import ThreeCanvas from './components/ThreeCanvas';
import EditToolbar from './components/EditToolbar';
import SectionReveal3D from './components/SectionReveal3D';

function PortfolioApp() {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] relative selection:bg-zinc-800 selection:text-white">
      {/* Purposeful, restrained 3D silver dust & chrome ambient environment */}
      <ThreeCanvas />

      {/* Visual Website Editing Toolbar */}
      <EditToolbar />

      {/* Clean Navigation Bar with essential categories, Download CV & Edit Mode toggle */}
      <Navbar onOpenResume={() => setResumeOpen(true)} />

      {/* Main Content Area */}
      <main className="relative z-10">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Selected Creative Work */}
        <SectionReveal3D>
          <DesignWork />
        </SectionReveal3D>

        {/* 3. The Creative Space */}
        <SectionReveal3D>
          <CreativeSpace />
        </SectionReveal3D>

        {/* 4. Development Projects */}
        <SectionReveal3D>
          <DevelopmentProjects />
        </SectionReveal3D>

        {/* 5. Academic Hub */}
        <SectionReveal3D>
          <AcademicHub />
        </SectionReveal3D>

        {/* 6. About & Experience */}
        <SectionReveal3D>
          <About />
        </SectionReveal3D>

        {/* 7. Skills & Tools */}
        <SectionReveal3D>
          <Skills />
        </SectionReveal3D>

        {/* 8. Contact */}
        <SectionReveal3D>
          <Contact />
        </SectionReveal3D>
      </main>

      {/* Footer */}
      <Footer />

      {/* Verified Resume Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
