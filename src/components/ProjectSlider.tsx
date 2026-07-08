import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRight, Cpu, Network, Shield, Waves, HelpCircle, ArrowUpRight } from 'lucide-react';
import { useResolvedUrl } from '../hooks/useResolvedUrl';

interface ProjectSliderProps {
  onProjectClick: (project: Project) => void;
}

export function ProjectThumbnail({ projectId }: { projectId: string }) {
  switch (projectId) {
    case 'neural-synapse-core':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 to-black/85 flex items-center justify-center overflow-hidden h-full w-full">
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px]" />
          <svg className="w-[85%] h-[85%] text-sky-500/40" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="12" className="stroke-sky-400 fill-sky-950/90 stroke-[2] animate-pulse" />
            <circle cx="50" cy="60" r="7" className="stroke-indigo-400 fill-indigo-950/80 stroke-[1.5]" />
            <circle cx="150" cy="60" r="7" className="stroke-purple-400 fill-purple-950/80 stroke-[1.5]" />
            <circle cx="60" cy="140" r="7" className="stroke-teal-400 fill-teal-950/80 stroke-[1.5]" />
            <circle cx="140" cy="140" r="7" className="stroke-sky-400 fill-sky-950/80 stroke-[1.5]" />
            <path d="M50 60 L100 100 M150 60 L100 100 M60 140 L100 100 M140 140 L100 100" className="stroke-sky-500/30 stroke-[2]" strokeDasharray="4 4" />
            <path d="M50 60 L150 60 L140 140 L60 140 Z" className="stroke-sky-500/10 stroke-[1.5]" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-sky-400/80 bg-sky-950/60 px-2 py-0.5 border border-sky-800/30 rounded">
            SYS_REF_2026 // NEURAL_NET
          </div>
        </div>
      );
    case 'void-mesh-gateway':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 to-[#0e0c1f] flex items-center justify-center overflow-hidden h-full w-full">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] bg-[size:14px_14px]" />
          <svg className="w-4/5 h-4/5 text-indigo-500/40" viewBox="0 0 200 100" fill="none">
            <path d="M10 50 Q 50 12, 100 50 T 190 50" className="stroke-indigo-500 stroke-[2]" />
            <path d="M10 50 Q 50 88, 100 50 T 190 50" className="stroke-sky-500 stroke-[1.5] opacity-50" strokeDasharray="4 4" />
            <line x1="50" y1="10" x2="50" y2="90" className="stroke-neutral-800/60 stroke-[1]" />
            <line x1="100" y1="10" x2="100" y2="90" className="stroke-indigo-500/20 stroke-[1.5]" />
            <line x1="150" y1="10" x2="150" y2="90" className="stroke-neutral-800/60 stroke-[1]" />
            <circle cx="100" cy="50" r="5" className="fill-indigo-400" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-indigo-400/80 bg-indigo-950/60 px-2 py-0.5 border border-indigo-800/30 rounded">
            PORT_GATEWAY // STABLE_FLOW
          </div>
        </div>
      );
    case 'quantum-flow-viz':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 to-[#030712] flex items-center justify-center overflow-hidden h-full w-full">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px)] bg-[size:10px]" />
          <svg className="w-3/4 h-3/4 text-sky-400/40" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="28" className="stroke-sky-500/20 stroke-[1]" />
            <circle cx="50" cy="50" r="40" className="stroke-indigo-500/10 stroke-[1.5]" />
            <circle cx="50" cy="50" r="14" className="stroke-teal-500/30 stroke-[1]" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="4" className="fill-white" />
            <circle cx="28" cy="36" r="3" className="fill-sky-400 animate-pulse" />
            <circle cx="76" cy="68" r="2.5" className="fill-indigo-400" />
            <circle cx="50" cy="18" r="2" className="fill-teal-300" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-sky-400/80 bg-sky-950/60 px-2 py-0.5 border border-sky-800/30 rounded">
            PARTICLE_FLOW // 60FPS
          </div>
        </div>
      );
    case 'google-racer':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-[#1a1103]/25 to-black flex items-center justify-center overflow-hidden h-full w-full">
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] bg-[size:12px_18px]" />
          <svg className="w-4/5 h-4/5 text-amber-500/30" viewBox="0 0 160 100" fill="none">
            <path d="M20 50 C 20 20, 140 20, 140 50 C 140 80, 20 80, 20 50 Z" className="stroke-neutral-800 stroke-[4]" />
            <path d="M20 50 C 20 20, 140 20, 140 50 C 140 80, 20 80, 20 50 Z" className="stroke-amber-500/55 stroke-[1.5]" strokeDasharray="8 12" />
            <rect x="72" y="16" width="16" height="8" rx="2" className="fill-amber-400 stroke-amber-200 stroke-[1]" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-amber-400/80 bg-amber-950/60 px-2 py-0.5 border border-amber-800/30 rounded">
            GOOGLE_EXPERIMENT // SLOT_CAR
          </div>
        </div>
      );
    case 'frontier-within':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c2417]/30 to-black/90 flex items-center justify-center overflow-hidden h-full w-full">
          <svg className="w-4/5 h-4/5 text-emerald-500/30" viewBox="0 0 160 100" fill="none">
            <path d="M10 50 L40 50 L50 18 L58 87 L66 42 L74 58 L80 50 L110 50 L118 8 L126 92 L134 38 L140 50 L150 50" className="stroke-emerald-400 stroke-[1.5]" strokeLinejoin="round" />
            <circle cx="118" cy="8" r="2.5" className="fill-emerald-300 animate-ping" />
            <circle cx="118" cy="8" r="2" className="fill-emerald-300" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-emerald-400/80 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800/30 rounded">
            BIOMETRICS // LIGHT_PORTRAIT
          </div>
        </div>
      );
    case 'patronus-experience':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#061824] to-black/85 flex items-center justify-center overflow-hidden h-full w-full">
          <div className="absolute w-28 h-28 rounded-full bg-cyan-500/10 blur-xl animate-pulse" />
          <svg className="w-3/4 h-3/4 text-cyan-400/40" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="26" className="stroke-cyan-400/40 stroke-[1.5]" />
            <path d="M50 24 A 26 26 0 0 1 76 50" className="stroke-cyan-300 stroke-[2.5]" strokeLinecap="round" strokeDasharray="2 2" />
            <path d="M24 50 A 26 26 0 0 1 50 76" className="stroke-sky-300 stroke-[2]" strokeLinecap="round" />
            <line x1="50" y1="8" x2="50" y2="92" className="stroke-cyan-500/10" />
            <line x1="92" y1="50" x2="8" y2="50" className="stroke-cyan-500/10" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 border border-cyan-800/30 rounded">
            THREE_JS // VOICE_QUEST
          </div>
        </div>
      );
    case 'kandinsky-music':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#241306] to-[#040201]/95 flex items-center justify-center overflow-hidden h-full w-full">
          <svg className="w-3/4 h-3/4 text-purple-400/40" viewBox="0 0 100 100" fill="none">
            <circle cx="36" cy="46" r="16" className="stroke-amber-400 stroke-[2] fill-amber-500/10" />
            <polygon points="54,18 86,58 44,68" className="stroke-purple-500 stroke-[1.5] fill-purple-500/5" />
            <line x1="18" y1="78" x2="82" y2="18" className="stroke-sky-400 stroke-[2]" strokeLinecap="round" />
            <circle cx="66" cy="38" r="5" className="fill-indigo-500" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-amber-400/80 bg-amber-950/60 px-2 py-0.5 border border-amber-800/30 rounded">
            TONE_JS // MUSIC_SYNTH
          </div>
        </div>
      );
    case 'ibm-harmonic-state':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#120f26] to-black/90 flex items-center justify-center overflow-hidden h-full w-full">
          <svg className="w-[85%] h-[85%] text-purple-500/30" viewBox="0 0 160 100" fill="none">
            <path d="M20 50 L20 30 L20 70 M40 50 L40 10 L40 90 M60 50 L60 25 L60 75 M80 50 L80 15 L80 85 M100 50 L100 35 L100 65 M120 50 L120 20 L120 80 M140 50 L140 40 L140 60" className="stroke-indigo-400 stroke-[3.5]" strokeLinecap="round" />
            <path d="M20 50 L20 40 L20 60 M40 50 L40 25 L40 75 M60 50 L60 35 L60 65 M80 50 L80 25 L80 75 M100 50 L100 45 L100 55 M120 50 L120 30 L120 70 M140 50 L140 45 L140 55" className="stroke-purple-400 stroke-[1.5]" strokeLinecap="round" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-indigo-400/80 bg-indigo-950/60 px-2 py-0.5 border border-indigo-800/30 rounded">
            IBM_WATSON // RESP_SPEECH
          </div>
        </div>
      );
    default:
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-950/20 to-neutral-950 flex items-center justify-center h-full w-full">
          <Cpu className="text-sky-400/30 animate-pulse" size={40} />
        </div>
      );
  }
}

