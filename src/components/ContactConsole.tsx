import React, { useState, useEffect } from 'react';
import { Terminal, Send, ShieldCheck, Mail, User, BookOpen, MessageSquare, AlertTriangle, Github, Linkedin, Twitter, Youtube, Instagram, Twitch, Facebook, Globe, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';

interface ChatMessage {
  sender: 'user' | 'system';
  text: string;
  time: string;
}

export default function ContactConsole() {
  const { adminPassword, adminCodeword, setAdminAuthorized, setShowAdmin, socials, profile, showAdmin } = usePortfolio();

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

  // Form state
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [formLogs, setFormLogs] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Chat terminal state
  const [query, setQuery] = useState('');
  const [waitingForPasscode, setWaitingForPasscode] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { sender: 'system', text: "Welcome! I am Nityam Patel's automated virtual assistant. How can I help you today?", time: 'ASSISTANT' },
    { sender: 'system', text: "Feel free to ask about my skills, projects, certifications, or experience, or use the message form on the right to send an email.", time: 'ASSISTANT' }
  ]);

  // Clear sensitive login messages and reset interactive session upon Admin Dashboard access
  useEffect(() => {
    if (showAdmin) {
      setChatHistory([
        { sender: 'system', text: "Welcome! I am Nityam Patel's automated virtual assistant. How can I help you today?", time: 'ASSISTANT' },
        { sender: 'system', text: "Feel free to ask about my skills, projects, certifications, or experience, or use the message form on the right to send an email.", time: 'ASSISTANT' }
      ]);
      setWaitingForPasscode(false);
      setQuery('');
    }
  }, [showAdmin]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitTransmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setFormLogs(['[ERROR] All fields must be filled out before sending.', ...formLogs]);
      return;
    }

    setIsSending(true);
    setFormLogs([
      `Initiating message transmission...`,
      `Connecting to server...`,
      `Sending payload...`,
      ...formLogs
    ]);

    setTimeout(() => {
      setFormLogs(prev => [
        `[SUCCESS] Message sent successfully to Nityam Patel.`,
        `Thank you! I will reply to your email address shortly.`,
        ...prev
      ]);
      setIsSending(false);
      setIsSent(true);
      setForm({ name: '', email: '', message: '' });
    }, 1800);
  };

  // Chat/Query Terminal submission
  const submitChatQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query.trim();
    const timeStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newHistory = [...chatHistory, { sender: 'user', text: userMsg, time: timeStamp }];
    setChatHistory(newHistory);
    setQuery('');

    // Simulated Response mapping based on queries
    setTimeout(() => {
      let replyText = "";

      if (waitingForPasscode) {
        if (userMsg === adminPassword) {
          replyText = "[SYSTEM] Passcode verified. Secure session established. Launching Admin Dashboard...";
          setAdminAuthorized(true);
          setShowAdmin(true);
        } else {
          replyText = "[SYSTEM] ERROR: Invalid Passcode. Authentication failed. Session terminated.";
        }
        setWaitingForPasscode(false);
      } else if (userMsg === adminCodeword) {
        replyText = "[SYSTEM] Authenticating secure admin session... Enter Passcode:";
        setWaitingForPasscode(true);
      } else {
        replyText = "I couldn't find an exact match for that. Try asking about 'projects', 'experience', 'certifications', 'resume', or 'skills'.";
        const q = userMsg.toLowerCase();

        if (q.includes('project') || q.includes('work') || q.includes('websites')) {
          replyText = "Nityam has developed 8+ advanced visual installations and high-performance React architectures, including 'Neural Synapse Core' and 'Quantum Flow Viz'. Select 'Projects' in the index to learn more!";
        } else if (q.includes('skill') || q.includes('tech') || q.includes('code')) {
          replyText = "Nityam is highly proficient in TypeScript, React, WebGL/Three.js, custom GLSL shader scripting, and backend development with Rust and Go.";
        } else if (q.includes('experience') || q.includes('job') || q.includes('career')) {
          replyText = "Nityam is currently working as a Lead Creative Technologist at Cognitive Labs, engineering highly interactive digital interfaces and immersive layout solutions.";
        } else if (q.includes('cert') || q.includes('certifications') || q.includes('degree')) {
          replyText = "Nityam holds industry-verified credentials in Advanced Web VFX, Deep Learning (Stanford), and Systems Engineering in Rust & WASM. Select 'Certifications' to view details.";
        } else if (q.includes('resume') || q.includes('pdf')) {
          replyText = "To review Nityam's full physical resume, please click the 'Download Resume' button in the resources section on the sidebar.";
        } else if (q.includes('hello') || q.includes('hi ') || q.includes('hey')) {
          replyText = "Hello! I am Nityam's automated portfolio assistant. How can I help you learn more about Nityam's experience and engineering capabilities?";
        }
      }

      setChatHistory(prev => [...prev, { sender: 'system', text: replyText, time: 'ASSISTANT' }]);
    }, 700);
  };


  return (
    <div className="space-y-8 select-none">
      <div>
        <h3 className="font-sans text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
            Connect
          </span>
        </h3>
        <p className="font-sans text-xs text-neutral-400 mt-1">
          Send a direct message or ask my virtual assistant about my engineering background
        </p>
      </div>

      {/* 3 Contact Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
        {/* Email Card */}
        <div className="bg-[#111827]/30 hover:bg-[#111827]/50 border border-neutral-800/80 p-4 rounded-xl flex flex-col items-center text-center transition-all duration-300">
          <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-full mb-2">
            <Mail size={16} />
          </div>
          <span className="font-sans text-[11px] font-bold text-white tracking-wide block">Email</span>
          <a href={`mailto:${profile.email || 'umangpatel2415@gmail.com'}`} className="font-sans text-[11px] text-neutral-400 hover:text-sky-400 mt-1 transition-colors font-medium break-all">
            {profile.email || 'umangpatel2415@gmail.com'}
          </a>
        </div>

        {/* Phone Card */}
        <div className="bg-[#111827]/30 hover:bg-[#111827]/50 border border-neutral-800/80 p-4 rounded-xl flex flex-col items-center text-center transition-all duration-300">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full mb-2">
            <Phone size={16} />
          </div>
          <span className="font-sans text-[11px] font-bold text-white tracking-wide block">Phone</span>
          <a href={`tel:${profile.phone || '+917574885744'}`} className="font-sans text-[11px] text-neutral-400 hover:text-indigo-400 mt-1 transition-colors font-medium">
            {profile.phone || '+91 7574885744'}
          </a>
        </div>

        {/* Location Card */}
        <div className="bg-[#111827]/30 hover:bg-[#111827]/50 border border-neutral-800/80 p-4 rounded-xl flex flex-col items-center text-center transition-all duration-300">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full mb-2">
            <MapPin size={16} />
          </div>
          <span className="font-sans text-[11px] font-bold text-white tracking-wide block">Location</span>
          <span className="font-sans text-[11px] text-neutral-400 mt-1 font-medium">
            {profile.location || 'Vadodara, Gujarat, India'}
          </span>
        </div>
      </div>

      {socials.length > 0 && (
        <div className="bg-[#111827]/30 border border-neutral-800/60 clip-corner p-4 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="text-center sm:text-left">
            <span className="font-mono text-[10px] tracking-wider text-sky-400 font-semibold uppercase block">
              // CONNECTIVITY PORTS
            </span>
            <span className="font-sans text-[11px] text-neutral-400">
              Access external profiles, developer channels, and dynamic social grids
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5 items-center justify-center">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 border border-neutral-800/80 hover:border-sky-500/30 text-neutral-400 hover:text-white rounded-lg text-xs transition-all duration-300"
                title={social.platform}
              >
                {getSocialIcon(social.platform)}
                <span className="font-sans font-medium">{social.platform}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Terminal Chat Bot Inquiries (Left) */}
        <div className="lg:col-span-5 bg-[#111827]/40 border border-neutral-800/80 clip-corner p-5 flex flex-col justify-between h-[390px] backdrop-blur-md relative">
          <div className="space-y-3 flex-grow flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-neutral-800/60 pb-2.5">
              <span className="font-sans text-xs text-sky-400 tracking-wide font-semibold flex items-center gap-1.5">
                <Terminal size={14} />
                Interactive Assistant
              </span>
              <span className="font-sans text-[11px] text-neutral-500">
                AI Agent Active
              </span>
            </div>

            {/* Chat list */}
            <div className="flex-grow overflow-y-auto space-y-3.5 pr-2 h-[220px] scrollbar-thin font-sans text-xs">
              <AnimatePresence initial={false}>
                {chatHistory.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 text-[9px] text-neutral-500 font-mono">
                      <span>[{msg.time}]</span>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[85%] border leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-sky-500/10 border-sky-500/25 text-sky-400 font-medium'
                          : 'bg-neutral-900/40 border-neutral-800/80 text-neutral-300'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Chat input */}
          <form onSubmit={submitChatQuery} className="pt-3 border-t border-neutral-800/65 mt-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400 font-sans text-xs font-semibold">
                $
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask assistant... (e.g. projects, skills, certifications)"
                className="w-full pl-7 pr-12 py-2.5 bg-neutral-900/60 border border-neutral-800/85 focus:border-sky-500/35 focus:outline-none font-sans text-xs text-sky-400 placeholder-neutral-500 rounded-lg"
              />
              <button
                type="submit"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-sky-400 transition-colors"
              >
                <Send size={12} />
              </button>
            </div>
          </form>
        </div>

        {/* Secure Message Transmission (Right) */}
        <div className="lg:col-span-7 bg-[#111827]/40 border border-neutral-800/80 clip-corner p-5 flex flex-col justify-between h-[450px] backdrop-blur-md">
          <form onSubmit={submitTransmission} className="space-y-4 flex-grow flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-neutral-800/60 pb-2.5">
              <span className="font-sans text-xs text-emerald-400 tracking-wide font-semibold flex items-center gap-1.5">
                <ShieldCheck size={14} />
                Send Message
              </span>
              <span className="font-sans text-[11px] text-neutral-500">
                SSL Secured Gateway
              </span>
            </div>

            {/* Inputs */}
            <div className="space-y-3.5 flex-grow py-3">
              <div className="relative">
                <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Your Name"
                  required
                  disabled={isSending || isSent}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/40 border-b border-neutral-850 focus:border-emerald-500/35 focus:outline-none font-sans text-xs text-white placeholder-neutral-500"
                />
              </div>

              <div className="relative">
                <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="Your Email Address"
                  required
                  disabled={isSending || isSent}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/40 border-b border-neutral-850 focus:border-emerald-500/35 focus:outline-none font-sans text-xs text-white placeholder-neutral-500"
                />
              </div>

              <div className="relative">
                <MessageSquare size={13} className="absolute left-3.5 top-4 text-neutral-500" />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleFormChange}
                  placeholder="Message Content"
                  rows={4}
                  required
                  disabled={isSending || isSent}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/40 border-b border-neutral-850 focus:border-emerald-500/35 focus:outline-none font-sans text-xs text-white placeholder-neutral-500 resize-none h-[110px]"
                />
              </div>
            </div>

            {/* Output feedback & submit */}
            <div className="space-y-3">
              {/* Feedback log console */}
              {formLogs.length > 0 && (
                <div className="bg-neutral-950/85 p-2.5 border border-neutral-850 h-[65px] overflow-y-auto font-mono text-[9px] text-[#10b981] space-y-0.5 rounded-lg scrollbar-thin">
                  {formLogs.map((log, index) => (
                    <div key={index}>{log}</div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={isSending || isSent}
                className="w-full group relative overflow-hidden bg-neutral-900 border border-neutral-800/80 py-2.5 font-sans text-xs font-semibold tracking-wide text-emerald-400 hover:text-white transition-all duration-300 rounded-lg shadow-sm hover:border-emerald-500/30 active:scale-98"
              >
                {/* Slide overlay bg on hover */}
                <span className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center justify-center gap-2">
                  <Send size={12} />
                  <span>{isSent ? 'Message Sent Successfully' : isSending ? 'Sending Message...' : 'Send Message'}</span>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
