import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, Wifi, CheckCircle2, Server } from 'lucide-react';

interface DeployModalProps {
  onClose: () => void;
}

export default function DeployModal({ onClose }: DeployModalProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'compiling' | 'deploying' | 'complete'>('compiling');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    setLogs([
      'Initiating secure sandbox instance...',
      'Loading interactive project logs and portfolio metadata...'
    ]);

    const compileTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 45 && status === 'compiling') {
          setStatus('deploying');
          setLogs((l) => [
            ...l,
            'Visual engines compiling successfully.',
            'Synchronizing components over virtual virtual-DOM clusters...'
          ]);
        }
        if (prev >= 100) {
          clearInterval(compileTimer);
          setStatus('complete');
          setLogs((l) => [
            ...l,
            '[SUCCESS] Interactive sandbox loaded.',
            'All portfolio modules are online & stable.'
          ]);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 180);

    return () => clearInterval(compileTimer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#090a0f]/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#111827]/95 border border-neutral-800 rounded-xl max-w-md w-full p-6 space-y-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Cpu className="text-sky-400 animate-pulse" size={18} />
            <span className="font-sans text-xs font-semibold text-neutral-300">
              Interactive Sandbox Demo
            </span>
          </div>
          {status === 'complete' && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors rounded-full"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Dynamic loading states */}
        <div className="space-y-4 font-sans">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-medium">
            <span>
              {status === 'compiling' ? 'Initializing Virtual Machine...' : status === 'deploying' ? 'Mounting components...' : 'Sandbox Environment Stable'}
            </span>
            <span className={status === 'complete' ? 'text-emerald-400 font-semibold' : 'text-sky-400 font-semibold'}>
              {progress}%
            </span>
          </div>

          {/* Loading bar */}
          <div className="h-1.5 bg-neutral-900 rounded-full border border-neutral-800/40 overflow-hidden relative">
            <motion.div
              layout
              className={`h-full bg-gradient-to-r ${status === 'complete' ? 'from-emerald-500 to-sky-400' : 'from-sky-400 to-indigo-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Real-time feedback terminal logs */}
          <div className="bg-neutral-950 p-4 border border-neutral-850 h-[120px] overflow-y-auto font-mono text-[10px] text-sky-400/80 space-y-1 rounded-lg scrollbar-thin">
            {logs.map((l, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-neutral-700">[{index + 1}]</span>
                <span className={l.startsWith('[SUCCESS]') ? 'text-emerald-400 font-semibold' : ''}>
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info or close action */}
        <div className="space-y-3 pt-2">
          {status === 'complete' ? (
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/45 font-sans text-xs font-semibold tracking-wide rounded-lg transition-all"
            >
              Enter Sandbox
            </button>
          ) : (
            <div className="flex gap-2 items-center justify-center font-sans text-[11px] text-neutral-500 text-center animate-pulse">
              <Server size={11} className="text-neutral-500" />
              <span>Provisioning virtual container ports for sandbox runtime...</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
