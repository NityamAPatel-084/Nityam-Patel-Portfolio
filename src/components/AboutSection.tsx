import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileDown, Terminal, Sparkles, Cpu, Shield, HelpCircle, Github, Linkedin, Twitter, Youtube, Instagram, Twitch, Facebook, Mail, Globe } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface AboutSectionProps {
  onResumeClick: () => void;
}

export default function AboutSection({ onResumeClick }: AboutSectionProps) {
  const { profile, socials } = usePortfolio();
  
  // Track mouse coordinates for interactive 3D Parallax Tilt effect
  const [coords, setCoords] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xVal = e.clientX - rect.left;
    const yVal = e.clientY - rect.top;
    
    // Normalize coordinates from -0.5 to 0.5
    const px = (xVal / width) - 0.5;
    const py = (yVal / height) - 0.5;
    
    setCoords({ x: px, y: py, active: true });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0, active: false });
  };

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase().trim();
    if (p.includes('github')) return <Github size={13} />;
    if (p.includes('linkedin')) return <Linkedin size={13} />;
    if (p.includes('twitter') || p === 'x') return <Twitter size={13} />;
    if (p.includes('youtube')) return <Youtube size={13} />;
    if (p.includes('instagram')) return <Instagram size={13} />;
    if (p.includes('twitch')) return <Twitch size={13} />;
    if (p.includes('facebook')) return <Facebook size={13} />;
    if (p.includes('mail') || p.includes('email')) return <Mail size={13} />;
    return <Globe size={13} />;
  };

  const isParallaxEnabled = profile.parallaxEnabled !== false;

  // Determine transform values for 3D illusion layers
  const cardRotateX = isParallaxEnabled && coords.active ? -coords.y * 22 : 0;
  const cardRotateY = isParallaxEnabled && coords.active ? coords.x * 22 : 0;
  
  // Backlight/Radial Gradient moves in the opposite direction for parallax depth
  const bgTranslateX = isParallaxEnabled && coords.active ? coords.x * -18 : 0;
  const bgTranslateY = isParallaxEnabled && coords.active ? coords.y * -18 : 0;
  
  // Front image moves slightly with the cursor to "pop out"
  const imgTranslateX = isParallaxEnabled && coords.active ? coords.x * 14 : 0;
  const imgTranslateY = isParallaxEnabled && coords.active ? coords.y * 14 : 0;

  const transitionStyle = isParallaxEnabled && coords.active 
    ? 'all 0.15s cubic-bezier(0.25, 1, 0.5, 1)' 
    : 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

  return (
    <div className="space-y-8 select-none">
      {/* Hero Welcome Unit */}
      <div className="relative overflow-hidden bg-[#111827]/30 border border-neutral-800/60 clip-corner p-6 md:p-8 backdrop-blur-md flex flex-col md:flex-row items-center gap-8">
        
        {/* Holographic Portrait Box with 3D Perspective Parent wrapper */}
        <div 
          className="relative shrink-0 w-60 h-60 md:w-72 md:h-72 cursor-pointer rounded-3xl"
          style={{ perspective: '1000px' }}
        >
          <div
            onMouseMove={isParallaxEnabled ? handleMouseMove : undefined}
            onMouseLeave={isParallaxEnabled ? handleMouseLeave : undefined}
            className="w-full h-full bg-[#06070a] rounded-3xl flex items-center justify-center group overflow-hidden shadow-[0_0_40px_rgba(56,189,248,0.1)] hover:shadow-[0_0_55px_rgba(56,189,248,0.2)]"
            style={{
              transform: `rotateX(${cardRotateX}deg) rotateY(${cardRotateY}deg) scale(${isParallaxEnabled && coords.active ? 1.02 : 1})`,
              transformStyle: 'preserve-3d',
              transition: transitionStyle,
            }}
          >
            {/* Layer 1: Dynamic pulsing backlight neutral cyber glow backdrop (moves in reverse) */}
            <div 
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.15)_0%,_rgba(15,23,42,0.4)_45%,_#090514_80%,_#030712_100%)] pointer-events-none z-0 scale-125" 
              style={{
                transform: `translate3d(${bgTranslateX}px, ${bgTranslateY}px, -20px)`,
                transition: transitionStyle,
              }}
            />
            
            {profile.avatarUrl ? (
              /* Layer 2: Interactive Subject Image */
              <div 
                className="relative w-full h-full z-10"
                style={{
                  transform: `translate3d(${imgTranslateX}px, ${imgTranslateY}px, 20px) scale(1.05)`,
                  transformStyle: 'preserve-3d',
                  transition: transitionStyle,
                }}
              >
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.name} 
                  className="w-full h-full object-cover rounded-3xl relative z-10"
                  referrerPolicy="no-referrer"
                />
                
                {/* Soft overlay halo vignette to blend the avatar borders with the container */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_60%,_rgba(3,7,18,0.6)_100%)] pointer-events-none z-20 rounded-3xl" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral-800/10 to-neutral-900/15 flex flex-col items-center justify-center p-3 text-center space-y-1.5 z-10">
                <Cpu size={32} className="text-sky-400 group-hover:rotate-45 transition-transform duration-500" />
                <span className="font-sans text-[10px] tracking-wider text-sky-400 font-semibold font-mono uppercase">COGNITIVE_NODE</span>
                <span className="font-sans text-[8px] text-neutral-500 font-mono">STATUS: ONLINE</span>
              </div>
            )}
          </div>
        </div>

        {/* Hero Copy */}
        <div className="space-y-3.5 flex-grow text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider font-mono uppercase">
            <Sparkles size={11} className="animate-pulse" />
            <span>Operational Uplink Established</span>
          </div>
          <div>
            <h1 className="font-sans text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none">
              {profile.name}
            </h1>
            <p className="font-sans text-xs text-sky-400 font-semibold tracking-widest uppercase mt-2.5 font-mono">
              // {profile.designation}
            </p>
          </div>
          <p className="font-sans text-xs md:text-sm text-neutral-300 leading-relaxed max-w-2xl font-normal">
            {profile.aboutMeText}
          </p>

          <div className="pt-3 flex flex-wrap justify-center md:justify-start items-center gap-4">
            <button
              onClick={onResumeClick}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/15 hover:border-emerald-500/55 transition-all duration-300 font-sans text-xs font-semibold rounded-lg shadow-sm active:scale-98 shrink-0"
            >
              <FileDown size={14} className="text-emerald-400" />
              <span>Download Resume</span>
            </button>

            {socials.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center pl-0 md:pl-4 border-l-0 md:border-l border-neutral-800">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#111827]/40 hover:bg-sky-500/10 border border-neutral-800 hover:border-sky-500/30 text-neutral-400 hover:text-white rounded-lg text-xs transition-all duration-300"
                    title={social.platform}
                  >
                    {getSocialIcon(social.platform)}
                    <span className="font-sans font-medium">{social.platform}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Core Professional Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111827]/40 border border-neutral-800/80 p-5 clip-corner-sm backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2.5 text-sky-400">
            <Terminal size={16} />
            <span className="font-mono text-[10px] tracking-wider font-semibold uppercase">01 / Creative Code</span>
          </div>
          <h3 className="font-sans text-sm font-bold text-white">Interactive Engineering</h3>
          <p className="font-sans text-xs text-neutral-400 leading-relaxed">
            Constructing rich mathematical interactive canvases, high-fidelity WebGL graphics layouts, and procedural fluid systems optimized for low-latency browser rendering.
          </p>
        </div>

        <div className="bg-[#111827]/40 border border-neutral-800/80 p-5 clip-corner-sm backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2.5 text-indigo-400">
            <Cpu size={16} />
            <span className="font-mono text-[10px] tracking-wider font-semibold uppercase">02 / Architecture</span>
          </div>
          <h3 className="font-sans text-sm font-bold text-white">Full-Stack Systems</h3>
          <p className="font-sans text-xs text-neutral-400 leading-relaxed">
            Developing backend microservices in Rust & Go, stream processing computing nodes, and scalable web infrastructures that prioritize memory safety and peak operational speed.
          </p>
        </div>

        <div className="bg-[#111827]/40 border border-neutral-800/80 p-5 clip-corner-sm backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <Shield size={16} />
            <span className="font-mono text-[10px] tracking-wider font-semibold uppercase">03 / Principles</span>
          </div>
          <h3 className="font-sans text-sm font-bold text-white">Pragmatic Execution</h3>
          <p className="font-sans text-xs text-neutral-400 leading-relaxed">
            Structuring modular code, precise performance metrics tracking, and responsive user experiences built upon durable foundations and optimized client states.
          </p>
        </div>
      </div>
    </div>
  );
}
