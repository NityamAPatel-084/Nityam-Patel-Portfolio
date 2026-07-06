import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { X, ExternalLink, Github, Terminal, Cpu, Play, Award, CheckCircle } from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'terminal' | 'diagnostics'>('overview');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (!project) return;
    setTerminalLogs([
      `System initialized for project: ${project.title}`,
      `Allocating layout nodes and responsive styles...`,
      `Resolving external module libraries... [OK]`,
      `Identifier ${project.serial} loaded successfully.`,
      `Release status verified.`
    ]);
  }, [project]);

  if (!project) return null;

  // Run dynamic testing sandbox log simulations
  const runDiagnostics = () => {
    if (isTesting) return;
    setIsTesting(true);
    const newLogs = [...terminalLogs, `>> Initializing build suite validation...`];
    setTerminalLogs(newLogs);

    setTimeout(() => {
      setTerminalLogs(prev => [...prev, `[TEST 1/3] Verifying responsive layout flow...`]);
    }, 600);
    setTimeout(() => {
      setTerminalLogs(prev => [...prev, `[TEST 2/3] Evaluating layout paint cycles: ${Math.floor(Math.random() * 8) + 2}ms`]);
    }, 1200);
    setTimeout(() => {
      setTerminalLogs(prev => [...prev, `[TEST 3/3] Bundle size check: Completed 100%`]);
    }, 1800);
    setTimeout(() => {
      setTerminalLogs(prev => [...prev, `>> Compilation successful. Project builds cleanly.`, `-----------------------------------------`]);
      setIsTesting(false);
    }, 2400);
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#090a0f]/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3 }}
        className="relative bg-[#111827]/95 border border-neutral-800 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Top Header Controls */}
        <div className="p-4 md:p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/40">
          <div className="flex items-center gap-3">
            <Cpu className="text-sky-400" size={18} />
            <span className="font-sans text-xs font-semibold text-neutral-300">
              Technical Details // {project.serial}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all rounded-full"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-8">
          {/* Main Display: Banner & Large Title */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-8 space-y-4">
              <span className="inline-block font-sans text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                {formatStatus(project.status)}
              </span>
              <h1 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-white leading-none">
                {project.title.replace(/_/g, ' ')}
              </h1>
              <p className="font-sans text-xs text-neutral-400">
                Client: {project.client || 'Internal Project'} &bull; Year: {project.year}
              </p>
            </div>

            {/* Sub Nav Tabs */}
            <div className="md:col-span-4 flex md:flex-col gap-1 bg-neutral-950 p-1 border border-neutral-850 rounded-lg">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'diagnostics', label: 'Performance Specs' },
                { id: 'terminal', label: 'Interactive Logs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full py-2 px-3 font-sans text-xs text-left rounded transition-all ${
                    activeTab === tab.id
                      ? 'bg-sky-500/10 text-sky-400 font-semibold border-l-2 border-sky-400'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Panes */}
          <div className="border-t border-neutral-800/60 pt-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Description Column */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-sans text-xs font-bold tracking-wider text-neutral-400 uppercase">
                    Description &amp; Architecture
                  </h3>
                  <p className="font-sans text-sm text-neutral-300 leading-relaxed">
                    {project.details || project.description}
                  </p>
                  <div className="pt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 font-sans text-[10px] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specs/Meta Column */}
                <div className="bg-neutral-950/40 p-5 border border-neutral-850 rounded-lg space-y-4">
                  <h3 className="font-sans text-xs font-bold tracking-wider text-neutral-400 uppercase">
                    Technical Specs
                  </h3>
                  <div className="space-y-3 font-sans text-xs text-neutral-400">
                    <div className="flex justify-between border-b border-neutral-850 pb-2">
                      <span className="text-neutral-500">Category</span>
                      <span className="text-white uppercase font-semibold">{project.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-850 pb-2">
                      <span className="text-neutral-500">Identifier</span>
                      <span className="text-sky-400 font-mono text-[10px]">{project.serial}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-850 pb-2">
                      <span className="text-neutral-500">Build Stack</span>
                      <span>Vite / React 19</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-neutral-500">Deployed</span>
                      <span className="text-emerald-400 font-semibold">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'diagnostics' && (
              <div className="space-y-5">
                <h3 className="font-sans text-xs font-bold tracking-wider text-neutral-400 uppercase">
                  Real-time Performance Metrics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-neutral-950 p-4 border border-neutral-850 rounded-lg space-y-1">
                    <div className="font-sans text-[10px] text-neutral-500 uppercase tracking-wider">Render Latency</div>
                    <div className="font-sans text-lg font-bold text-sky-400">&lt; 15 ms</div>
                    <div className="font-sans text-[11px] text-neutral-500 leading-snug">Average frame layout paint latency.</div>
                  </div>
                  <div className="bg-neutral-950 p-4 border border-neutral-850 rounded-lg space-y-1">
                    <div className="font-sans text-[10px] text-neutral-500 uppercase tracking-wider">Optimization</div>
                    <div className="font-sans text-lg font-bold text-indigo-400">Code Split</div>
                    <div className="font-sans text-[11px] text-neutral-500 leading-snug">Bundles split dynamically per component.</div>
                  </div>
                  <div className="bg-neutral-950 p-4 border border-neutral-850 rounded-lg space-y-1">
                    <div className="font-sans text-[10px] text-neutral-500 uppercase tracking-wider">Lighthouse Score</div>
                    <div className="font-sans text-lg font-bold text-emerald-400">99.8%</div>
                    <div className="font-sans text-[11px] text-neutral-500 leading-snug">Consistent rendering layout delivery efficiency.</div>
                  </div>
                </div>

                <div className="bg-neutral-900/35 p-4 border border-neutral-800/80 flex items-center justify-between rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-emerald-400 shrink-0" size={18} />
                    <span className="font-sans text-xs text-neutral-300">
                      The technical architecture for <strong>{project.title.replace(/_/g, ' ')}</strong> adheres strictly to modern high-performance responsive web standards.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'terminal' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-sans text-xs font-bold tracking-wider text-neutral-400 uppercase">
                    Build Console logs
                  </h3>
                  <button
                    onClick={runDiagnostics}
                    disabled={isTesting}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/40 font-sans text-xs font-semibold rounded-lg transition-all"
                  >
                    <Play size={10} className={isTesting ? 'animate-spin' : ''} />
                    <span>{isTesting ? 'Compiling...' : 'Run Compilation Test'}</span>
                  </button>
                </div>

                <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-lg h-[200px] overflow-y-auto font-mono text-[11px] text-sky-400 space-y-1.5 scrollbar-thin">
                  {terminalLogs.map((log, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-neutral-700 select-none">[{index + 1}]</span>
                      <span className={log.startsWith('[') ? 'text-emerald-400' : log.startsWith('>>') ? 'text-amber-400' : ''}>
                        {log}
                  </span>
                </div>
              ))}
              <div className="w-1.5 h-3 bg-sky-400 inline-block animate-pulse ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Footer Actions */}
    <div className="p-4 md:p-6 border-t border-neutral-800 bg-neutral-900/40 flex flex-wrap justify-between gap-3 rounded-b-xl">
      <button
        onClick={onClose}
        className="font-sans text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
      >
        Close View
      </button>

      <div className="flex gap-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-750 text-neutral-300 hover:text-white transition-all font-sans text-xs font-semibold rounded-lg"
        >
          <Github size={13} />
          <span>View Code</span>
        </a>
        <a
          href="https://activetheory.net"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-sky-500/15 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 hover:border-sky-500/40 transition-all font-sans text-xs font-semibold rounded-lg"
        >
          <ExternalLink size={13} />
          <span>Live Website</span>
        </a>
      </div>
    </div>
  </motion.div>
</div>
  );
}
