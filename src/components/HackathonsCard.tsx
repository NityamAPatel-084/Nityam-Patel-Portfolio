import React, { useState } from 'react';
import { Award, Trophy, MapPin, Tag, ArrowUpRight, HelpCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

function HackathonThumbnail({ hackId }: { hackId: string }) {
  switch (hackId) {
    case 'hack-1':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/30 to-[#050300]/95 flex items-center justify-center overflow-hidden h-full w-full">
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#d97706_1px,transparent_1px),linear-gradient(to_bottom,#d97706_1px,transparent_1px)] bg-[size:14px_14px]" />
          <svg className="w-3/4 h-3/4 text-amber-500/40" viewBox="0 0 100 100" fill="none">
            {/* ETH Global block wireframe */}
            <polygon points="50,15 85,35 85,65 50,85 15,65 15,35" className="stroke-amber-400 stroke-[1.5] fill-amber-500/5" />
            <polygon points="50,25 75,40 75,60 50,75 25,60 25,40" className="stroke-amber-500/30 stroke-[1]" />
            <line x1="50" y1="15" x2="50" y2="85" className="stroke-amber-400/40 stroke-[1]" />
            <line x1="15" y1="35" x2="85" y2="65" className="stroke-amber-400/20 stroke-[1]" strokeDasharray="2 2" />
            <line x1="15" y1="65" x2="85" y2="35" className="stroke-amber-400/20 stroke-[1]" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="8" className="stroke-amber-400 fill-amber-950 stroke-[1.5] animate-pulse" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-amber-400/80 bg-amber-950/60 px-2 py-0.5 border border-amber-800/30 rounded">
            ETH_GLOBAL // BUILD_V3
          </div>
        </div>
      );
    case 'hack-2':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1f24]/30 to-black/95 flex items-center justify-center overflow-hidden h-full w-full">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] bg-[size:12px_12px]" />
          <svg className="w-4/5 h-4/5 text-cyan-500/30" viewBox="0 0 160 100" fill="none">
            {/* Creative Sandbox Sound wave frequency blocks */}
            <rect x="20" y="40" width="8" height="20" rx="1" className="fill-cyan-400 animate-pulse" />
            <rect x="36" y="25" width="8" height="50" rx="1" className="fill-cyan-500/80" />
            <rect x="52" y="15" width="8" height="70" rx="1" className="fill-cyan-400 animate-pulse" />
            <rect x="68" y="35" width="8" height="30" rx="1" className="fill-sky-500" />
            <rect x="84" y="20" width="8" height="60" rx="1" className="fill-cyan-400" />
            <rect x="100" y="30" width="8" height="40" rx="1" className="fill-cyan-500/80 animate-pulse" />
            <rect x="116" y="45" width="8" height="10" rx="1" className="fill-cyan-600" />
            <rect x="132" y="35" width="8" height="30" rx="1" className="fill-cyan-400" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 border border-cyan-800/30 rounded">
            SANDBOX_VFX // MULTI_SOUND
          </div>
        </div>
      );
    case 'hack-3':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 to-[#05030c] flex items-center justify-center overflow-hidden h-full w-full">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:10px]" />
          <svg className="w-3/4 h-3/4 text-indigo-500/40" viewBox="0 0 100 100" fill="none">
            {/* Synaptic circuit board paths */}
            <path d="M10,50 L35,50 L45,25 L55,75 L65,50 L90,50" className="stroke-indigo-400 stroke-[2]" />
            <circle cx="45" cy="25" r="4.5" className="fill-indigo-400 animate-pulse" />
            <circle cx="55" cy="75" r="4.5" className="fill-indigo-300" />
            <path d="M35,50 L45,75" className="stroke-indigo-500/40 stroke-[1.5]" strokeDasharray="2 2" />
            <path d="M65,50 L55,25" className="stroke-indigo-500/40 stroke-[1.5]" strokeDasharray="2 2" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-indigo-400/80 bg-indigo-950/60 px-2 py-0.5 border border-indigo-800/30 rounded">
            WASM_NEURAL // EDGE_COMP
          </div>
        </div>
      );
    default:
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 to-neutral-950 flex items-center justify-center h-full w-full">
          <Trophy className="text-indigo-400/30" size={36} />
        </div>
      );
  }
}

export default function HackathonsCard() {
  const { hackathons } = usePortfolio();

  return (
    <div className="space-y-6 select-none">
      <div>
        <h3 className="font-sans text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
            Hackathons &amp; Competitions
          </span>
        </h3>
        <p className="font-sans text-xs text-neutral-400 mt-1">
          Technical awards, placements, and collaborative software sprints
        </p>
      </div>

      {/* Grid of beautifully designed, expanded horizontal cards (58% thumbnail, 42% content) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {hackathons.map((hack) => (
          <div
            key={hack.id}
            className="group relative bg-[#111827]/40 hover:bg-[#111827]/75 border border-neutral-800/80 hover:border-indigo-500/40 transition-all duration-300 flex flex-col md:flex-row h-auto md:h-[280px] backdrop-blur-md cursor-pointer shadow-lg overflow-hidden clip-corner"
          >
            {/* Left Portion: Visual Thumbnail takes up 58% of card width */}
            <div className="relative w-full md:w-[58%] h-48 md:h-full overflow-hidden shrink-0 border-r-0 md:border-r border-b md:border-b-0 border-neutral-800/60 bg-[#090b11]">
              <HackathonThumbnail hackId={hack.id} />
              
              {/* Placement badge floated over thumbnail */}
              <div className="absolute top-3.5 left-3.5 inline-block font-sans text-[9px] bg-indigo-500/80 backdrop-blur text-white border border-indigo-400/30 px-2.5 py-1 rounded-full font-semibold tracking-wider uppercase">
                {hack.position.replace(/_/g, ' ')}
              </div>

              {/* Year badge floated over thumbnail */}
              <div className="absolute top-3.5 right-3.5 inline-block font-mono text-[9px] bg-neutral-950/80 backdrop-blur text-neutral-400 px-2 py-0.5 border border-neutral-800/60 rounded">
                {hack.year}
              </div>
            </div>

            {/* Right Portion: Key descriptions and metadata occupying 42% of card space */}
            <div className="w-full md:w-[42%] p-5 flex flex-col justify-between h-full bg-[#0a0c14]/30">
              <div className="space-y-3.5">
                <div className="flex justify-between items-start">
                  <h4 className="font-sans text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {hack.title.replace(/_/g, ' ')}
                  </h4>
                  <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg shrink-0">
                    <Trophy size={14} className="group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                {/* Completely readable description with no clamps */}
                <p className="font-sans text-xs text-neutral-400 leading-relaxed overflow-y-auto max-h-[110px] scrollbar-thin pr-1">
                  {hack.description}
                </p>
              </div>

              {/* Footer Location & Tags */}
              <div className="border-t border-neutral-800/50 pt-3 mt-4 space-y-2.5">
                <div className="flex flex-wrap gap-1">
                  {hack.tags.map((t) => (
                    <span key={t} className="font-sans text-[9px] text-neutral-400 bg-neutral-950 border border-neutral-800/40 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 font-sans text-[10px] text-neutral-500">
                  <MapPin size={10} className="text-neutral-500 shrink-0" />
                  <span>{hack.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
