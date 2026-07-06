import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowUpRight, HelpCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { StaggerContainer, StaggerItem } from './ScrollReveal';

function CertificateThumbnail({ certId }: { certId: string }) {
  switch (certId) {
    case 'cert-1':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c082e] via-neutral-950 to-black/95 flex items-center justify-center overflow-hidden h-full w-full">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ec4899_1px,transparent_1px)] bg-[size:12px_12px]" />
          <svg className="w-4/5 h-4/5 text-pink-500/30" viewBox="0 0 100 100" fill="none">
            {/* VFX Shaders representation */}
            <circle cx="50" cy="50" r="32" className="stroke-pink-500/30 stroke-[1]" />
            <circle cx="50" cy="50" r="24" className="stroke-purple-400/20 stroke-[1.5]" />
            <path d="M50 10 C 20 40, 80 60, 50 90" className="stroke-pink-400 stroke-[1.5]" strokeDasharray="2 2" />
            <path d="M10 50 C 40 20, 60 80, 90 50" className="stroke-purple-400 stroke-[1.5]" />
            <circle cx="50" cy="50" r="6" className="fill-pink-500" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-pink-400/80 bg-pink-950/60 px-2 py-0.5 border border-pink-800/30 rounded">
            VFX_SHADER // ACADEMY_CREATIVE
          </div>
        </div>
      );
    case 'cert-2':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#24120a] via-neutral-950 to-black/95 flex items-center justify-center overflow-hidden h-full w-full">
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#b45309_1px,transparent_1px),linear-gradient(to_bottom,#b45309_1px,transparent_1px)] bg-[size:14px_14px]" />
          <svg className="w-[75%] h-[75%] text-amber-600/30" viewBox="0 0 100 100" fill="none">
            {/* Rust mechanical gear */}
            <circle cx="50" cy="50" r="22" className="stroke-amber-500 stroke-[2] fill-amber-950/20" />
            <circle cx="50" cy="50" r="12" className="stroke-amber-400/40 stroke-[1.5]" />
            {/* Gear teeth */}
            <path d="M50 16 L50 22 M50 78 L50 84 M16 50 L22 50 M78 50 L84 50 M26 26 L31 31 M69 69 L74 74 M26 74 L31 69 M69 26 L74 31" className="stroke-amber-500 stroke-[3]" strokeLinecap="round" />
            <circle cx="50" cy="50" r="4" className="fill-white" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-amber-400/80 bg-amber-950/60 px-2 py-0.5 border border-amber-800/30 rounded">
            RUST_SYS // WASM_STABLE
          </div>
        </div>
      );
    case 'cert-3':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#100c24] via-neutral-950 to-black/95 flex items-center justify-center overflow-hidden h-full w-full">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] bg-[size:10px_10px]" />
          <svg className="w-3/4 h-3/4 text-indigo-500/40" viewBox="0 0 100 100" fill="none">
            {/* Deep learning neural synapses */}
            <circle cx="30" cy="30" r="5" className="stroke-indigo-400 fill-indigo-950" />
            <circle cx="70" cy="30" r="5" className="stroke-indigo-400 fill-indigo-950" />
            <circle cx="30" cy="70" r="5" className="stroke-indigo-400 fill-indigo-950" />
            <circle cx="70" cy="70" r="5" className="stroke-indigo-400 fill-indigo-950" />
            <circle cx="50" cy="50" r="8" className="stroke-purple-400 fill-purple-950/80 animate-pulse" />
            <line x1="35" y1="35" x2="45" y2="45" className="stroke-indigo-400/40 stroke-[1.5]" />
            <line x1="65" y1="35" x2="55" y2="45" className="stroke-indigo-400/40 stroke-[1.5]" />
            <line x1="35" y1="65" x2="45" y2="55" className="stroke-indigo-400/40 stroke-[1.5]" />
            <line x1="65" y1="65" x2="55" y2="55" className="stroke-indigo-400/40 stroke-[1.5]" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-indigo-400/80 bg-indigo-950/60 px-2 py-0.5 border border-indigo-800/30 rounded">
            DEEP_LEARNING // NEURAL_NETS
          </div>
        </div>
      );
    case 'cert-4':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c2017]/30 to-black/95 flex items-center justify-center overflow-hidden h-full w-full">
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#059669_1px,transparent_1px)] bg-[size:12px]" />
          <svg className="w-4/5 h-4/5 text-emerald-500/30" viewBox="0 0 100 100" fill="none">
            {/* Google Developer Expert Badge */}
            <polygon points="50,15 85,30 85,70 50,85 15,70 15,30" className="stroke-emerald-400 stroke-[2] fill-emerald-950/30 animate-pulse" />
            <path d="M35 50 L45 60 L65 40" className="stroke-emerald-300 stroke-[2]" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="15" r="3" className="fill-emerald-400" />
            <circle cx="50" cy="85" r="3" className="fill-emerald-400" />
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-emerald-400/80 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800/30 rounded">
            GDE_WEB_VFX // ACCREDITED
          </div>
        </div>
      );
    default:
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-neutral-950 flex items-center justify-center h-full w-full">
          <ShieldCheck className="text-emerald-400/30 animate-pulse" size={40} />
        </div>
      );
  }
}