function ProjectMediaThumbnail({ project }: { project: any }) {
  const imageUrl = project.imageUrl;
  const resolvedUrl = useResolvedUrl(imageUrl);

  if (resolvedUrl) {
    const isPdf = imageUrl.startsWith('data:application/pdf') || 
                  imageUrl.endsWith('.pdf') || 
                  (resolvedUrl.startsWith('blob:') && imageUrl.includes('application/pdf'));

    if (isPdf) {
      return (
        <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center overflow-hidden h-full w-full">
          <iframe 
            src={`${resolvedUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full border-none pointer-events-none bg-white scale-[1.02]"
            style={{ backgroundColor: '#ffffff' }}
            title={project.title}
          />
          <div className="absolute inset-0 bg-transparent z-10" />
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-sky-400 bg-black/75 px-2 py-0.5 border border-sky-800/40 rounded z-20">
            PROJECT // MOUNTED // PDF
          </div>
        </div>
      );
    } else {
      return (
        <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center overflow-hidden h-full w-full">
          <img 
            src={resolvedUrl} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            referrerPolicy="no-referrer" 
            alt={project.title} 
          />
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-sky-400 bg-black/75 px-2 py-0.5 border border-sky-800/40 rounded">
            PROJECT // IMAGE // MOUNTED
          </div>
        </div>
      );
    }
  }

  return <ProjectThumbnail projectId={project.id} />;
}

export default function ProjectSlider({ onProjectClick }: ProjectSliderProps) {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const { projects } = usePortfolio();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'xr-vr-ai':
        return <Cpu className="text-sky-400" size={16} />;
      case 'multiplayer':
        return <Network className="text-indigo-400" size={16} />;
      default:
        return <Shield className="text-sky-400" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE_STATE':
        return 'text-sky-400 border-sky-400/20 bg-sky-500/5';
      case 'STABLE_REL':
        return 'text-emerald-400 border-emerald-400/20 bg-emerald-500/5';
      case 'OPTIMIZING':
        return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
      default:
        return 'text-neutral-400 border-neutral-700 bg-neutral-900/40';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'ACTIVE_STATE':
        return 'Active';
      case 'STABLE_REL':
        return 'Completed';
      case 'OPTIMIZING':
        return 'In Progress';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Redesigned Section Title to say 'Projects' */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h3 className="font-sans text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
              Projects
            </span>
          </h3>
          <p className="font-sans text-xs text-neutral-400 mt-1">
            A curated selection of creative engineering and immersive development projects
          </p>
        </div>
      </div>

      {/* Expanded Redesigned Horizontal Card Layout: Thumbnail gets more area than text content (58% vs 42%) */}
      <motion.div 
        layout
        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -15 }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setHoveredCardId(project.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              className="group relative bg-[#111827]/40 hover:bg-[#111827]/75 border border-neutral-800/80 hover:border-sky-500/40 transition-all duration-300 clip-corner flex flex-col md:flex-row h-auto md:h-[350px] backdrop-blur-md cursor-pointer shadow-lg overflow-hidden"
              onClick={() => onProjectClick(project)}
            >
              {/* Left Side: Thumbnail gets 58% width area, providing an immersive preview */}
              <div className="relative w-full md:w-[58%] h-56 md:h-full overflow-hidden shrink-0 border-r-0 md:border-r border-b md:border-b-0 border-neutral-800/60 bg-[#090b11]">
                <ProjectMediaThumbnail project={project} />
                
                {/* Category Floater Badge */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 bg-neutral-950/80 backdrop-blur border border-neutral-800 rounded-full font-mono text-[9px] text-neutral-400 uppercase tracking-wider">
                  {getCategoryIcon(project.category)}
                  <span>{project.category.replace(/-/g, ' ')}</span>
                </div>

                {/* Direct Action Indicator */}
                <div className="absolute top-3.5 right-3.5 p-1.5 bg-neutral-950/80 border border-neutral-800 rounded-full text-neutral-500 group-hover:text-sky-400 group-hover:border-sky-400/40 transition-all">
                  <ArrowUpRight size={14} />
                </div>
              </div>

              {/* Right Side: Content gets 42% area, perfectly spaced for maximum readability */}
              <div className="w-full md:w-[42%] p-6 flex flex-col justify-between h-full bg-[#0a0c14]/30">
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-neutral-500 font-bold tracking-wider">
                      {project.serial}
                    </span>
                    <span className={`px-2 py-0.5 border rounded-full font-bold text-[10px] ${getStatusColor(project.status)}`}>
                      {formatStatus(project.status)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-sans text-sm font-bold tracking-tight text-white group-hover:text-sky-400 transition-colors duration-300">
                      {project.title.replace(/_/g, ' ')}
                    </h4>
                    <span className="inline-block text-[10px] text-neutral-400 font-medium font-mono">
                      {project.year}
                    </span>
                  </div>

                  {/* Fully displayed readable project details with no truncation constraints */}
                  <p className="font-sans text-xs text-neutral-400 leading-relaxed overflow-y-auto max-h-[120px] scrollbar-thin pr-1 font-normal">
                    {project.description}
                  </p>
                </div>

                <div className="border-t border-neutral-800/50 pt-3.5 mt-4 space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-neutral-950 border border-neutral-800/40 text-neutral-400 font-sans text-[9px] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 font-medium text-[10px] text-neutral-500 group-hover:text-sky-400 transition-colors duration-300">
                    <span>Explore Technical Spec</span>
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Aesthetic Project Filter Help Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#111827]/20 p-5 border border-neutral-800/60 clip-corner">
        <div className="flex gap-3.5">
          <HelpCircle size={32} className="text-indigo-400 shrink-0" />
          <div className="space-y-1">
            <h5 className="font-sans text-xs font-bold text-neutral-200 uppercase tracking-wider">
              About This Selection
            </h5>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed">
              Click any project card to view technical specifications, system architecture diagrams, and interactive walkthrough logs.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-1 border-t md:border-t-0 md:border-l border-neutral-800/80 pt-4 md:pt-0 md:pl-6 font-mono text-[10px] text-neutral-500">
          <div>// COMPLETED PROJECTS ARE FULLY DEPLOYED AND FUNCTIONAL</div>
          <div>// ACTIVE STATE REFLECTS LIVE DEVELOPMENT AND OPTIMIZATIONS</div>
        </div>
      </div>
    </div>
  );
}
