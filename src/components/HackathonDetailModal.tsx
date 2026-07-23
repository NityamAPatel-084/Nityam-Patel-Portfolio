import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Hackathon } from '../types';
import { X, Trophy, Award, MapPin, Tag, Play, CheckCircle, Download } from 'lucide-react';
import { useResolvedUrl } from '../hooks/useResolvedUrl';

interface HackathonDetailModalProps {
  hackathon: Hackathon | null;
  onClose: () => void;
}

function HackathonDetailMedia({ hackathon }: { hackathon: Hackathon }) {
  const winUrl = hackathon.winningCertUrl;
  const partUrl = hackathon.participationCertUrl;
  const certUrl = winUrl || partUrl;
  const resolvedUrl = useResolvedUrl(certUrl);

  if (resolvedUrl) {
    const isPdf = certUrl ? (
      certUrl.startsWith('data:application/pdf') || 
      certUrl.endsWith('.pdf') || 
      (resolvedUrl.startsWith('blob:') && certUrl.includes('application/pdf'))
    ) : false;

    if (isPdf) {
      return (
        <div className="w-full h-[320px] bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden relative">
          <iframe 
            src={resolvedUrl}
            className="w-full h-full border-none bg-white"
            style={{ backgroundColor: '#ffffff' }}
            title={hackathon.title}
          />
        </div>
      );
    } else {
      return (
        <div className="w-full h-[320px] bg-[#090b11] border border-neutral-800 rounded-lg overflow-hidden flex items-center justify-center p-2 relative">
          <img 
            src={resolvedUrl} 
            alt={hackathon.title} 
            className="max-w-full max-h-full object-contain rounded" 
          />
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-indigo-400 bg-black/75 px-2 py-0.5 border border-indigo-800/40 rounded">
            CERTIFICATE // MOUNTED
          </div>
        </div>
      );
    }
  }

  // Fallback: decorative placeholder
  return (
    <div className="w-full h-[320px] bg-[#090b11] border border-neutral-800 rounded-lg overflow-hidden relative flex items-center justify-center">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] bg-[size:12px_12px]" />
      <Trophy className="text-indigo-400/30" size={48} />
      <div className="absolute bottom-3 left-3 font-mono text-[9px] text-indigo-400/60 bg-black/75 px-2 py-0.5 border border-indigo-800/40 rounded">
        NO CERTIFICATE UPLOADED
      </div>
    </div>
  );
}