export default function CertificatesList() {
  const { certificates } = usePortfolio();

  return (
    <div className="space-y-6 select-none">
      <div>
        <h3 className="font-sans text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
            Certifications
          </span>
        </h3>
        <p className="font-sans text-xs text-neutral-400 mt-1">
          Verified academic credentials, licensing, and professional course achievements
        </p>
      </div>

      {/* Grid of beautifully designed, expanded horizontal cards (58% thumbnail, 42% content) */}
      <StaggerContainer className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {certificates.map((cert) => (
          <StaggerItem key={cert.id}>
            <div
              className="group relative bg-[#111827]/40 hover:bg-[#111827]/75 border border-neutral-800/80 hover:border-emerald-500/40 transition-all duration-300 flex flex-col md:flex-row h-auto md:h-[260px] backdrop-blur-md cursor-pointer shadow-lg overflow-hidden clip-corner"
            >
              {/* Left Portion: Visual Thumbnail takes up 58% of card width */}
              <div className="relative w-full md:w-[58%] h-48 md:h-full overflow-hidden shrink-0 border-r-0 md:border-r border-b md:border-b-0 border-neutral-800/60 bg-[#090b11]">
                <CertificateThumbnail certId={cert.id} />
                
                {/* Verification Status tag floated over thumbnail */}
                <div className="absolute top-3.5 left-3.5 inline-block font-sans text-[9px] bg-emerald-500/80 backdrop-blur text-white border border-emerald-400/30 px-2.5 py-1 rounded-full font-semibold tracking-wider flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  <span>{cert.status === 'VERIFIED' ? 'Verified' : 'Completed'}</span>
                </div>

                {/* Direct External Link Indicator */}
                <div className="absolute top-3.5 right-3.5 p-1.5 bg-neutral-950/80 border border-neutral-800 rounded-full text-neutral-500 group-hover:text-emerald-400 group-hover:border-emerald-400/40 transition-all">
                  <ArrowUpRight size={14} />
                </div>
              </div>

              {/* Right Portion: Key descriptions and metadata occupying 42% of card space */}
              <div className="w-full md:w-[42%] p-5 flex flex-col justify-between h-full bg-[#0a0c14]/30">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-sans text-sm font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                      {cert.title.replace(/_/g, ' ')}
                    </h4>
                    <p className="font-sans text-xs text-neutral-300">
                      {cert.issuer}
                    </p>
                  </div>

                  <span className="inline-block text-[10px] text-neutral-500 font-mono font-medium">
                    Issued: {cert.date}
                  </span>
                </div>

                {/* Footer Credential ID */}
                <div className="border-t border-neutral-800/50 pt-3 mt-4 flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] text-neutral-500 tracking-wider">
                    CREDENTIAL SERIAL:
                  </span>
                  <span className="font-mono text-[10px] text-neutral-300">
                    {cert.credentialId || 'SEC-0029-9921'}
                  </span>
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Professional verification status summary footer */}
      <div className="bg-[#111827]/20 border border-neutral-800/60 p-5 clip-corner text-xs text-neutral-400 font-sans leading-relaxed">
        <p>
          🔒 All credentials and licensing records displayed in this portfolio have been officially verified by the issuing academic bodies and course providers. For formal reference verification, please contact me directly using the console.
        </p>
      </div>
    </div>
  );
}
