import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, Save, Trash2, Plus, RefreshCw, Lock, 
  User, Cpu, Code, Award, Database, ShieldAlert, GraduationCap, FileText, Settings, Upload, Share2, Sparkles,
  Download
} from 'lucide-react';
import { usePortfolio, Profile, Sections } from '../context/PortfolioContext';
import { Project, Technology, Certificate, Hackathon, Experience, Education, SocialAccount } from '../types';
import { isFirebaseConfigured, saveResumeToFirestore } from '../lib/firebase';
import { sanitizePlainString, sanitizeHtmlContent } from '../lib/sanitize';
import { 
  downloadProjectsTemplate, parseProjectsExcel,
  downloadCertsTemplate, parseCertsExcel,
  downloadHacksTemplate, parseHacksExcel,
  downloadSkillsTemplate, parseSkillsExcel,
  downloadExperienceTemplate, parseExperienceExcel,
  downloadEducationTemplate, parseEducationExcel
} from '../lib/excelUtils';

interface AdminDashboardProps {
  onClose: () => void;
}

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const portfolio = usePortfolio();
  const [activeTab, setActiveTab] = useState<'profile' | 'socials' | 'projects' | 'skills' | 'certs' | 'hacks' | 'exps' | 'edus'>('profile');
  
  // Profile edit states
  const [profName, setProfName] = useState(portfolio.profile.name);
  const [profDesig, setProfDesig] = useState(portfolio.profile.designation);
  const [profAbout, setProfAbout] = useState(portfolio.profile.aboutMeText);
  const [profResume, setProfResume] = useState(portfolio.profile.resumeUrl);
  const [profAvatar, setProfAvatar] = useState(portfolio.profile.avatarUrl);
  const [profLocation, setProfLocation] = useState(portfolio.profile.location);
  const [profEmail, setProfEmail] = useState(portfolio.profile.email || '');
  const [profPhone, setProfPhone] = useState(portfolio.profile.phone || '');
  const [profParallax, setProfParallax] = useState(portfolio.profile.parallaxEnabled !== false);

  // Sections custom name states
  const [secHome, setSecHome] = useState(portfolio.sections.home);
  const [secTech, setSecTech] = useState(portfolio.sections.technologies);
  const [secProj, setSecProj] = useState(portfolio.sections.projects);
  const [secExp, setSecExp] = useState(portfolio.sections.experience);
  const [secHack, setSecHack] = useState(portfolio.sections.hackathons);
  const [secCert, setSecCert] = useState(portfolio.sections.certifications);
  const [secEdu, setSecEdu] = useState(portfolio.sections.education);
  const [secConn, setSecConn] = useState(portfolio.sections.connect);

  // Password state
  const [passOld, setPassOld] = useState('');
  const [passNew, setPassNew] = useState('');
  const [passConfirm, setPassConfirm] = useState('');

  // Codeword state
  const [codeOld, setCodeOld] = useState('');
  const [codeNew, setCodeNew] = useState('');

  // Item editing states
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for adding/editing items
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '', description: '', tags: [], year: '', status: 'ACTIVE_STATE',
    category: 'websites', serial: '', client: '', link: '', imageUrl: '', details: '', videoUrl: ''
  });

  const [techForm, setTechForm] = useState<Partial<Technology>>({
    name: '', category: 'Languages', proficiency: 90, status: 'MASTERED', metric: ''
  });

  const [certForm, setCertForm] = useState<Partial<Certificate>>({
    title: '', issuer: '', date: '', credentialId: '', credentialUrl: '', status: 'VERIFIED'
  });

  const [hackForm, setHackForm] = useState<Partial<Hackathon>>({
    title: '', position: '', year: '', description: '', tags: [], location: '',
    participationCertUrl: '', winningCertUrl: ''
  });

  const [expForm, setExpForm] = useState<Partial<Experience>>({
    role: '', company: '', period: '', description: '', bullets: [''], status: 'ACTIVE_UPLINK'
  });

  const [eduForm, setEduForm] = useState<Partial<Education>>({
    degree: '', institution: '', period: '', grade: '', details: ''
  });

  const [socialForm, setSocialForm] = useState<{ platform: string; url: string }>({
    platform: '', url: ''
  });

  // Success / error feedbacks
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const triggerFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Base64 file converter helper with built-in auto-compression and resizing for images
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldSetter: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size first for non-image files
    if (!file.type.startsWith('image/')) {
      // Allow up to 12 MB for resumes and general documents
      const MAX_DOC_SIZE = 12 * 1024 * 1024;
      if (file.size > MAX_DOC_SIZE) {
        triggerFeedback('Document size is too large. Resumes must be less than 12 MB.', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        fieldSetter(reader.result as string);
        triggerFeedback(`Uploaded document ready: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      };
      reader.onerror = () => {
        triggerFeedback('Failed to read document file.', 'error');
      };
      reader.readAsDataURL(file);
      return;
    }

    // It's an image. Let's see if the file is already under 600 KB.
    // If it is already under 600 KB, we do NOT downscale or compress it.
    // We can just load it directly to maintain 100% of the original quality!
    if (file.size <= 600 * 1024) {
      const reader = new FileReader();
      reader.onload = (event) => {
        fieldSetter(event.target?.result as string);
        triggerFeedback(`Image uploaded at original high resolution: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      };
      reader.onerror = () => {
        triggerFeedback('Failed to read image file.', 'error');
      };
      reader.readAsDataURL(file);
      return;
    }

    // If the image is over 600 KB, let's downscale and compress it intelligently so that it is "just under 1 MB".
    // 1 MB of binary is ~1,048,576 bytes. Encoded in Base64, that is ~1,398,101 characters.
    // Let's target a safe base64 string length of 850,000 characters (~630 KB binary) so it's "just under 1 MB" and doesn't trigger document write errors in Firebase.
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let currentQuality = 0.95;
        let currentMaxDim = 2048;
        let resultBase64 = '';

        // Iteratively find the sweet spot: maximum dimension and quality to keep the file "just less than 1 MB"
        while (currentMaxDim >= 512) {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > currentMaxDim || height > currentMaxDim) {
            if (width > height) {
              height = Math.round((height * currentMaxDim) / width);
              width = currentMaxDim;
            } else {
              width = Math.round((width * currentMaxDim) / height);
              height = currentMaxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Fill background white for jpeg export to avoid transparency/alpha issues
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            
            resultBase64 = canvas.toDataURL('image/jpeg', currentQuality);
          } else {
            break;
          }

          // If the output base64 string is under 850,000 characters (approx. 630 KB), we stop optimizing
          if (resultBase64.length < 850000) {
            break;
          }

          // If it is still too big, gradually reduce quality, then try smaller dimension
          if (currentQuality > 0.7) {
            currentQuality -= 0.05;
          } else {
            currentMaxDim -= 256;
            currentQuality = 0.92; // reset quality for smaller dimension
          }
        }

        if (resultBase64) {
          fieldSetter(resultBase64);
          triggerFeedback(`Image intelligently optimized: ${Math.round(resultBase64.length * 3 / 4 / 1024)} KB (under 1 MB limit)`);
        } else {
          // Fallback to original
          fieldSetter(event.target?.result as string);
          triggerFeedback(`Uploaded image: ${file.name}`);
        }
      };
      img.onerror = () => {
        fieldSetter(event.target?.result as string);
        triggerFeedback(`Uploaded image: ${file.name}`);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      triggerFeedback('Failed to read image file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Reset all defaults
  const handleResetAll = () => {
    if (window.confirm('Are you absolutely sure you want to reset all modifications to default factory state? All custom modifications will be purged.')) {
      portfolio.resetToDefault();
      // Reset component states
      setProfName(portfolio.profile.name);
      setProfDesig(portfolio.profile.designation);
      setProfAbout(portfolio.profile.aboutMeText);
      setProfResume(portfolio.profile.resumeUrl);
      setProfAvatar(portfolio.profile.avatarUrl);
      setProfLocation(portfolio.profile.location);
      setProfEmail(portfolio.profile.email || '');
      setProfPhone(portfolio.profile.phone || '');
      setProfParallax(portfolio.profile.parallaxEnabled !== false);
      setSecHome(portfolio.sections.home);
      setSecTech(portfolio.sections.technologies);
      setSecProj(portfolio.sections.projects);
      setSecExp(portfolio.sections.experience);
      setSecHack(portfolio.sections.hackathons);
      setSecCert(portfolio.sections.certifications);
      setSecEdu(portfolio.sections.education);
      setSecConn(portfolio.sections.connect);
      triggerFeedback('All data reverted to default successfully!');
    }
  };

  // Save General settings (Profile & Sections)
  const saveGeneralSettings = async () => {
    let finalResumeUrl = profResume;
    if (profResume && profResume.startsWith('data:') && profResume.length > 900000) {
      triggerFeedback('Large resume detected. Uplinking chunked resume payload...', 'success');
      const ok = await saveResumeToFirestore(profResume);
      if (ok) {
        finalResumeUrl = 'db_chunked:resume_data_payload';
      } else {
        triggerFeedback('Failed to upload chunked resume payload.', 'error');
        return;
      }
    }

    const updatedProfile: Profile = {
      ...portfolio.profile,
      name: sanitizePlainString(profName),
      designation: sanitizePlainString(profDesig),
      aboutMeText: sanitizeHtmlContent(profAbout),
      resumeUrl: finalResumeUrl,
      avatarUrl: profAvatar,
      location: sanitizePlainString(profLocation),
      email: sanitizePlainString(profEmail),
      phone: sanitizePlainString(profPhone),
      parallaxEnabled: profParallax
    };
    const updatedSections: Sections = {
      home: sanitizePlainString(secHome),
      technologies: sanitizePlainString(secTech),
      projects: sanitizePlainString(secProj),
      experience: sanitizePlainString(secExp),
      hackathons: sanitizePlainString(secHack),
      certifications: sanitizePlainString(secCert),
      education: sanitizePlainString(secEdu),
      connect: sanitizePlainString(secConn)
    };

    portfolio.setProfile(updatedProfile);
    portfolio.setSections(updatedSections);
    triggerFeedback('General profiles & section configurations updated successfully.');
  };

  // Save new Password
  const handlePasswordChange = () => {
    if (!passOld || !passNew) {
      triggerFeedback('Please fill out password credentials.', 'error');
      return;
    }
    if (passOld !== portfolio.adminPassword) {
      triggerFeedback('Incorrect active passcode credentials.', 'error');
      return;
    }
    if (passNew !== passConfirm) {
      triggerFeedback('New passcodes do not match confirmation.', 'error');
      return;
    }
    portfolio.setAdminPassword(passNew);
    setPassOld('');
    setPassNew('');
    setPassConfirm('');
    triggerFeedback('Admin security passcode updated successfully.');
  };

  // Save new Codeword
  const handleCodewordChange = () => {
    if (!codeOld || !codeNew) {
      triggerFeedback('Please fill out codeword credentials.', 'error');
      return;
    }
    if (codeOld !== portfolio.adminCodeword) {
      triggerFeedback('Incorrect active codeword credentials.', 'error');
      return;
    }
    portfolio.setAdminCodeword(codeNew);
    setCodeOld('');
    setCodeNew('');
    triggerFeedback('Admin access codeword updated successfully.');
  };

  // ================= PROJECTS HANDLERS =================
  const startEditProject = (proj: Project) => {
    setEditingId(proj.id);
    setProjectForm(proj);
  };

  const startAddProject = () => {
    setEditingId('new');
    setProjectForm({
      id: 'proj-' + Date.now(),
      title: '', description: '', tags: [], year: new Date().getFullYear().toString(),
      status: 'STABLE_REL', category: 'websites', serial: 'PROJ-' + Math.floor(Math.random() * 9000 + 1000),
      client: '', link: '', imageUrl: '', details: '', videoUrl: ''
    });
  };

  const saveProject = () => {
    if (!projectForm.title || !projectForm.description) {
      triggerFeedback('Title and Summary description are required.', 'error');
      return;
    }
    
    const sanitizedForm: Project = {
      id: projectForm.id || 'proj-' + Date.now(),
      title: sanitizePlainString(projectForm.title || ''),
      description: sanitizePlainString(projectForm.description || ''),
      tags: (projectForm.tags || []).map(t => sanitizePlainString(t)),
      year: sanitizePlainString(projectForm.year || ''),
      status: projectForm.status || 'ACTIVE_STATE',
      category: projectForm.category || 'websites',
      serial: sanitizePlainString(projectForm.serial || ''),
      client: sanitizePlainString(projectForm.client || ''),
      link: sanitizePlainString(projectForm.link || ''),
      imageUrl: projectForm.imageUrl || '',
      videoUrl: projectForm.videoUrl || '',
      details: sanitizeHtmlContent(projectForm.details || '')
    };

    let updated: Project[];
    if (editingId === 'new') {
      updated = [...portfolio.projects, sanitizedForm];
    } else {
      updated = portfolio.projects.map(p => p.id === editingId ? { ...p, ...sanitizedForm } as Project : p);
    }
    portfolio.setProjects(updated);
    setEditingId(null);
    triggerFeedback('Project record committed successfully.');
  };

  const deleteProject = (id: string) => {
    if (window.confirm('Delete project? This is irreversible.')) {
      portfolio.setProjects(portfolio.projects.filter(p => p.id !== id));
      triggerFeedback('Project deleted.');
    }
  };

  // ================= SKILLS HANDLERS =================
  const startEditSkill = (tech: Technology) => {
    setEditingId(tech.name);
    setTechForm(tech);
  };

  const startAddSkill = () => {
    setEditingId('new_skill');
    setTechForm({
      name: '', category: 'Languages', proficiency: 90, status: 'MASTERED', metric: ''
    });
  };

  const saveSkill = () => {
    if (!techForm.name) {
      triggerFeedback('Technology name is required.', 'error');
      return;
    }
    const sanitizedForm: Technology = {
      name: sanitizePlainString(techForm.name || ''),
      category: techForm.category || 'Languages',
      proficiency: Number(techForm.proficiency) || 90,
      status: techForm.status || 'MASTERED',
      metric: sanitizePlainString(techForm.metric || '')
    };
    let updated: Technology[];
    if (editingId === 'new_skill') {
      if (portfolio.technologies.some(t => t.name === sanitizedForm.name)) {
        triggerFeedback('A skill with this name already exists.', 'error');
        return;
      }
      updated = [...portfolio.technologies, sanitizedForm];
    } else {
      updated = portfolio.technologies.map(t => t.name === editingId ? sanitizedForm : t);
    }
    portfolio.setTechnologies(updated);
    setEditingId(null);
    triggerFeedback('Skill database record committed.');
  };

  const deleteSkill = (name: string) => {
    if (window.confirm(`Delete ${name} from your skills?`)) {
      portfolio.setTechnologies(portfolio.technologies.filter(t => t.name !== name));
      triggerFeedback('Skill removed.');
    }
  };

  // ================= CERTIFICATES HANDLERS =================
  const startEditCert = (cert: Certificate) => {
    setEditingId(cert.id);
    setCertForm(cert);
  };

  const startAddCert = () => {
    setEditingId('new_cert');
    setCertForm({
      id: 'cert-' + Date.now(),
      title: '', issuer: '', date: new Date().toISOString().split('T')[0],
      credentialId: '', status: 'VERIFIED'
    });
  };

  const saveCert = () => {
    if (!certForm.title || !certForm.issuer) {
      triggerFeedback('Title and issuer fields are required.', 'error');
      return;
    }
    const sanitizedForm: Certificate = {
      id: certForm.id || 'cert-' + Date.now(),
      title: sanitizePlainString(certForm.title || ''),
      issuer: sanitizePlainString(certForm.issuer || ''),
      date: sanitizePlainString(certForm.date || ''),
      credentialId: sanitizePlainString(certForm.credentialId || ''),
      credentialUrl: certForm.credentialUrl || '',
      status: certForm.status || 'VERIFIED'
    };
    let updated: Certificate[];
    if (editingId === 'new_cert') {
      updated = [...portfolio.certificates, sanitizedForm];
    } else {
      updated = portfolio.certificates.map(c => c.id === editingId ? sanitizedForm : c);
    }
    portfolio.setCertificates(updated);
    setEditingId(null);
    triggerFeedback('Certificate verification updated.');
  };

  const deleteCert = (id: string) => {
    if (window.confirm('Delete this certificate?')) {
      portfolio.setCertificates(portfolio.certificates.filter(c => c.id !== id));
      triggerFeedback('Certificate deleted.');
    }
  };

  // ================= HACKATHONS HANDLERS =================
  const startEditHack = (hack: Hackathon) => {
    setEditingId(hack.id);
    setHackForm(hack);
  };

  const startAddHack = () => {
    setEditingId('new_hack');
    setHackForm({
      id: 'hack-' + Date.now(),
      title: '', position: '', year: new Date().getFullYear().toString(),
      description: '', tags: [], location: ''
    });
  };

  const saveHack = () => {
    if (!hackForm.title || !hackForm.position) {
      triggerFeedback('Title and placement result are required.', 'error');
      return;
    }
    const sanitizedForm: Hackathon = {
      id: hackForm.id || 'hack-' + Date.now(),
      title: sanitizePlainString(hackForm.title || ''),
      position: sanitizePlainString(hackForm.position || ''),
      year: sanitizePlainString(hackForm.year || ''),
      description: sanitizePlainString(hackForm.description || ''),
      tags: (hackForm.tags || []).map(t => sanitizePlainString(t)),
      location: sanitizePlainString(hackForm.location || ''),
      participationCertUrl: hackForm.participationCertUrl || '',
      winningCertUrl: hackForm.winningCertUrl || ''
    };
    let updated: Hackathon[];
    if (editingId === 'new_hack') {
      updated = [...portfolio.hackathons, sanitizedForm];
    } else {
      updated = portfolio.hackathons.map(h => h.id === editingId ? sanitizedForm : h);
    }
    portfolio.setHackathons(updated);
    setEditingId(null);
    triggerFeedback('Hackathon placement log updated.');
  };

  const deleteHack = (id: string) => {
    if (window.confirm('Delete hackathon?')) {
      portfolio.setHackathons(portfolio.hackathons.filter(h => h.id !== id));
      triggerFeedback('Hackathon entry removed.');
    }
  };

  // ================= EXPERIENCES HANDLERS =================
  const startEditExp = (exp: Experience) => {
    setEditingId(exp.id);
    setExpForm(exp);
  };

  const startAddExp = () => {
    setEditingId('new_exp');
    setExpForm({
      id: 'exp-' + Date.now(),
      role: '', company: '', period: '', description: '',
      bullets: [''], status: 'ACTIVE_UPLINK'
    });
  };

  const saveExp = () => {
    if (!expForm.role || !expForm.company) {
      triggerFeedback('Role title and company are required.', 'error');
      return;
    }
    const sanitizedForm: Experience = {
      id: expForm.id || 'exp-' + Date.now(),
      role: sanitizePlainString(expForm.role || ''),
      company: sanitizePlainString(expForm.company || ''),
      period: sanitizePlainString(expForm.period || ''),
      description: sanitizePlainString(expForm.description || ''),
      bullets: (expForm.bullets || []).map(b => sanitizePlainString(b)),
      status: expForm.status || 'ACTIVE_UPLINK'
    };
    let updated: Experience[];
    if (editingId === 'new_exp') {
      updated = [...portfolio.experiences, sanitizedForm];
    } else {
      updated = portfolio.experiences.map(e => e.id === editingId ? sanitizedForm : e);
    }
    portfolio.setExperiences(updated);
    setEditingId(null);
    triggerFeedback('Experience node logged.');
  };

  const deleteExp = (id: string) => {
    if (window.confirm('Purge job experience record?')) {
      portfolio.setExperiences(portfolio.experiences.filter(e => e.id !== id));
      triggerFeedback('Experience record deleted.');
    }
  };

  // ================= EDUCATION HANDLERS =================
  const startEditEdu = (edu: Education) => {
    setEditingId(edu.id);
    setEduForm(edu);
  };

  const startAddEdu = () => {
    setEditingId('new_edu');
    setEduForm({
      id: 'edu-' + Date.now(),
      degree: '', institution: '', period: '', grade: '', details: ''
    });
  };

  const saveEdu = () => {
    if (!eduForm.degree || !eduForm.institution) {
      triggerFeedback('Degree level and institution are required.', 'error');
      return;
    }
    const sanitizedForm: Education = {
      id: eduForm.id || 'edu-' + Date.now(),
      degree: sanitizePlainString(eduForm.degree || ''),
      institution: sanitizePlainString(eduForm.institution || ''),
      period: sanitizePlainString(eduForm.period || ''),
      grade: sanitizePlainString(eduForm.grade || ''),
      details: sanitizePlainString(eduForm.details || '')
    };
    let updated: Education[];
    if (editingId === 'new_edu') {
      updated = [...portfolio.educations, sanitizedForm];
    } else {
      updated = portfolio.educations.map(e => e.id === editingId ? sanitizedForm : e);
    }
    portfolio.setEducations(updated);
    setEditingId(null);
    triggerFeedback('Education levels and details synchronized.');
  };

  const deleteEdu = (id: string) => {
    if (window.confirm('Delete academic registry entry?')) {
      portfolio.setEducations(portfolio.educations.filter(e => e.id !== id));
      triggerFeedback('Academic record deleted.');
    }
  };

  // ================= SOCIALS HANDLERS =================
  const startEditSocial = (soc: SocialAccount) => {
    setEditingId(soc.id);
    setSocialForm({ platform: soc.platform, url: soc.url });
  };

  const startAddSocial = () => {
    setEditingId('new_social');
    setSocialForm({ platform: '', url: '' });
  };

  const saveSocial = () => {
    if (!socialForm.platform || !socialForm.url) {
      triggerFeedback('Platform name and URL link are required.', 'error');
      return;
    }
    const platform = sanitizePlainString(socialForm.platform);
    const url = sanitizePlainString(socialForm.url);
    let updated: SocialAccount[];
    if (editingId === 'new_social') {
      updated = [...portfolio.socials, { id: 'soc-' + Date.now(), platform, url }];
    } else {
      updated = portfolio.socials.map(s => s.id === editingId ? { ...s, platform, url } : s);
    }
    portfolio.setSocials(updated);
    setEditingId(null);
    triggerFeedback('Social channel settings saved successfully.');
  };

  const deleteSocial = (id: string) => {
    if (window.confirm('Remove this social channel feed?')) {
      portfolio.setSocials(portfolio.socials.filter(s => s.id !== id));
      triggerFeedback('Social channel deleted.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07080d]/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 select-none overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="bg-[#0e111a] border border-neutral-850 w-full max-w-6xl h-[92vh] flex flex-col md:flex-row rounded-xl shadow-2xl overflow-hidden relative"
      >
        
        {/* LEFT NAV PANEL - TABS */}
        <aside className="w-full md:w-60 bg-[#090b11] border-b md:border-b-0 md:border-r border-neutral-850 p-4 md:p-5 flex flex-col justify-between shrink-0 h-auto md:h-full overflow-y-auto scrollbar-none">
          <div className="space-y-6">
            {/* Header Brand */}
            <div>
              <span className="font-mono text-[9px] tracking-widest text-sky-400 block font-semibold">SECURITY CLEARANCE: ROOT</span>
              <h2 className="font-sans text-sm font-bold text-white tracking-wider uppercase mt-1">Admin Central</h2>
            </div>

            {/* Links */}
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {[
                { id: 'profile', label: 'Identity & Layout', icon: User },
                { id: 'socials', label: 'Social Networks', icon: Share2 },
                { id: 'projects', label: 'Manage Projects', icon: Cpu },
                { id: 'skills', label: 'Manage Skills', icon: Code },
                { id: 'certs', label: 'Certifications', icon: Award },
                { id: 'hacks', label: 'Hackathon Placements', icon: Database },
                { id: 'exps', label: 'Job Experiences', icon: ShieldAlert },
                { id: 'edus', label: 'Academic History', icon: GraduationCap }
              ].map((item) => {
                const Icon = item.icon;
                const isAct = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as any); setEditingId(null); }}
                    className={`flex items-center gap-2 px-3 py-2 text-[11px] font-medium tracking-wide rounded-lg transition-all text-left whitespace-nowrap shrink-0 w-auto md:w-full ${
                      isAct 
                        ? 'bg-sky-500/10 text-sky-400 font-semibold border-l-2 border-sky-400' 
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                    }`}
                  >
                    <Icon size={12} className={isAct ? 'text-sky-400' : 'text-neutral-500'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* System reset */}
          <div className="pt-4 border-t border-neutral-900 mt-4 md:mt-0 space-y-2 hidden md:block">
            <button
              onClick={handleResetAll}
              className="w-full flex items-center justify-center gap-1.5 py-2 border border-rose-950 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 rounded-lg text-[10px] font-semibold transition-all"
            >
              <RefreshCw size={11} />
              <span>Reset Factory Settings</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white rounded-lg text-[10px] font-semibold transition-all"
            >
              Exit Control Deck
            </button>
          </div>
        </aside>

        {/* MAIN WORKSPACE PANEL */}
        <main className="flex-grow flex flex-col justify-between h-0 md:h-full overflow-hidden">
          
          {/* Workspace Title & Flash Notifications */}
          <header className="px-6 py-4 border-b border-neutral-850 bg-neutral-900/20 flex justify-between items-center">
            <h3 className="font-sans text-xs font-bold text-neutral-300 uppercase tracking-wider">
              {activeTab} parameters ledger
            </h3>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-850 text-neutral-400 hover:text-white transition-colors rounded-full"
            >
              <X size={15} />
            </button>
          </header>

          {/* Scrolling Editable Form Body */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin text-xs text-neutral-400">
            
            {/* Firebase Database Status Card */}
            <div className={`p-4 rounded-xl border font-sans ${
              isFirebaseConfigured 
                ? (portfolio.firestoreError ? 'bg-rose-950/20 border-rose-800/40 text-rose-200' : 'bg-purple-950/20 border-purple-800/40 text-purple-200')
                : 'bg-amber-950/15 border-amber-800/30 text-amber-200/90'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${isFirebaseConfigured ? (portfolio.firestoreError ? 'bg-rose-500/10' : 'bg-purple-500/10') : 'bg-amber-500/10'}`}>
                  <Database size={16} className={isFirebaseConfigured ? (portfolio.firestoreError ? 'text-rose-400' : 'text-purple-400') : 'text-amber-500'} />
                </div>
                <div className="space-y-1.5 flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {isFirebaseConfigured 
                        ? (portfolio.firestoreError ? 'Firestore Connection Restrained' : 'Firestore Real-time Sync Active') 
                        : 'Offline LocalStorage Mode'}
                    </span>
                    <span className={`inline-block w-2 h-2 rounded-full ${isFirebaseConfigured ? (portfolio.firestoreError ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400 animate-pulse') : 'bg-amber-500'}`} />
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-85">
                    {isFirebaseConfigured 
                      ? (portfolio.firestoreError 
                          ? 'We detected an access permission issue with your Firestore database rules. The portfolio is currently operating in offline fallback mode using local storage to protect your changes.'
                          : 'Your portfolio is completely synchronized with your cloud Firestore database. Any modifications you make in this Control Deck are instantly persisted in the cloud and synced in real-time across all active viewer tabs!')
                      : 'Changes are currently saved only to your local browser storage. To connect a live Firestore cloud database and enable real-time synchronization, configure your Firebase Web App credentials in the project settings or environment variables.'}
                  </p>
                  
                  {!isFirebaseConfigured && (
                    <div className="pt-2.5 mt-2.5 border-t border-amber-800/20 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-400">Manual Setup &amp; Database Design Blueprint:</span>
                      <ol className="list-decimal list-inside text-[10px] leading-relaxed space-y-1 text-neutral-400">
                        <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">Firebase Console</a> and create a free project.</li>
                        <li>Provision a **Cloud Firestore** database in **production or test mode**.</li>
                        <li>Register a **Web App** in your Firebase project settings to obtain your configuration object.</li>
                        <li>Paste your configuration keys into your `.env` variables: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.</li>
                        <li>Your database will automatically be seeded with your portfolio's defaults on first load!</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Firestore Permission Resolution Box */}
            {isFirebaseConfigured && portfolio.firestoreError && (
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/15 text-rose-300 font-sans space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className="text-rose-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Firestore Access Permission Issue</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Firestore returned: <code className="bg-neutral-900 px-1.5 py-0.5 rounded text-rose-400 text-[10px] break-all">{portfolio.firestoreError}</code>
                </p>
                <div className="pt-2 mt-2 border-t border-rose-800/20 space-y-1.5 text-[10px]">
                  <span className="font-semibold block text-rose-400 uppercase tracking-wider">How to resolve on your Firebase Console:</span>
                  <p className="leading-relaxed text-neutral-400">
                    Your Firestore database was created in **Production Mode**, which blocks all public access by default. Since you are configuring custom client-side verified profiles, update your Security Rules to allow access:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-400">
                    <li>Open the <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-rose-400 underline hover:text-rose-300">Firebase Console</a> and select your project.</li>
                    <li>Navigate to **Firestore Database** in the left menu, and click on the **Rules** tab.</li>
                    <li>Replace the existing rules with the following block to permit reads and writes:</li>
                  </ol>
                  <pre className="bg-neutral-950 p-2.5 rounded-lg text-[10px] text-neutral-300 font-mono overflow-x-auto whitespace-pre border border-neutral-850">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolio_data/{document} {
      allow read, write: if true;
    }
  }
}`}
                  </pre>
                  <p className="text-[10px] text-neutral-500 italic mt-1">
                    Once published, real-time cloud persistence will activate instantly without needing any app reload!
                  </p>
                </div>
              </div>
            )}

            {/* Feedback alert toasts */}
            {feedback && (
              <div className={`p-3 rounded-lg border text-xs font-sans tracking-wide ${
                feedback.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {feedback.text}
              </div>
            )}

            {/* TAB CONTENT: PROFILE & LAYOUT SETTINGS */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-2xl">
                {/* Visual Bio Identity Details */}
                <div className="space-y-4">
                  <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wide border-b border-neutral-850 pb-2 flex items-center gap-1.5">
                    <User size={13} className="text-sky-400" />
                    Portfolio Owner Identity
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Your Full Name</label>
                      <input 
                        type="text" 
                        value={profName} 
                        onChange={(e) => setProfName(e.target.value)}
                        className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-sky-500/40 focus:outline-none p-2.5 rounded-lg text-white"
                        placeholder="Nityam Patel"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Designation Label</label>
                      <input 
                        type="text" 
                        value={profDesig} 
                        onChange={(e) => setProfDesig(e.target.value)}
                        className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-sky-500/40 focus:outline-none p-2.5 rounded-lg text-white"
                        placeholder="Computer Engineer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Primary Location</label>
                      <input 
                        type="text" 
                        value={profLocation} 
                        onChange={(e) => setProfLocation(e.target.value)}
                        className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-sky-500/40 focus:outline-none p-2.5 rounded-lg text-white"
                        placeholder="San Francisco, CA"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase flex items-center gap-1">
                        <Upload size={10} />
                        Upload Avatar Image (Auto-optimized)
                      </label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setProfAvatar)}
                        className="w-full bg-[#111827]/40 border border-neutral-800 text-[10px] focus:outline-none p-2 rounded-lg text-neutral-400 file:bg-neutral-800 file:border-0 file:text-[10px] file:text-white file:px-2.5 file:py-1 file:mr-2 file:rounded file:cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Avatar Image URL (or auto-optimized base64 data)</label>
                    <input 
                      type="text" 
                      value={profAvatar} 
                      onChange={(e) => setProfAvatar(e.target.value)}
                      className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-sky-500/40 focus:outline-none p-2.5 rounded-lg text-white text-xs font-mono"
                      placeholder="https://images.unsplash.com/... or paste standard image link"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Contact Email</label>
                      <input 
                        type="email" 
                        value={profEmail} 
                        onChange={(e) => setProfEmail(e.target.value)}
                        className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-sky-500/40 focus:outline-none p-2.5 rounded-lg text-white"
                        placeholder="umangpatel2415@gmail.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Mobile No. / Phone</label>
                      <input 
                        type="text" 
                        value={profPhone} 
                        onChange={(e) => setProfPhone(e.target.value)}
                        className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-sky-500/40 focus:outline-none p-2.5 rounded-lg text-white"
                        placeholder="+91 7574885744"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">About Me / Hook text</label>
                    <textarea 
                      value={profAbout} 
                      onChange={(e) => setProfAbout(e.target.value)}
                      rows={4}
                      className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-sky-500/40 focus:outline-none p-2.5 rounded-lg text-white resize-none"
                      placeholder="Introduction statements..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase flex items-center gap-1.5">
                      <FileText size={12} className="text-emerald-400" />
                      Resume Link / Upload PDF
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={profResume} 
                        onChange={(e) => setProfResume(e.target.value)}
                        className="flex-grow bg-neutral-950/60 border border-neutral-800 focus:border-sky-500/40 focus:outline-none p-2.5 rounded-lg text-white text-[11px]"
                        placeholder="https://example.com/my-resume.pdf"
                      />
                      <label className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-lg font-semibold cursor-pointer transition-all flex items-center gap-1.5 shrink-0">
                        <Upload size={12} />
                        <span>Upload PDF</span>
                        <input 
                          type="file" 
                          accept=".pdf,application/pdf"
                          onChange={(e) => handleFileChange(e, setProfResume)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="bg-[#111827]/20 border border-neutral-850 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                        <Sparkles size={13} className="text-purple-400" />
                        3-D Interactive Parallax Card
                      </label>
                      <p className="text-[10px] text-neutral-500">
                        When enabled, your profile image card reacts dynamically to user mouse hover/movement with depth layering.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfParallax(!profParallax)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        profParallax ? 'bg-purple-600' : 'bg-neutral-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          profParallax ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <button 
                    onClick={saveGeneralSettings}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-all font-sans"
                  >
                    <Save size={13} />
                    <span>Save Identity &amp; Setup Settings</span>
                  </button>
                </div>

                {/* Section titles mapping */}
                <div className="space-y-4 pt-4 border-t border-neutral-900">
                  <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wide border-b border-neutral-850 pb-2 flex items-center gap-1.5">
                    <Settings size={13} className="text-indigo-400" />
                    Customize Navigation Section Names
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Section 1 Name (About)</label>
                      <input type="text" value={secHome} onChange={(e) => setSecHome(e.target.value)} className="w-full bg-neutral-950/40 border border-neutral-800 focus:border-sky-500/30 focus:outline-none p-2 rounded-lg text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Section 2 Name (Skills)</label>
                      <input type="text" value={secTech} onChange={(e) => setSecTech(e.target.value)} className="w-full bg-neutral-950/40 border border-neutral-800 focus:border-sky-500/30 focus:outline-none p-2 rounded-lg text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Section 3 Name (Projects)</label>
                      <input type="text" value={secProj} onChange={(e) => setSecProj(e.target.value)} className="w-full bg-neutral-950/40 border border-neutral-800 focus:border-sky-500/30 focus:outline-none p-2 rounded-lg text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Section 4 Name (Experience)</label>
                      <input type="text" value={secExp} onChange={(e) => setSecExp(e.target.value)} className="w-full bg-neutral-950/40 border border-neutral-800 focus:border-sky-500/30 focus:outline-none p-2 rounded-lg text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Section 5 Name (Hackathons)</label>
                      <input type="text" value={secHack} onChange={(e) => setSecHack(e.target.value)} className="w-full bg-neutral-950/40 border border-neutral-800 focus:border-sky-500/30 focus:outline-none p-2 rounded-lg text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Section 6 Name (Certifications)</label>
                      <input type="text" value={secCert} onChange={(e) => setSecCert(e.target.value)} className="w-full bg-neutral-950/40 border border-neutral-800 focus:border-sky-500/30 focus:outline-none p-2 rounded-lg text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Section 7 Name (Education)</label>
                      <input type="text" value={secEdu} onChange={(e) => setSecEdu(e.target.value)} className="w-full bg-neutral-950/40 border border-neutral-800 focus:border-sky-500/30 focus:outline-none p-2 rounded-lg text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Section 8 Name (Connect)</label>
                      <input type="text" value={secConn} onChange={(e) => setSecConn(e.target.value)} className="w-full bg-neutral-950/40 border border-neutral-800 focus:border-sky-500/30 focus:outline-none p-2 rounded-lg text-white" />
                    </div>
                  </div>
                  <button onClick={saveGeneralSettings} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold rounded-lg hover:border-sky-500/20 hover:text-sky-400 hover:bg-sky-500/5 transition-all">
                    <Save size={13} />
                    <span>Update Section Headings</span>
                  </button>
                </div>

                {/* Change passcode */}
                <div className="space-y-4 pt-4 border-t border-neutral-900">
                  <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wide border-b border-neutral-850 pb-2 flex items-center gap-1.5">
                    <Lock size={13} className="text-rose-400" />
                    Modify Security Passcode
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Current Passcode</label>
                      <input 
                        type="password" 
                        value={passOld} 
                        onChange={(e) => setPassOld(e.target.value)}
                        className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-rose-500/30 focus:outline-none p-2 rounded-lg text-white" 
                        placeholder="••••••"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">New Passcode</label>
                      <input 
                        type="password" 
                        value={passNew} 
                        onChange={(e) => setPassNew(e.target.value)}
                        className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-rose-500/30 focus:outline-none p-2 rounded-lg text-white" 
                        placeholder="••••••"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Confirm New Passcode</label>
                      <input 
                        type="password" 
                        value={passConfirm} 
                        onChange={(e) => setPassConfirm(e.target.value)}
                        className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-rose-500/30 focus:outline-none p-2 rounded-lg text-white" 
                        placeholder="••••••"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handlePasswordChange}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/25 hover:bg-rose-500/15 hover:border-rose-500/40 rounded-lg font-semibold transition-all"
                  >
                    <Lock size={13} />
                    <span>Change Secure Passcode</span>
                  </button>
                </div>

                {/* Change codeword */}
                <div className="space-y-4 pt-4 border-t border-neutral-900">
                  <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wide border-b border-neutral-850 pb-2 flex items-center gap-1.5">
                    <Settings size={13} className="text-sky-400" />
                    Modify Access Codeword
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Current Codeword</label>
                      <input 
                        type="text" 
                        value={codeOld} 
                        onChange={(e) => setCodeOld(e.target.value)}
                        className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-sky-500/30 focus:outline-none p-2 rounded-lg text-white" 
                        placeholder="/admin84login"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">New Codeword</label>
                      <input 
                        type="text" 
                        value={codeNew} 
                        onChange={(e) => setCodeNew(e.target.value)}
                        className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-sky-500/30 focus:outline-none p-2 rounded-lg text-white" 
                        placeholder="e.g. /mycustomlogin"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleCodewordChange}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-500/10 text-sky-400 border border-sky-500/25 hover:bg-sky-500/15 hover:border-sky-500/40 rounded-lg font-semibold transition-all"
                  >
                    <Settings size={13} />
                    <span>Change Access Codeword</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: MANAGE SOCIAL NETWORKS */}
            {activeTab === 'socials' && (
              <div className="space-y-6 animate-fadeIn">
                {editingId === null ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-neutral-850 pb-3">
                      <span className="font-sans text-xs font-semibold text-neutral-300">Social Network Connectivity Ports</span>
                      <button 
                        onClick={startAddSocial}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 text-white font-semibold rounded-lg text-[11px] hover:bg-sky-600 transition-all font-sans"
                      >
                        <Plus size={12} />
                        <span>Add Social Port</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {portfolio.socials.map(soc => (
                        <div key={soc.id} className="bg-neutral-900/30 border border-neutral-850 rounded-lg p-3.5 flex justify-between items-center gap-4">
                          <div className="space-y-1 min-w-0">
                            <h5 className="font-sans text-xs font-bold text-white flex items-center gap-2">
                              <span className="text-sky-400 font-mono text-[10px] tracking-wider uppercase">// {soc.platform}</span>
                            </h5>
                            <p className="text-neutral-400 text-[11px] font-mono truncate">{soc.url}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button 
                              onClick={() => startEditSocial(soc)} 
                              className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-[10px] font-semibold rounded transition-all"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteSocial(soc.id)} 
                              className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 text-[10px] rounded transition-all"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-900/20 border border-neutral-850 rounded-xl p-5 space-y-4 max-w-xl">
                    <h4 className="font-sans text-xs font-bold text-white uppercase border-b border-neutral-850 pb-2">
                      {editingId === 'new_social' ? 'Configure New Social Port' : 'Update Social Port configuration'}
                    </h4>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase">Platform Name</label>
                        <input 
                          type="text" 
                          value={socialForm.platform} 
                          onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-sky-500/40 focus:outline-none p-2.5 rounded-lg text-white font-sans text-xs"
                          placeholder="e.g. GitHub, LinkedIn, Twitter, Discord, YouTube"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase">Hyperlink URL Link</label>
                        <input 
                          type="text" 
                          value={socialForm.url} 
                          onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-sky-500/40 focus:outline-none p-2.5 rounded-lg text-white font-sans text-xs"
                          placeholder="https://github.com/my-username"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button 
                        onClick={saveSocial} 
                        className="flex items-center gap-1 px-4 py-2 bg-sky-500 text-white font-semibold rounded hover:bg-sky-600 transition-all text-xs"
                      >
                        <Save size={12} />
                        <span>Save Port Settings</span>
                      </button>
                      <button 
                        onClick={() => setEditingId(null)} 
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded transition-all text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: MANAGE PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                {editingId === null ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-850 pb-3">
                      <span className="font-sans text-xs font-semibold text-neutral-300">Active projects in local list</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button 
                          onClick={downloadProjectsTemplate}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-sky-400 font-semibold rounded-lg text-[11px] hover:bg-neutral-800 transition-all font-sans cursor-pointer"
                          title="Download Excel Import Template"
                        >
                          <Download size={12} />
                          <span>Get Template</span>
                        </button>
                        
                        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-emerald-400 font-semibold rounded-lg text-[11px] hover:bg-neutral-800 transition-all font-sans cursor-pointer">
                          <Upload size={12} />
                          <span>Import Excel</span>
                          <input 
                            type="file" 
                            accept=".xlsx, .xls"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const imported = await parseProjectsExcel(file);
                                if (imported.length > 0) {
                                  portfolio.setProjects([...portfolio.projects, ...imported]);
                                  triggerFeedback(`Successfully imported ${imported.length} project(s) via Excel!`);
                                } else {
                                  triggerFeedback('No projects found in Excel file.', 'error');
                                }
                              } catch (err) {
                                triggerFeedback('Failed to parse Excel file.', 'error');
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>

                        <button 
                          onClick={startAddProject}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 text-white font-semibold rounded-lg text-[11px] hover:bg-sky-600 transition-all font-sans cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>Add New Project</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {portfolio.projects.map(proj => (
                        <div key={proj.id} className="bg-neutral-900/30 border border-neutral-850 rounded-lg p-3.5 flex justify-between items-center gap-4">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9px] bg-neutral-950 text-sky-400 border border-neutral-800 px-1.5 py-0.5 rounded uppercase font-medium">{proj.serial}</span>
                              <h5 className="font-sans text-xs font-bold text-white truncate">{proj.title.replace(/_/g, ' ')}</h5>
                            </div>
                            <p className="font-sans text-[11px] text-neutral-500 line-clamp-1">{proj.description}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button 
                              onClick={() => startEditProject(proj)}
                              className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-semibold rounded transition-all text-[10px]"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteProject(proj.id)}
                              className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/25 text-rose-400 font-semibold rounded transition-all text-[10px]"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-900/20 border border-neutral-850 rounded-xl p-5 space-y-4 max-w-2xl">
                    <h4 className="font-sans text-xs font-bold text-white uppercase border-b border-neutral-850 pb-2">
                      {editingId === 'new' ? 'Build New Project Node' : `Update Project Ledger // ${projectForm.serial}`}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Project Title / Key</label>
                        <input 
                          type="text" 
                          value={projectForm.title} 
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                          placeholder="QUANTUM_FLOW_VIZ"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Project Serial ID</label>
                        <input 
                          type="text" 
                          value={projectForm.serial} 
                          onChange={(e) => setProjectForm({ ...projectForm, serial: e.target.value })}
                          placeholder="VFX-F.88"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Client Name</label>
                        <input 
                          type="text" 
                          value={projectForm.client} 
                          onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                          placeholder="COGNITIVE LABS"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Timeline / Year</label>
                        <input 
                          type="text" 
                          value={projectForm.year} 
                          onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                          placeholder="2024"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Status Node</label>
                        <select 
                          value={projectForm.status} 
                          onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                        >
                          <option value="ACTIVE_STATE">Active (In Progress)</option>
                          <option value="STABLE_REL">Completed</option>
                          <option value="OPTIMIZING">Optimizing</option>
                          <option value="DEPRECATED">Deprecated</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Category Category</label>
                        <select 
                          value={projectForm.category} 
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                        >
                          <option value="websites">Websites</option>
                          <option value="installations">Installations</option>
                          <option value="xr-vr-ai">XR / VR / AI</option>
                          <option value="multiplayer">Multiplayer</option>
                          <option value="games">Games</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Summary Description</label>
                      <input 
                        type="text" 
                        value={projectForm.description} 
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        placeholder="Brief 1-sentence descriptor..."
                        className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Detailed Narrative</label>
                      <textarea 
                        value={projectForm.details} 
                        onChange={(e) => setProjectForm({ ...projectForm, details: e.target.value })}
                        rows={3}
                        placeholder="Elaborated project documentation details..."
                        className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Tech Stack Tags (Comma Separated)</label>
                        <input 
                          type="text" 
                          value={projectForm.tags?.join(', ')} 
                          onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean) })}
                          placeholder="REACT, GLSL, THREE.JS"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">External Live Website Link</label>
                        <input 
                          type="text" 
                          value={projectForm.link} 
                          onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                          placeholder="https://mywebsite.com"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                          <Upload size={10} /> Thumbnail Image (URL or Upload Image)
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={projectForm.imageUrl || ''} 
                            onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                            placeholder="https://site.com/image.png"
                            className="flex-grow bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white text-[11px]"
                          />
                          <label className="bg-neutral-900 border border-neutral-800 hover:border-sky-500/20 text-sky-400 px-3 py-2 rounded text-[10px] font-semibold cursor-pointer shrink-0">
                            Upload
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, (base64) => setProjectForm({ ...projectForm, imageUrl: base64 }))}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                          <Upload size={10} /> Detail Report PDF (URL or Upload Document)
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={projectForm.videoUrl || ''} 
                            onChange={(e) => setProjectForm({ ...projectForm, videoUrl: e.target.value })}
                            placeholder="https://site.com/report.pdf"
                            className="flex-grow bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white text-[11px]"
                          />
                          <label className="bg-neutral-900 border border-neutral-800 hover:border-sky-500/20 text-sky-400 px-3 py-2 rounded text-[10px] font-semibold cursor-pointer shrink-0">
                            Upload
                            <input 
                              type="file" 
                              accept=".pdf,application/pdf"
                              onChange={(e) => handleFileChange(e, (base64) => setProjectForm({ ...projectForm, videoUrl: base64 }))}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button 
                        onClick={saveProject}
                        className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 text-white font-semibold rounded hover:bg-sky-600 transition-all"
                      >
                        <Save size={12} />
                        <span>Save Record</span>
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: MANAGE SKILLS */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                {editingId === null ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-850 pb-3">
                      <span className="font-sans text-xs font-semibold text-neutral-300">Technical skills library ledger</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button 
                          onClick={downloadSkillsTemplate}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-sky-400 font-semibold rounded-lg text-[11px] hover:bg-neutral-800 transition-all font-sans cursor-pointer"
                          title="Download Excel Import Template"
                        >
                          <Download size={12} />
                          <span>Get Template</span>
                        </button>
                        
                        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-emerald-400 font-semibold rounded-lg text-[11px] hover:bg-neutral-800 transition-all font-sans cursor-pointer">
                          <Upload size={12} />
                          <span>Import Excel</span>
                          <input 
                            type="file" 
                            accept=".xlsx, .xls"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const imported = await parseSkillsExcel(file);
                                if (imported.length > 0) {
                                  // filter out skills that already exist by name
                                  const existingNames = new Set(portfolio.technologies.map(t => t.name.toLowerCase()));
                                  const filtered = imported.filter(t => !existingNames.has(t.name.toLowerCase()));
                                  
                                  if (filtered.length > 0) {
                                    portfolio.setTechnologies([...portfolio.technologies, ...filtered]);
                                    triggerFeedback(`Successfully imported ${filtered.length} skill(s) via Excel!`);
                                  } else {
                                    triggerFeedback('All imported skills already exist in your portfolio.', 'error');
                                  }
                                } else {
                                  triggerFeedback('No skills found in Excel file.', 'error');
                                }
                              } catch (err) {
                                triggerFeedback('Failed to parse Excel file.', 'error');
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>

                        <button 
                          onClick={startAddSkill}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 text-white font-semibold rounded-lg text-[11px] hover:bg-sky-600 transition-all font-sans cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>Add New Technology</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {portfolio.technologies.map(tech => (
                        <div key={tech.name} className="bg-neutral-900/30 border border-neutral-850 rounded-lg p-3 flex justify-between items-center gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-neutral-500 block uppercase font-semibold">[{tech.category}]</span>
                            <h5 className="font-sans text-xs font-bold text-white">{tech.name}</h5>
                            <span className="text-[10px] text-emerald-400 font-semibold">{tech.status} • {tech.proficiency}%</span>
                          </div>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => startEditSkill(tech)}
                              className="px-2 py-1 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-[10px] font-semibold rounded"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteSkill(tech.name)}
                              className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 text-[10px] rounded"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-900/20 border border-neutral-850 rounded-xl p-5 space-y-4 max-w-xl">
                    <h4 className="font-sans text-xs font-bold text-white uppercase border-b border-neutral-850 pb-2">
                      {editingId === 'new_skill' ? 'Register New Skill Node' : `Update Skill Node // ${editingId}`}
                    </h4>

                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase">Skill / Tech Name</label>
                        <input 
                          type="text" 
                          value={techForm.name} 
                          onChange={(e) => setTechForm({ ...techForm, name: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                          placeholder="Three.js / WebGL"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase">Category Area</label>
                          <select 
                            value={techForm.category} 
                            onChange={(e) => setTechForm({ ...techForm, category: e.target.value as any })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                          >
                            <option value="Languages">Languages</option>
                            <option value="Frontend">Frontend</option>
                            <option value="AI / Neural">AI / Neural</option>
                            <option value="Infrastructure">Infrastructure</option>
                            <option value="Creative Tech">Creative Tech</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase">Status Frequency</label>
                          <input 
                            type="text" 
                            value={techForm.status} 
                            onChange={(e) => setTechForm({ ...techForm, status: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                            placeholder="MASTERED / ACTIVE / EXPLORING"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase">Proficiency (0-100)</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="100"
                            value={techForm.proficiency} 
                            onChange={(e) => setTechForm({ ...techForm, proficiency: parseInt(e.target.value) || 0 })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase">Telemetry Metric Highlight</label>
                          <input 
                            type="text" 
                            value={techForm.metric} 
                            onChange={(e) => setTechForm({ ...techForm, metric: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                            placeholder="e.g. 60 FPS stable rendering"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button onClick={saveSkill} className="flex items-center gap-1 px-4 py-2 bg-sky-500 text-white font-semibold rounded hover:bg-sky-600 transition-all">
                        <Save size={12} />
                        <span>Commit Skill</span>
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: MANAGE CERTIFICATES */}
            {activeTab === 'certs' && (
              <div className="space-y-6">
                {editingId === null ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-850 pb-3">
                      <span className="font-sans text-xs font-semibold text-neutral-300">Certificates validation ledger</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button 
                          onClick={downloadCertsTemplate}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-sky-400 font-semibold rounded-lg text-[11px] hover:bg-neutral-800 transition-all font-sans cursor-pointer"
                          title="Download Excel Import Template"
                        >
                          <Download size={12} />
                          <span>Get Template</span>
                        </button>
                        
                        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-emerald-400 font-semibold rounded-lg text-[11px] hover:bg-neutral-800 transition-all font-sans cursor-pointer">
                          <Upload size={12} />
                          <span>Import Excel</span>
                          <input 
                            type="file" 
                            accept=".xlsx, .xls"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const imported = await parseCertsExcel(file);
                                if (imported.length > 0) {
                                  portfolio.setCertificates([...portfolio.certificates, ...imported]);
                                  triggerFeedback(`Successfully imported ${imported.length} certificate(s) via Excel!`);
                                } else {
                                  triggerFeedback('No certificates found in Excel file.', 'error');
                                }
                              } catch (err) {
                                triggerFeedback('Failed to parse Excel file.', 'error');
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>

                        <button 
                          onClick={startAddCert}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 text-white font-semibold rounded-lg text-[11px] hover:bg-sky-600 transition-all font-sans cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>Add Certificate</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {portfolio.certificates.map(cert => (
                        <div key={cert.id} className="bg-neutral-900/30 border border-neutral-850 rounded-lg p-3 flex justify-between items-center gap-4">
                          <div className="space-y-0.5">
                            <span className="font-sans text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">{cert.status}</span>
                            <h5 className="font-sans text-xs font-bold text-white pt-1">{cert.title.replace(/_/g, ' ')}</h5>
                            <p className="font-sans text-[11px] text-neutral-500">{cert.issuer} • {cert.date}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => startEditCert(cert)} className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-[10px] font-semibold rounded transition-all">Edit</button>
                            <button onClick={() => deleteCert(cert.id)} className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 text-[10px] rounded transition-all"><Trash2 size={11} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-900/20 border border-neutral-850 rounded-xl p-5 space-y-4 max-w-xl">
                    <h4 className="font-sans text-xs font-bold text-white uppercase border-b border-neutral-850 pb-2">
                      {editingId === 'new_cert' ? 'Register Certificate validation' : 'Update Certificate parameters'}
                    </h4>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase">Certificate Title</label>
                        <input 
                          type="text" 
                          value={certForm.title} 
                          onChange={(e) => setCertForm({ ...certForm, title: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                          placeholder="WEB_VFX_SPECIALIST"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase">Issuer Academy</label>
                        <input 
                          type="text" 
                          value={certForm.issuer} 
                          onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase">Verification Date</label>
                          <input 
                            type="date" 
                            value={certForm.date} 
                            onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase">Credential Serial ID</label>
                          <input 
                            type="text" 
                            value={certForm.credentialId} 
                            onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase">Clearance Status</label>
                          <select 
                            value={certForm.status} 
                            onChange={(e) => setCertForm({ ...certForm, status: e.target.value as any })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                          >
                            <option value="VERIFIED">Verified Secure</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                            <Upload size={10} /> Certificate PDF/Image (URL or Upload)
                          </label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={certForm.credentialUrl || ''} 
                              onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                              placeholder="https://site.com/certificate.pdf"
                              className="flex-grow bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white text-[11px]"
                            />
                            <label className="bg-neutral-900 border border-neutral-800 hover:border-sky-500/20 text-sky-400 px-3 py-2 rounded text-[10px] font-semibold cursor-pointer shrink-0">
                              Upload
                              <input 
                                type="file" 
                                accept=".pdf,application/pdf,image/*"
                                onChange={(e) => handleFileChange(e, (base64) => setCertForm({ ...certForm, credentialUrl: base64 }))}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button onClick={saveCert} className="flex items-center gap-1 px-4 py-2 bg-sky-500 text-white font-semibold rounded hover:bg-sky-600 transition-all">
                        <Save size={12} />
                        <span>Commit Certificate</span>
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: MANAGE HACKATHONS */}
            {activeTab === 'hacks' && (
              <div className="space-y-6">
                {editingId === null ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-850 pb-3">
                      <span className="font-sans text-xs font-semibold text-neutral-300">Hackathons registry ledger</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button 
                          onClick={downloadHacksTemplate}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-sky-400 font-semibold rounded-lg text-[11px] hover:bg-neutral-800 transition-all font-sans cursor-pointer"
                          title="Download Excel Import Template"
                        >
                          <Download size={12} />
                          <span>Get Template</span>
                        </button>
                        
                        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-emerald-400 font-semibold rounded-lg text-[11px] hover:bg-neutral-800 transition-all font-sans cursor-pointer">
                          <Upload size={12} />
                          <span>Import Excel</span>
                          <input 
                            type="file" 
                            accept=".xlsx, .xls"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const imported = await parseHacksExcel(file);
                                if (imported.length > 0) {
                                  portfolio.setHackathons([...portfolio.hackathons, ...imported]);
                                  triggerFeedback(`Successfully imported ${imported.length} hackathon(s) via Excel!`);
                                } else {
                                  triggerFeedback('No hackathons found in Excel file.', 'error');
                                }
                              } catch (err) {
                                triggerFeedback('Failed to parse Excel file.', 'error');
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>

                        <button 
                          onClick={startAddHack}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 text-white font-semibold rounded-lg text-[11px] hover:bg-sky-600 transition-all font-sans cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>Add Hackathon</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {portfolio.hackathons.map(hack => (
                        <div key={hack.id} className="bg-neutral-900/30 border border-neutral-850 rounded-lg p-3.5 flex justify-between items-center gap-4">
                          <div className="flex items-center gap-3">
                            {(hack.participationCertUrl || hack.winningCertUrl) && (
                              <div className="flex gap-1.5 shrink-0">
                                {hack.winningCertUrl && (
                                  <div className="w-8 h-8 rounded border border-neutral-800 bg-neutral-950 overflow-hidden flex items-center justify-center relative group" title="Winning Certificate">
                                    {hack.winningCertUrl.startsWith('data:image/') ? (
                                      <img src={hack.winningCertUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                      <FileText size={12} className="text-amber-400" />
                                    )}
                                    <span className="absolute bottom-0 right-0 bg-amber-500 text-[5px] text-black px-0.5 font-bold">WIN</span>
                                  </div>
                                )}
                                {hack.participationCertUrl && (
                                  <div className="w-8 h-8 rounded border border-neutral-800 bg-neutral-950 overflow-hidden flex items-center justify-center relative group" title="Participation Certificate">
                                    {hack.participationCertUrl.startsWith('data:image/') ? (
                                      <img src={hack.participationCertUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                      <FileText size={12} className="text-blue-400" />
                                    )}
                                    <span className="absolute bottom-0 right-0 bg-blue-500 text-[5px] text-white px-0.5 font-bold">PART</span>
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded font-semibold uppercase tracking-wide">{hack.position}</span>
                              <h5 className="font-sans text-xs font-bold text-white pt-1">{hack.title.replace(/_/g, ' ')}</h5>
                              <p className="font-sans text-[11px] text-neutral-500">{hack.location} • {hack.year}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => startEditHack(hack)} className="px-2 py-1 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-[10px] font-semibold rounded">Edit</button>
                            <button onClick={() => deleteHack(hack.id)} className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 text-[10px] rounded"><Trash2 size={11} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-900/20 border border-neutral-850 rounded-xl p-5 space-y-4 max-w-xl">
                    <h4 className="font-sans text-xs font-bold text-white uppercase border-b border-neutral-850 pb-2">
                      {editingId === 'new_hack' ? 'Register New Hackathon Placement' : 'Update Hackathon parameters'}
                    </h4>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase">Hackathon Name</label>
                        <input 
                          type="text" 
                          value={hackForm.title} 
                          onChange={(e) => setHackForm({ ...hackForm, title: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                          placeholder="GOOGLE_CREATIVE_SANDBOX"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase">Year / Date</label>
                          <input 
                            type="text" 
                            value={hackForm.year} 
                            onChange={(e) => setHackForm({ ...hackForm, year: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                            placeholder="2024"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase">Placement / Award (Result)</label>
                          <input 
                            type="text" 
                            value={hackForm.position} 
                            onChange={(e) => setHackForm({ ...hackForm, position: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                            placeholder="e.g. 1ST PLACE GOLD"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase">Location</label>
                          <input 
                            type="text" 
                            value={hackForm.location} 
                            onChange={(e) => setHackForm({ ...hackForm, location: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                            placeholder="Austin, TX"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase">Tech Stack (Comma Separated)</label>
                          <input 
                            type="text" 
                            value={hackForm.tags?.join(', ')} 
                            onChange={(e) => setHackForm({ ...hackForm, tags: e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean) })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                            placeholder="RUST, WASM, REACT"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase">Summary Description</label>
                        <textarea 
                          value={hackForm.description} 
                          onChange={(e) => setHackForm({ ...hackForm, description: e.target.value })}
                          rows={3}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                            <Upload size={10} /> Winning Certificate (URL or Upload)
                          </label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={hackForm.winningCertUrl || ''} 
                              onChange={(e) => setHackForm({ ...hackForm, winningCertUrl: e.target.value })}
                              placeholder="https://site.com/winning_cert.png"
                              className="flex-grow bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white text-[11px]"
                            />
                            <label className="bg-neutral-900 border border-neutral-800 hover:border-sky-500/20 text-sky-400 px-3 py-2 rounded text-[10px] font-semibold cursor-pointer shrink-0">
                              Upload
                              <input 
                                type="file" 
                                accept=".pdf,application/pdf,image/*"
                                onChange={(e) => handleFileChange(e, (base64) => setHackForm({ ...hackForm, winningCertUrl: base64 }))}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                            <Upload size={10} /> Participation Certificate (URL or Upload)
                          </label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={hackForm.participationCertUrl || ''} 
                              onChange={(e) => setHackForm({ ...hackForm, participationCertUrl: e.target.value })}
                              placeholder="https://site.com/participation_cert.png"
                              className="flex-grow bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white text-[11px]"
                            />
                            <label className="bg-neutral-900 border border-neutral-800 hover:border-sky-500/20 text-sky-400 px-3 py-2 rounded text-[10px] font-semibold cursor-pointer shrink-0">
                              Upload
                              <input 
                                type="file" 
                                accept=".pdf,application/pdf,image/*"
                                onChange={(e) => handleFileChange(e, (base64) => setHackForm({ ...hackForm, participationCertUrl: base64 }))}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button onClick={saveHack} className="flex items-center gap-1 px-4 py-2 bg-sky-500 text-white font-semibold rounded hover:bg-sky-600 transition-all">
                        <Save size={12} />
                        <span>Commit Entry</span>
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: MANAGE EXPERIENCE */}
            {activeTab === 'exps' && (
              <div className="space-y-6">
                {editingId === null ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-850 pb-3">
                      <span className="font-sans text-xs font-semibold text-neutral-300">Chronological employment experiences</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button 
                          onClick={downloadExperienceTemplate}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-sky-400 font-semibold rounded-lg text-[11px] hover:bg-neutral-800 transition-all font-sans cursor-pointer"
                          title="Download Excel Import Template"
                        >
                          <Download size={12} />
                          <span>Get Template</span>
                        </button>
                        
                        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-emerald-400 font-semibold rounded-lg text-[11px] hover:bg-neutral-800 transition-all font-sans cursor-pointer">
                          <Upload size={12} />
                          <span>Import Excel</span>
                          <input 
                            type="file" 
                            accept=".xlsx, .xls"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const imported = await parseExperienceExcel(file);
                                if (imported.length > 0) {
                                  portfolio.setExperiences([...portfolio.experiences, ...imported]);
                                  triggerFeedback(`Successfully imported ${imported.length} experience(s) via Excel!`);
                                } else {
                                  triggerFeedback('No experience entries found in Excel file.', 'error');
                                }
                              } catch (err) {
                                triggerFeedback('Failed to parse Excel file.', 'error');
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>

                        <button 
                          onClick={startAddExp}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 text-white font-semibold rounded-lg text-[11px] hover:bg-sky-600 transition-all font-sans cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>Add Employment Node</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {portfolio.experiences.map(exp => (
                        <div key={exp.id} className="bg-neutral-900/30 border border-neutral-850 rounded-lg p-3.5 flex justify-between items-center gap-4">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-neutral-500 block font-semibold uppercase">[{exp.period}]</span>
                            <h5 className="font-sans text-xs font-bold text-white">{exp.role.replace(/_/g, ' ')}</h5>
                            <p className="font-sans text-[11px] text-neutral-400">{exp.company}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => startEditExp(exp)} className="px-2 py-1 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 text-[10px] font-semibold rounded transition-all">Edit</button>
                            <button onClick={() => deleteExp(exp.id)} className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 text-[10px] rounded transition-all"><Trash2 size={11} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-900/20 border border-neutral-850 rounded-xl p-5 space-y-4 max-w-xl">
                    <h4 className="font-sans text-xs font-bold text-white uppercase border-b border-neutral-850 pb-2">
                      {editingId === 'new_exp' ? 'Log New Job Node' : 'Update Employment specs'}
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase">Role Title</label>
                        <input 
                          type="text" 
                          value={expForm.role} 
                          onChange={(e) => setExpForm({ ...expForm, role: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                          placeholder="SENIOR_WEB_VFX_DEVELOPER"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase">Company / Department</label>
                        <input 
                          type="text" 
                          value={expForm.company} 
                          onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase">Period / Years</label>
                        <input 
                          type="text" 
                          value={expForm.period} 
                          onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                          placeholder="2023 - PRESENT"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase">Operational Status</label>
                        <input 
                          type="text" 
                          value={expForm.status} 
                          onChange={(e) => setExpForm({ ...expForm, status: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                          placeholder="ACTIVE_UPLINK / COMPLETED_MISSION"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-500 font-semibold uppercase">Position Summary description</label>
                      <input 
                        type="text" 
                        value={expForm.description} 
                        onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-500 font-semibold uppercase">Bullet achievements (One per line)</label>
                      <textarea 
                        value={expForm.bullets?.join('\n')} 
                        onChange={(e) => setExpForm({ ...expForm, bullets: e.target.value.split('\n').filter(Boolean) })}
                        rows={3}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white resize-none text-[11px]"
                      />
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button onClick={saveExp} className="flex items-center gap-1 px-4 py-2 bg-sky-500 text-white font-semibold rounded hover:bg-sky-600 transition-all">
                        <Save size={12} />
                        <span>Log Position</span>
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: MANAGE EDUCATION */}
            {activeTab === 'edus' && (
              <div className="space-y-6">
                {editingId === null ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-850 pb-3">
                      <span className="font-sans text-xs font-semibold text-neutral-300">Academic accomplishments registry</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button 
                          onClick={downloadEducationTemplate}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-sky-400 font-semibold rounded-lg text-[11px] hover:bg-neutral-800 transition-all font-sans cursor-pointer"
                          title="Download Excel Import Template"
                        >
                          <Download size={12} />
                          <span>Get Template</span>
                        </button>
                        
                        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-emerald-400 font-semibold rounded-lg text-[11px] hover:bg-neutral-800 transition-all font-sans cursor-pointer">
                          <Upload size={12} />
                          <span>Import Excel</span>
                          <input 
                            type="file" 
                            accept=".xlsx, .xls"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const imported = await parseEducationExcel(file);
                                if (imported.length > 0) {
                                  portfolio.setEducations([...portfolio.educations, ...imported]);
                                  triggerFeedback(`Successfully imported ${imported.length} academic record(s) via Excel!`);
                                } else {
                                  triggerFeedback('No academic records found in Excel file.', 'error');
                                }
                              } catch (err) {
                                triggerFeedback('Failed to parse Excel file.', 'error');
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>

                        <button 
                          onClick={startAddEdu}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 text-white font-semibold rounded-lg text-[11px] hover:bg-sky-600 transition-all font-sans cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>Add Academic Level</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {portfolio.educations.map(edu => (
                        <div key={edu.id} className="bg-neutral-900/30 border border-neutral-850 rounded-lg p-3.5 flex justify-between items-center gap-4">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-neutral-500 block font-semibold uppercase">[{edu.period}]</span>
                            <h5 className="font-sans text-xs font-bold text-white">{edu.degree}</h5>
                            <p className="font-sans text-[11px] text-neutral-400">{edu.institution} • {edu.grade || 'No Grade'}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => startEditEdu(edu)} className="px-2 py-1 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-[10px] font-semibold rounded transition-all">Edit</button>
                            <button onClick={() => deleteEdu(edu.id)} className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 text-[10px] rounded transition-all"><Trash2 size={11} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-900/20 border border-neutral-850 rounded-xl p-5 space-y-4 max-w-xl">
                    <h4 className="font-sans text-xs font-bold text-white uppercase border-b border-neutral-850 pb-2">
                      {editingId === 'new_edu' ? 'Log Academic accomplishment' : 'Update Academic ledger details'}
                    </h4>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase">Degree / Qualification</label>
                        <input 
                          type="text" 
                          value={eduForm.degree} 
                          onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value.toUpperCase() })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                          placeholder="B.S. COMPUTER SCIENCE"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase">Institution Name / Board</label>
                        <input 
                          type="text" 
                          value={eduForm.institution} 
                          onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase">Period / Year</label>
                          <input 
                            type="text" 
                            value={eduForm.period} 
                            onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                            placeholder="2017 - 2021"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 font-semibold uppercase">Grade / Result Details</label>
                          <input 
                            type="text" 
                            value={eduForm.grade} 
                            onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white"
                            placeholder="e.g. GPA: 3.96 / 4.00, or 95% score"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 font-semibold uppercase">Academic Highlights / Semester-wise Grades</label>
                        <textarea 
                          value={eduForm.details} 
                          onChange={(e) => setEduForm({ ...eduForm, details: e.target.value })}
                          rows={4}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none p-2 rounded text-white resize-none text-[11px]"
                          placeholder="e.g. Sem 1: 9.8 CGPA, Sem 2: 9.5 CGPA, Specialization Focus..."
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button onClick={saveEdu} className="flex items-center gap-1 px-4 py-2 bg-sky-500 text-white font-semibold rounded hover:bg-sky-600 transition-all">
                        <Save size={12} />
                        <span>Log Academic Accomplishment</span>
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Fixed bottom workspace footer with mobile action triggers */}
          <footer className="px-6 py-3 border-t border-neutral-850 bg-neutral-950/40 text-[10px] text-neutral-500 flex justify-between items-center select-none shrink-0 md:hidden">
            <button 
              onClick={handleResetAll}
              className="text-rose-400 font-semibold"
            >
              Reset Defaults
            </button>
            <button 
              onClick={onClose}
              className="text-sky-400 font-semibold"
            >
              Exit Dashboard
            </button>
          </footer>

        </main>
      </motion.div>
    </div>
  );
}
