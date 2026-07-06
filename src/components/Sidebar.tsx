import React from 'react';
import { Terminal, Database, Cpu, ShieldAlert, Globe, Award, GraduationCap } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onEducationClick: () => void;
  onResumeClick: () => void;
  onDeployClick: () => void;
}

export default function Sidebar({
  activeSection,
  onSectionChange,
  onEducationClick,
  onResumeClick,
  onDeployClick,
}: SidebarProps) {
  const { profile, sections } = usePortfolio();

  const sidebarItems = [
    { id: 'home', label: sections.home.toUpperCase(), icon: Cpu },
    { id: 'technologies', label: sections.technologies.toUpperCase(), icon: Terminal },
    { id: 'projects', label: sections.projects.toUpperCase(), icon: Cpu },
    { id: 'experience', label: sections.experience.toUpperCase(), icon: ShieldAlert },
    { id: 'hackathons', label: sections.hackathons.toUpperCase(), icon: Database },
    { id: 'certifications', label: sections.certifications.toUpperCase(), icon: Award },
    { id: 'education', label: sections.education.toUpperCase(), icon: GraduationCap },
    { id: 'connect', label: sections.connect.toUpperCase(), icon: Globe },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-52 bg-[#090a10]/85 border-r border-neutral-800/60 backdrop-blur-md z-40 px-4 py-6 flex flex-col justify-between select-none font-sans text-xs text-neutral-400">
      {/* Upper Brand Section */}
      <div className="space-y-6">
        <div className="pt-4 border-b border-neutral-800/50 pb-5">
          <h2 className="text-lg font-extrabold tracking-[0.15em] text-white uppercase">
            {profile.name}
          </h2>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-sky-400 font-medium">
            <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
            {profile.designation}
          </div>
        </div>

        {/* Navigation Sidebar List */}
        <nav className="space-y-1 pt-1 h-[65vh] overflow-y-auto scrollbar-thin pr-1">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold px-2 mb-2">
            Index
          </div>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 transition-all duration-300 relative text-left rounded-lg ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-sky-400' : 'text-neutral-500'} />
                <span className="tracking-wide text-[11px] font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-sky-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

