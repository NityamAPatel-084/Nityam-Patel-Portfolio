import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { StaggerContainer, StaggerItem } from './ScrollReveal';

export default function ExperienceTimeline() {
  const { experiences } = usePortfolio();
  return (
    <div className="space-y-6 select-none">
      <div>
        <h3 className="font-sans text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
            Professional Experience
          </span>
        </h3>
        <p className="font-sans text-xs text-neutral-400 mt-1">
          Chronological history of software development, engineering, and creative technology roles
        </p>
      </div>

      <StaggerContainer className="relative border-l border-neutral-800 ml-3.5 pl-6 space-y-8 py-2">
        {experiences.map((exp) => (
          <StaggerItem key={exp.id} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-[35px] top-1.5 p-1.5 bg-neutral-950 border border-neutral-800 text-neutral-400 group-hover:text-sky-400 group-hover:border-sky-400/40 transition-all rounded-full z-10">
              <Briefcase size={12} />
            </div>

            {/* Content card */}
            <div className="bg-[#111827]/40 hover:bg-[#111827]/75 border border-neutral-800/80 hover:border-sky-500/20 p-5 clip-corner transition-all duration-300 space-y-3.5 backdrop-blur-md">
              {/* Header: Role / Company */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/65 pb-3">
                <div className="space-y-0.5">
                  <h4 className="font-sans text-sm font-semibold text-white group-hover:text-sky-400 transition-colors">
                    {exp.role}
                  </h4>
                  <p className="font-sans text-xs text-neutral-400">
                    {exp.company}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-1.5">
                  <span className="font-sans text-[11px] bg-neutral-900/60 border border-neutral-800 text-neutral-400 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Calendar size={10} className="text-neutral-500" />
                    {exp.period}
                  </span>
                  <span className="font-sans text-[10px] text-neutral-500 font-medium">
                    {exp.status === 'CURRENT_ROLE' ? 'Current Role' : 'Completed'}
                  </span>
                </div>
              </div>

              {/* Description summary */}
              <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                {exp.description}
              </p>

              {/* Bullet details */}
              <ul className="space-y-2 font-sans text-xs text-neutral-400 list-none pl-1">
                {exp.bullets.map((b, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="text-sky-400 font-bold select-none mt-0.5">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
