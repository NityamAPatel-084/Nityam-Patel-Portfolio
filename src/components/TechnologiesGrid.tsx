import React, { useState } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { Terminal, Code, Database, Cpu, Settings, Activity } from 'lucide-react';
import { StaggerContainer, StaggerItem } from './ScrollReveal';

export default function TechnologiesGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { technologies } = usePortfolio();

  const categories = [
    { id: 'all', label: 'ALL', icon: Terminal },
    { id: 'Languages', label: 'LANGUAGES', icon: Code },
    { id: 'Frontend', label: 'FRONTEND', icon: Database },
    { id: 'Creative Tech', label: 'CREATIVE TECH', icon: Activity },
    { id: 'AI / Neural', label: 'AI & DATA', icon: Cpu },
    { id: 'Infrastructure', label: 'INFRASTRUCTURE', icon: Settings },
  ];

  const filteredTechs = selectedCategory === 'all'
    ? technologies
    : technologies.filter(t => t.category === selectedCategory);


  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h3 className="font-sans text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400">
              Technologies &amp; Expertise
            </span>
          </h3>
          <p className="font-sans text-xs text-neutral-400 mt-1">
            Languages, frameworks, and engineering tools applied across projects
          </p>
        </div>

        {/* Categories Tab selector */}
        <div className="flex flex-wrap gap-1 bg-neutral-900/40 p-1 border border-neutral-800/80 clip-corner-sm">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 font-sans text-xs transition-all duration-300 flex items-center gap-1.5 rounded-md ${
                selectedCategory === cat.id
                  ? 'bg-sky-500/10 text-sky-400 font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
              }`}
            >
              <span className="scale-75 text-neutral-500"><cat.icon size={11} /></span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid rendering with Stagger animation */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechs.map((tech) => (
          <StaggerItem key={tech.name}>
            <div
              className="group bg-[#111827]/40 hover:bg-[#111827]/75 border border-neutral-800/80 hover:border-sky-500/30 p-5 clip-corner-sm transition-all duration-300 space-y-3.5 backdrop-blur-md relative h-full"
            >
              {/* Name / Badge */}
              <div className="flex justify-between items-center">
                <span className="font-sans text-sm font-semibold text-white group-hover:text-sky-400 transition-colors">
                  {tech.name}
                </span>
                <span className="font-mono text-[9px] text-neutral-500 tracking-wider">
                  [{tech.category.toUpperCase()}]
                </span>
              </div>

              {/* Proficiency Loading bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center font-sans text-xs text-neutral-400">
                  <span className="text-emerald-400 font-semibold">{tech.status}</span>
                  <span>Proficiency: {tech.proficiency}%</span>
                </div>
                <div className="h-1 bg-neutral-900 overflow-hidden relative border border-neutral-800/40 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tech.proficiency}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full"
                  />
                </div>
              </div>

              {/* Micro-telemetry metric */}
              <div className="pt-2 border-t border-neutral-800/40 flex justify-between items-center font-sans text-xs text-neutral-500">
                <span>Focus Area</span>
                <span className="text-neutral-400 font-medium font-sans tracking-wide">{tech.metric}</span>
              </div>

              {/* Decorative active indicator dot */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-sky-500/10 group-hover:bg-sky-400 rounded-full transition-colors" />
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
