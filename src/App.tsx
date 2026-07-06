import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ParticleCanvas from './components/ParticleCanvas';
import Sidebar from './components/Sidebar';
import AboutSection from './components/AboutSection';
import ProjectSlider from './components/ProjectSlider';
import ProjectDetailModal from './components/ProjectDetailModal';
import CertificatesList from './components/CertificatesList';
import TechnologiesGrid from './components/TechnologiesGrid';
import HackathonsCard from './components/HackathonsCard';
import ExperienceTimeline from './components/ExperienceTimeline';
import EducationSection from './components/EducationSection';
import ContactConsole from './components/ContactConsole';
import AdminDashboard from './components/AdminDashboard';
import DeployModal from './components/DeployModal';
import { Project } from './types';
import { usePortfolio } from './context/PortfolioContext';
import { Cpu, Wifi, ShieldAlert, Clock, Terminal, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './components/ScrollReveal';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDeploy, setShowDeploy] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [isReady, setIsReady] = useState(false);

  const { showAdmin, setShowAdmin } = usePortfolio();

  // Tick the dynamic clock
  useEffect(() => {
    setIsReady(true);
    const updateTime = () => {
      const now = new Date();
      const utcString = now.toUTCString().replace('GMT', 'UTC');
      setTimeStr(utcString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Set up intersection observer for scrollspy active state tracking
  useEffect(() => {
    if (!isReady) return;

    const sections = [
      'home',
      'technologies',
      'projects',
      'experience',
      'hackathons',
      'certifications',
      'education',
      'connect',
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // perfectly balances mid-viewport intersection
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id.replace('section-', '');
          setActiveSection(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(`section-${id}`);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(`section-${id}`);
        if (el) observer.unobserve(el);
      });
    };
  }, [isReady]);

  const handleResumeDownload = () => {
    // Generate simple mock signed dossier file download trigger
    const fileContent = `NITYAM PATEL - CREATIVE TECHNOLOGIES DOSSIER\n\n=== OVERVIEW ===\nChief Creative Engineer & VFX Technologist.\n\n=== STACK ===\nTypeScript, Rust, Go, WebGL/GLSL, PyTorch, React.\n\n=== VERIFIED LEDGER ===\n- B.S. Mass Institute of Cognitive Design (GPA 3.96)\n- GDE Web VFX Certified\n- Rust WASM Certified\n\n==========================================\nUPLINK SECURE COGNITIVE DATABASE SIGNED 2026`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nityam_patel_secure_dossier.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Return background particle mood based on selected section
  const getParticleMood = (): 'cyan' | 'violet' | 'green' => {
    if (activeSection === 'technologies') return 'violet';
    if (activeSection === 'certifications' || activeSection === 'connect') return 'green';
    return 'cyan';
  };

  if (!isReady) return null;

  return (
    <div className="min-h-screen bg-cyber-bg text-white font-sans relative flex select-none overflow-x-hidden">
      {/* Immersive WebGL/Canvas Particle System */}
      <ParticleCanvas mood={getParticleMood()} />

      {/* Cybernetic Navigation Hub */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onEducationClick={() => handleSectionChange('education')}
        onResumeClick={handleResumeDownload}
        onDeployClick={() => setShowDeploy(true)}
      />

      {/* Main Viewport Frame */}
      <main className="flex-grow pl-52 min-h-screen flex flex-col justify-between relative z-10">
        
        {/* Top Professional Navigation Bar */}
        <header className="px-8 py-4 border-b border-neutral-800/40 bg-[#090a0f]/60 backdrop-blur-md flex justify-between items-center select-none text-xs text-neutral-400">
          <div className="flex items-center gap-2.5 font-medium">
            <span 
              className="text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors"
              onClick={() => handleSectionChange('home')}
            >
              Portfolio
            </span>
            <span className="text-neutral-700 font-mono text-[10px]">/</span>
            <span className="text-white capitalize font-semibold tracking-wide">{activeSection}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
              <span>Operational: Active</span>
            </div>
            <span className="hidden sm:inline text-neutral-800">|</span>
            <div className="flex items-center gap-2 text-neutral-300 font-mono text-[11px]">
              <Clock size={12} className="text-sky-400" />
              <span>{timeStr || 'CLOCKING...'}</span>
            </div>
          </div>
        </header>

        {/* Dynamic content deck stage */}
        <div className="px-8 py-16 flex-grow max-w-6xl w-full mx-auto space-y-32 pb-32">
          <section id="section-home" className="scroll-mt-28">
            <ScrollReveal direction="up">
              <AboutSection onResumeClick={handleResumeDownload} />
            </ScrollReveal>
          </section>

          <section id="section-technologies" className="scroll-mt-28">
            <ScrollReveal direction="up">
              <TechnologiesGrid />
            </ScrollReveal>
          </section>

          <section id="section-projects" className="scroll-mt-28">
            <ScrollReveal direction="up">
              <ProjectSlider onProjectClick={(p) => setSelectedProject(p)} />
            </ScrollReveal>
          </section>

          <section id="section-experience" className="scroll-mt-28">
            <ScrollReveal direction="up">
              <ExperienceTimeline />
            </ScrollReveal>
          </section>

          <section id="section-hackathons" className="scroll-mt-28">
            <ScrollReveal direction="up">
              <HackathonsCard />
            </ScrollReveal>
          </section>

          <section id="section-certifications" className="scroll-mt-28">
            <ScrollReveal direction="up">
              <CertificatesList />
            </ScrollReveal>
          </section>

          <section id="section-education" className="scroll-mt-28">
            <ScrollReveal direction="up">
              <EducationSection />
            </ScrollReveal>
          </section>

          <section id="section-connect" className="scroll-mt-28">
            <ScrollReveal direction="up">
              <ContactConsole />
            </ScrollReveal>
          </section>
        </div>

        {/* Elegant Bottom Footer */}
        <footer className="px-8 py-3.5 border-t border-neutral-800/40 bg-[#090a0f]/40 backdrop-blur-md flex justify-between items-center text-[11px] font-sans text-neutral-500 select-none">
          <div>
            Designed &amp; Engineered by Nityam Patel
          </div>
          <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span>Operational Stability: 100%</span>
          </div>
        </footer>
      </main>

      {/* Diagnostics / Educational Modals */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
        {showDeploy && (
          <DeployModal
            onClose={() => setShowDeploy(false)}
          />
        )}
        {showAdmin && (
          <AdminDashboard
            onClose={() => setShowAdmin(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
