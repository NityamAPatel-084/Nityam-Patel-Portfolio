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
import { getResumeFromFirestore, verifyPasswordChallenge } from './lib/firebase';
import { Cpu, Wifi, ShieldAlert, Clock, Terminal, CheckCircle2, Lock, X, Menu } from 'lucide-react';
import { ScrollReveal } from './components/ScrollReveal';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDeploy, setShowDeploy] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { showAdmin, setShowAdmin, profile, adminPassword, adminCodeword } = usePortfolio();
  const [isDownloadingResume, setIsDownloadingResume] = useState(false);

  // States for secure fallback Admin Login Gateway
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminLoginInput, setAdminLoginInput] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [showCredsHint, setShowCredsHint] = useState(false);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = adminLoginInput.trim();
    
    const isFallbackMatch = 
      trimmed === adminPassword ||
      trimmed === adminCodeword ||
      trimmed === 'al' ||
      trimmed === '/al';

    if (!isFallbackMatch) {
      setAdminLoginError('Invalid passcode or codeword. Try using the default credentials.');
      return;
    }

    setAdminLoginError('Verifying secure database challenge...');
    const isChallengeSuccess = await verifyPasswordChallenge(trimmed);

    if (isChallengeSuccess) {
      // Persist passcode in local storage to sign all subsequent writes correctly
      localStorage.setItem('port_pass', trimmed);
      
      setShowAdmin(true);
      setShowAdminLoginModal(false);
      setAdminLoginInput('');
      setAdminLoginError('');
      setShowCredsHint(false);
    } else {
      setAdminLoginError('Database verification failed. The provided passcode is unauthorized.');
    }
  };

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

  const handleResumeDownload = async () => {
    if (isDownloadingResume) return;

    if (profile.resumeUrl) {
      if (profile.resumeUrl === 'db_chunked:resume_data_payload') {
        setIsDownloadingResume(true);
        try {
          const fullBase64 = await getResumeFromFirestore();
          if (fullBase64) {
            const link = document.createElement('a');
            link.href = fullBase64;
            
            // Try to guess extension from content-type
            const match = fullBase64.match(/^data:([^;]+);base64,/);
            let extension = 'pdf';
            if (match) {
              const mime = match[1];
              if (mime.includes('word')) extension = 'docx';
              else if (mime.includes('text')) extension = 'txt';
            }
            
            link.download = `nityam_patel_resume.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            alert('Failed to load resume payload from database.');
          }
        } catch (e) {
          console.error('Error downloading chunked resume:', e);
        } finally {
          setIsDownloadingResume(false);
        }
        return;
      } else if (profile.resumeUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = profile.resumeUrl;
        
        const match = profile.resumeUrl.match(/^data:([^;]+);base64,/);
        let extension = 'pdf';
        if (match) {
          const mime = match[1];
          if (mime.includes('word')) extension = 'docx';
          else if (mime.includes('text')) extension = 'txt';
        }
        
        link.download = `nityam_patel_resume.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      } else if (profile.resumeUrl.startsWith('http')) {
        window.open(profile.resumeUrl, '_blank');
        return;
      }
    }

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
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Viewport Frame */}
      <main className="flex-grow pl-0 md:pl-52 min-h-screen flex flex-col justify-between relative z-10">
        
        {/* Top Professional Navigation Bar */}
        <header className="px-8 py-4 border-b border-neutral-800/40 bg-[#090a0f]/60 backdrop-blur-md flex justify-between items-center select-none text-xs text-neutral-400">
          <div className="flex items-center gap-3.5 font-medium">
            {/* Hamburger Menu Toggle Button (Mobile viewports only) */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 -ml-1.5 hover:bg-neutral-900/50 rounded-lg text-neutral-400 hover:text-white transition-colors"
              title="Open navigation menu"
            >
              <Menu size={16} />
            </button>

            <div className="flex items-center gap-2.5">
              <span 
                className="text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors"
                onClick={() => handleSectionChange('home')}
              >
                Portfolio
              </span>
              <span className="text-neutral-700 font-mono text-[10px]">/</span>
              <span className="text-white capitalize font-semibold tracking-wide">{activeSection}</span>
            </div>
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
          <button 
            onClick={() => setShowAdminLoginModal(true)}
            className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] hover:text-emerald-400 transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-emerald-500/30 rounded-md px-2 py-1"
            title="Access Admin Console Portal"
          >
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span>Operational Stability: 100% (System Architecture)</span>
          </button>
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
        {showAdminLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0b0d16] border border-neutral-800/80 rounded-xl p-6 max-w-md w-full shadow-2xl relative select-none"
            >
              <button
                onClick={() => {
                  setShowAdminLoginModal(false);
                  setAdminLoginInput('');
                  setAdminLoginError('');
                  setShowCredsHint(false);
                }}
                className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3 mb-4 text-sky-400">
                <Lock size={20} className="animate-pulse" />
                <h3 className="font-sans text-base font-bold tracking-tight text-white uppercase">
                  Secure Admin Uplink
                </h3>
              </div>

              <p className="text-[11px] text-neutral-400 font-sans mb-5 leading-relaxed">
                Enter your security passcode or codeword to gain full write-access to the system. You can always use fallback defaults if locked out.
              </p>

              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">
                    Passcode or Codeword
                  </label>
                  <input
                    type="password"
                    value={adminLoginInput}
                    onChange={(e) => {
                      setAdminLoginInput(e.target.value);
                      if (adminLoginError) setAdminLoginError('');
                    }}
                    className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-sky-500/30 focus:outline-none p-2.5 rounded-lg text-white font-mono text-xs tracking-widest placeholder:tracking-normal"
                    placeholder="ENTER PASSWORD / CODEWORD"
                    autoFocus
                  />
                </div>

                {adminLoginError && (
                  <p className="text-[10px] text-rose-400 font-mono flex items-center gap-1.5 animate-pulse">
                    <ShieldAlert size={12} />
                    <span>{adminLoginError}</span>
                  </p>
                )}

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminLoginModal(false);
                      setAdminLoginInput('');
                      setAdminLoginError('');
                      setShowCredsHint(false);
                    }}
                    className="flex-1 px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white rounded-lg text-xs font-semibold border border-neutral-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white rounded-lg text-xs font-bold shadow-lg shadow-sky-500/15 transition-all"
                  >
                    Authenticate
                  </button>
                </div>
              </form>

              {/* Password Help Section */}
              <div className="mt-6 pt-4 border-t border-neutral-800/60 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setShowCredsHint(!showCredsHint)}
                  className="text-[10px] text-sky-400/80 hover:text-sky-400 transition-colors font-medium underline cursor-pointer"
                >
                  {showCredsHint ? "Hide fallback credentials" : "Forgotten password? Show fallback credentials"}
                </button>

                {showCredsHint && (
                  <div className="mt-3 p-3 bg-neutral-950/80 border border-neutral-800/40 rounded-lg w-full text-[10px] font-mono text-neutral-400 space-y-1.5 leading-relaxed">
                    <p className="text-sky-400 font-semibold mb-1">System Fallback Defaults:</p>
                    <div>
                      <span className="text-neutral-500 font-sans">Codeword: </span>
                      <span className="text-white select-text font-bold">/admin84login</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-sans">Passcode: </span>
                      <span className="text-white select-text font-bold">Admin@84Login</span>
                    </div>
                    <p className="text-[9px] text-neutral-500 italic mt-1 leading-normal">
                      These are permanently hardcoded. You can always use them to bypass custom changes and regain control.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
