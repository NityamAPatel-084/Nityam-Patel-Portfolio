import React from 'react';
import { GraduationCap, Calendar, Award } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

function EducationThumbnail({ eduId }: { eduId: string }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0c0f1d] via-neutral-950 to-black/95 flex items-center justify-center overflow-hidden h-full w-full">
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:16px_16px]" />
      <div className="absolute w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl animate-pulse" />
      <svg className="w-[75%] h-[75%] text-indigo-400/30" viewBox="0 0 120 120" fill="none">
        {/* Decorative academic coordinates / blueprint seal */}
        <circle cx="60" cy="60" r="45" className="stroke-indigo-500/30 stroke-[1]" />
        <circle cx="60" cy="60" r="38" className="stroke-indigo-400/20 stroke-[1]" strokeDasharray="3 3" />
        <polygon points="60,30 90,48 60,66 30,48" className="stroke-indigo-400 stroke-[1.5] fill-indigo-950/40" />
        <line x1="60" y1="66" x2="60" y2="90" className="stroke-indigo-400 stroke-[1.5]" />
        <path d="M48,80 C48,90 72,90 72,80" className="stroke-indigo-400 stroke-[1.5]" />
        <circle cx="60" cy="48" r="4" className="fill-white" />
        {/* Cognitive constellation dots */}
        <circle cx="25" cy="85" r="2.5" className="fill-sky-400" />
        <circle cx="95" cy="85" r="2.5" className="fill-purple-400" />
        <circle cx="95" cy="35" r="2.5" className="fill-teal-400" />
        <path d="M25,85 L40,85" className="stroke-neutral-800" />
        <path d="M95,85 L80,85" className="stroke-neutral-800" />
      </svg>
      <div className="absolute bottom-3 left-3 font-mono text-[9px] text-indigo-400/80 bg-indigo-950/60 px-2 py-0.5 border border-indigo-800/30 rounded">
        ACADEMIA_SEAL // CS_VFX
      </div>
    </div>
  );
}

export default function EducationSection() {
  const { educations } = usePortfolio();

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      <div>
        <h3 className="font-sans text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
            Education &amp; Academics
          </span>
        </h3>
        <p className="font-sans text-xs text-neutral-400 mt-1">
          Academic achievements, certified degrees, and performance credentials
        </p>
      </div>

      {/* Grid of beautifully designed, expanded horizontal cards (58% thumbnail, 42% content) */}
      <div className="grid grid-cols-1 gap-8">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="group relative bg-[#111827]/40 hover:bg-[#111827]/75 border border-neutral-800/80 hover:border-indigo-500/40 transition-all duration-300 flex flex-col md:flex-row h-auto md:h-[280px] backdrop-blur-md cursor-pointer shadow-lg overflow-hidden clip-corner"
          >
            {/* Left Portion: Visual Thumbnail takes up 58% of card width */}
            <div className="relative w-full md:w-[58%] h-48 md:h-full overflow-hidden shrink-0 border-r-0 md:border-r border-b md:border-b-0 border-neutral-800/60 bg-[#090b11]">
              <EducationThumbnail eduId={edu.id} />
              
              {/* Year Period badge floated over thumbnail */}
              <div className="absolute top-3.5 left-3.5 inline-block font-sans text-[9px] bg-indigo-500/80 backdrop-blur text-white border border-indigo-400/30 px-2.5 py-1 rounded-full font-semibold tracking-wider">
                {edu.period}
              </div>

              {/* Distinction / Badge floated over thumbnail */}
              {edu.grade && (
                <div className="absolute top-3.5 right-3.5 inline-block font-mono text-[9px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded font-semibold uppercase tracking-wider">
                  {edu.grade}
                </div>
              )}
            </div>

            {/* Right Portion: Key descriptions and metadata occupying 42% of card space */}
            <div className="w-full md:w-[42%] p-5 flex flex-col justify-between h-full bg-[#0a0c14]/30">
              <div className="space-y-3.5">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-sans text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {edu.degree}
                    </h4>
                    <p className="font-sans text-xs text-neutral-300">
                      {edu.institution}
                    </p>
                  </div>
                  <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg shrink-0">
                    <GraduationCap size={14} />
                  </div>
                </div>

                {/* Completely readable academic details with no clamps */}
                <p className="font-sans text-xs text-neutral-400 leading-relaxed overflow-y-auto max-h-[110px] scrollbar-thin pr-1 font-normal">
                  {edu.details}
                </p>
              </div>

              {/* Interactive bottom decoration */}
              <div className="border-t border-neutral-800/50 pt-3 mt-4 flex justify-between items-center text-[10px] text-neutral-500">
                <span>VERIFIED LEDGER ENTRY</span>
                <div className="flex items-center gap-1 text-emerald-500">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
                  <span className="font-mono text-[9px]">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