function CertificateViewer({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const resolvedUrl = useResolvedUrl(url);
  const isPdf = url.startsWith('data:application/pdf') || 
                url.endsWith('.pdf') || 
                (resolvedUrl.startsWith('blob:') && url.includes('application/pdf'));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#0b0d16] border border-neutral-800 rounded-xl p-5 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3.5 border-b border-neutral-800 mb-5">
          <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider">{title}</h4>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors text-xs font-semibold px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center gap-1 cursor-pointer"
          >
            <X size={12} />
            <span>Close</span>
          </button>
        </div>
        <div className="flex-grow overflow-auto flex items-center justify-center bg-black/40 rounded-xl p-3 min-h-[320px]">
          {isPdf ? (
            <iframe 
              src={resolvedUrl} 
              className="w-full h-[62vh] rounded-lg border border-neutral-800 bg-white" 
              style={{ backgroundColor: '#ffffff' }}
              title={title}
            />
          ) : (
            <img 
              src={resolvedUrl} 
              className="max-w-full max-h-[62vh] object-contain rounded-lg shadow-lg" 
              alt={title} 
            />
          )}
        </div>
        {url && (
          <div className="mt-5 pt-3.5 border-t border-neutral-800 flex justify-end gap-3 font-sans">
            <a 
              href={resolvedUrl} 
              download={`${title}_certificate`}
              className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
            >
              <Download size={12} />
              <span>Download File</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HackathonDetailModal({ hackathon, onClose }: HackathonDetailModalProps) {
  const [viewingCert, setViewingCert] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewingCert) {
          setViewingCert(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, viewingCert]);

  if (!hackathon) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#090a0f]/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3 }}
        className="relative bg-[#111827]/95 border border-neutral-800 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Top Header */}
        <div className="p-4 md:p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/40">
          <div className="flex items-center gap-3">
            <Trophy className="text-indigo-400" size={18} />
            <span className="font-sans text-xs font-semibold text-neutral-300">
              Hackathon Details // {hackathon.id.toUpperCase()}
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
          {/* Title and Placement */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-8 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-block font-sans text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                  {hackathon.position.replace(/_/g, ' ')}
                </span>
                <span className="inline-block font-sans text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 px-2.5 py-0.5 rounded-full font-semibold tracking-wider">
                  {hackathon.year}
                </span>
              </div>
              <h1 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-white leading-none">
                {hackathon.title.replace(/_/g, ' ')}
              </h1>
              <div className="flex items-center gap-1.5 font-sans text-xs text-neutral-400">
                <MapPin size={12} className="text-neutral-500 shrink-0" />
                <span>{hackathon.location}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="md:col-span-4 bg-neutral-950/40 p-5 border border-neutral-850 rounded-lg space-y-4">
              <h3 className="font-sans text-xs font-bold tracking-wider text-neutral-400 uppercase">
                Event Details
              </h3>
              <div className="space-y-3 font-sans text-xs text-neutral-400">
                <div className="flex justify-between border-b border-neutral-850 pb-2">
                  <span className="text-neutral-500">Placement</span>
                  <span className="text-indigo-400 font-semibold uppercase">{hackathon.position.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-850 pb-2">
                  <span className="text-neutral-500">Year</span>
                  <span className="text-white font-semibold">{hackathon.year}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-850 pb-2">
                  <span className="text-neutral-500">Location</span>
                  <span className="text-white">{hackathon.location}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-neutral-500">Certificates</span>
                  <span className="text-emerald-400 font-semibold">
                    {[hackathon.winningCertUrl, hackathon.participationCertUrl].filter(Boolean).length} Uploaded
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Media Preview */}
          <div className="border-t border-neutral-800/60 pt-6 space-y-6">
            <HackathonDetailMedia hackathon={hackathon} />

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-sans text-xs font-bold tracking-wider text-neutral-400 uppercase">
                  Description &amp; Overview
                </h3>
                <p className="font-sans text-sm text-neutral-300 leading-relaxed">
                  {hackathon.description}
                </p>
                <div className="pt-4 flex flex-wrap gap-2">
                  {hackathon.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 font-sans text-[10px] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certificates Column */}
              <div className="bg-neutral-950/40 p-5 border border-neutral-850 rounded-lg space-y-4">
                <h3 className="font-sans text-xs font-bold tracking-wider text-neutral-400 uppercase">
                  Certificates
                </h3>
                <div className="space-y-3">
                  {hackathon.winningCertUrl && (
                    <button
                      onClick={() => setViewingCert({ url: hackathon.winningCertUrl!, title: `${hackathon.title.replace(/_/g, ' ')} - Winning Certificate` })}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/15 hover:border-amber-500/40 font-sans text-xs font-semibold rounded-lg transition-all cursor-pointer"
                    >
                      <Trophy size={14} />
                      <span>View Winning Certificate</span>
                    </button>
                  )}
                  {hackathon.participationCertUrl && (
                    <button
                      onClick={() => setViewingCert({ url: hackathon.participationCertUrl!, title: `${hackathon.title.replace(/_/g, ' ')} - Participation Certificate` })}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/15 hover:border-sky-500/40 font-sans text-xs font-semibold rounded-lg transition-all cursor-pointer"
                    >
                      <Award size={14} />
                      <span>View Participation Certificate</span>
                    </button>
                  )}
                  {!hackathon.winningCertUrl && !hackathon.participationCertUrl && (
                    <p className="font-sans text-[11px] text-neutral-500 italic">
                      No certificates uploaded for this event.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Verification status */}
          <div className="bg-neutral-900/35 p-4 border border-neutral-800/80 flex items-center justify-between rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-emerald-400 shrink-0" size={18} />
              <span className="font-sans text-xs text-neutral-300">
                Hackathon placement record for <strong>{hackathon.title.replace(/_/g, ' ')}</strong> has been verified and logged in the portfolio system.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-neutral-800 bg-neutral-900/40 flex flex-wrap justify-between gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="font-sans text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            Close View
          </button>
          <div className="font-mono text-[10px] text-neutral-600 flex items-center gap-1.5">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-400 text-[9px]">ESC</kbd>
            <span>to close</span>
          </div>
        </div>
      </motion.div>

      {/* Inner Certificate Viewer */}
      {viewingCert && (
        <CertificateViewer 
          url={viewingCert.url} 
          title={viewingCert.title} 
          onClose={() => setViewingCert(null)} 
        />
      )}
    </div>
  );
}
