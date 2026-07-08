import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Certificate, Technology, Hackathon, Experience, Education, SocialAccount } from '../types';
import { PROJECTS, CERTIFICATES, TECHNOLOGIES, HACKATHONS, EXPERIENCES, EDUCATIONS } from '../data';
import { isFirebaseConfigured, saveToFirestore, subscribeToFirestore } from '../lib/firebase';

export interface Profile {
  name: string;
  designation: string;
  avatarUrl: string;
  aboutMeText: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  location: string;
  isOnline: boolean;
  email?: string;
  phone?: string;
  parallaxEnabled?: boolean;
}

export interface Sections {
  home: string;
  technologies: string;
  projects: string;
  experience: string;
  hackathons: string;
  certifications: string;
  education: string;
  connect: string;
}

export interface PortfolioContextType {
  profile: Profile;
  sections: Sections;
  projects: Project[];
  technologies: Technology[];
  certificates: Certificate[];
  hackathons: Hackathon[];
  experiences: Experience[];
  educations: Education[];
  adminPassword: string;
  adminCodeword: string;
  showAdmin: boolean;
  setShowAdmin: (show: boolean) => void;
  adminAuthorized: boolean;
  setAdminAuthorized: (authorized: boolean) => void;
  setProfile: (profile: Profile) => void;
  setSections: (sections: Sections) => void;
  setProjects: (projects: Project[]) => void;
  setTechnologies: (technologies: Technology[]) => void;
  setCertificates: (certificates: Certificate[]) => void;
  setHackathons: (hackathons: Hackathon[]) => void;
  setExperiences: (experiences: Experience[]) => void;
  setEducations: (educations: Education[]) => void;
  setAdminPassword: (password: string) => void;
  setAdminCodeword: (codeword: string) => void;
  socials: SocialAccount[];
  setSocials: (socials: SocialAccount[]) => void;
  resetToDefault: () => void;
  firestoreError: string | null;
  setFirestoreError: (error: string | null) => void;
}


const DEFAULT_PROFILE: Profile = {
  name: 'Nityam Patel',
  designation: 'Computer Engineer',
  avatarUrl: '',
  aboutMeText: 'I am Nityam Patel, a Computer Engineer specializing in Creative Technologies, high-performance web systems, and interactive VFX. I focus on bridging the gap between design and engineering, constructing responsive graphics pipelines, decentralized architectures, and intuitive digital layouts.',
  resumeUrl: '',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  location: 'Vadodara, Gujarat, India',
  isOnline: true,
  email: 'umangpatel2415@gmail.com',
  phone: '+91 7574885744',
  parallaxEnabled: true
};

const DEFAULT_SECTIONS: Sections = {
  home: 'About Me',
  technologies: 'Technical Skills',
  projects: 'Projects',
  experience: 'Experience',
  hackathons: 'Hackathons & Competitions',
  certifications: 'Certifications',
  education: 'Education',
  connect: 'Connect'
};

const DEFAULT_PASSWORD = 'al';
const DEFAULT_CODEWORD = '/al';

const DEFAULT_SOCIALS: SocialAccount[] = [
  { id: '1', platform: 'GitHub', url: 'https://github.com' },
  { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com' },
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<Profile>(DEFAULT_PROFILE);
  const [sections, setSectionsState] = useState<Sections>(DEFAULT_SECTIONS);
  const [projects, setProjectsState] = useState<Project[]>(PROJECTS);
  const [technologies, setTechnologiesState] = useState<Technology[]>(TECHNOLOGIES);
  const [certificates, setCertificatesState] = useState<Certificate[]>(CERTIFICATES);
  const [hackathons, setHackathonsState] = useState<Hackathon[]>(HACKATHONS);
  const [experiences, setExperiencesState] = useState<Experience[]>(EXPERIENCES);
  const [educations, setEducationsState] = useState<Education[]>(EDUCATIONS);
  const [adminPassword, setAdminPasswordState] = useState<string>(DEFAULT_PASSWORD);
  const [adminCodeword, setAdminCodewordState] = useState<string>(DEFAULT_CODEWORD);
  const [socials, setSocialsState] = useState<SocialAccount[]>(DEFAULT_SOCIALS);

  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [adminAuthorized, setAdminAuthorized] = useState<boolean>(false);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);


  // Load from localStorage on mount and sync with Firestore if configured
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('port_profile');
      if (storedProfile) setProfileState(JSON.parse(storedProfile));

      const storedSections = localStorage.getItem('port_sections');
      if (storedSections) {
        const parsed = JSON.parse(storedSections);
        if (parsed.home === 'Home & About Me') {
          parsed.home = 'About Me';
          try {
            localStorage.setItem('port_sections', JSON.stringify(parsed));
          } catch (e) {}
        }
        setSectionsState(parsed);
      }

      const storedProjects = localStorage.getItem('port_projects');
      if (storedProjects) setProjectsState(JSON.parse(storedProjects));

      const storedTechs = localStorage.getItem('port_techs');
      if (storedTechs) setTechnologiesState(JSON.parse(storedTechs));

      const storedCerts = localStorage.getItem('port_certs');
      if (storedCerts) setCertificatesState(JSON.parse(storedCerts));

      const storedHacks = localStorage.getItem('port_hacks');
      if (storedHacks) setHackathonsState(JSON.parse(storedHacks));

      const storedExps = localStorage.getItem('port_exps');
      if (storedExps) setExperiencesState(JSON.parse(storedExps));

      const storedEdus = localStorage.getItem('port_edus');
      if (storedEdus) setEducationsState(JSON.parse(storedEdus));

      const storedPass = localStorage.getItem('port_pass');
      if (storedPass) setAdminPasswordState(storedPass);

      const storedCodeword = localStorage.getItem('port_codeword');
      if (storedCodeword) setAdminCodewordState(storedCodeword);

      const storedSocials = localStorage.getItem('port_socials');
      if (storedSocials) setSocialsState(JSON.parse(storedSocials));
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }

    if (!isFirebaseConfigured) return;

    // Real-time Firestore subscriptions with error callbacks
    const handleSyncError = (err: any) => {
      setFirestoreError(err.message || String(err));
    };

    const unsubscribes = [
      subscribeToFirestore('profile', (data) => {
        if (data) {
          setProfileState(data as Profile);
          localStorage.setItem('port_profile', JSON.stringify(data));
        }
      }, handleSyncError),
      subscribeToFirestore('sections', (data) => {
        if (data) {
          setSectionsState(data as Sections);
          localStorage.setItem('port_sections', JSON.stringify(data));
        }
      }, handleSyncError),
      subscribeToFirestore('projects', (data) => {
        if (data && data.list) {
          setProjectsState(data.list as Project[]);
          localStorage.setItem('port_projects', JSON.stringify(data.list));
        }
      }, handleSyncError),
      subscribeToFirestore('technologies', (data) => {
        if (data && data.list) {
          setTechnologiesState(data.list as Technology[]);
          localStorage.setItem('port_techs', JSON.stringify(data.list));
        }
      }, handleSyncError),
      subscribeToFirestore('certificates', (data) => {
        if (data && data.list) {
          setCertificatesState(data.list as Certificate[]);
          localStorage.setItem('port_certs', JSON.stringify(data.list));
        }
      }, handleSyncError),
      subscribeToFirestore('hackathons', (data) => {
        if (data && data.list) {
          setHackathonsState(data.list as Hackathon[]);
          localStorage.setItem('port_hacks', JSON.stringify(data.list));
        }
      }, handleSyncError),
      subscribeToFirestore('experiences', (data) => {
        if (data && data.list) {
          setExperiencesState(data.list as Experience[]);
          localStorage.setItem('port_exps', JSON.stringify(data.list));
        }
      }, handleSyncError),
      subscribeToFirestore('educations', (data) => {
        if (data && data.list) {
          setEducationsState(data.list as Education[]);
          localStorage.setItem('port_edus', JSON.stringify(data.list));
        }
      }, handleSyncError),
      subscribeToFirestore('socials', (data) => {
        if (data && data.list) {
          setSocialsState(data.list as SocialAccount[]);
          localStorage.setItem('port_socials', JSON.stringify(data.list));
        }
      }, handleSyncError),
    ];

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, []);

  // Save to localStorage and Firestore whenever state changes
  const setProfile = (newVal: Profile) => {
    setProfileState(newVal);
    localStorage.setItem('port_profile', JSON.stringify(newVal));
    if (isFirebaseConfigured) {
      saveToFirestore('profile', newVal);
    }
  };

  const setSections = (newVal: Sections) => {
    setSectionsState(newVal);
    localStorage.setItem('port_sections', JSON.stringify(newVal));
    if (isFirebaseConfigured) {
      saveToFirestore('sections', newVal);
    }
  };

  const setProjects = (newVal: Project[]) => {
    setProjectsState(newVal);
    localStorage.setItem('port_projects', JSON.stringify(newVal));
    if (isFirebaseConfigured) {
      saveToFirestore('projects', { list: newVal });
    }
  };

  const setTechnologies = (newVal: Technology[]) => {
    setTechnologiesState(newVal);
    localStorage.setItem('port_techs', JSON.stringify(newVal));
    if (isFirebaseConfigured) {
      saveToFirestore('technologies', { list: newVal });
    }
  };

  const setCertificates = (newVal: Certificate[]) => {
    setCertificatesState(newVal);
    localStorage.setItem('port_certs', JSON.stringify(newVal));
    if (isFirebaseConfigured) {
      saveToFirestore('certificates', { list: newVal });
    }
  };

  const setHackathons = (newVal: Hackathon[]) => {
    setHackathonsState(newVal);
    localStorage.setItem('port_hacks', JSON.stringify(newVal));
    if (isFirebaseConfigured) {
      saveToFirestore('hackathons', { list: newVal });
    }
  };

  const setExperiences = (newVal: Experience[]) => {
    setExperiencesState(newVal);
    localStorage.setItem('port_exps', JSON.stringify(newVal));
    if (isFirebaseConfigured) {
      saveToFirestore('experiences', { list: newVal });
    }
  };

  const setEducations = (newVal: Education[]) => {
    setEducationsState(newVal);
    localStorage.setItem('port_edus', JSON.stringify(newVal));
    if (isFirebaseConfigured) {
      saveToFirestore('educations', { list: newVal });
    }
  };

  const setAdminPassword = (newVal: string) => {
    setAdminPasswordState(newVal);
    localStorage.setItem('port_pass', newVal);
    if (isFirebaseConfigured) {
      saveToFirestore('settings', { adminPassword: newVal, adminCodeword });
    }
  };

  const setAdminCodeword = (newVal: string) => {
    setAdminCodewordState(newVal);
    localStorage.setItem('port_codeword', newVal);
    if (isFirebaseConfigured) {
      saveToFirestore('settings', { adminPassword, adminCodeword: newVal });
    }
  };

  const setSocials = (newVal: SocialAccount[]) => {
    setSocialsState(newVal);
    localStorage.setItem('port_socials', JSON.stringify(newVal));
    if (isFirebaseConfigured) {
      saveToFirestore('socials', { list: newVal });
    }
  };

  const resetToDefault = () => {
    setProfile(DEFAULT_PROFILE);
    setSections(DEFAULT_SECTIONS);
    setProjects(PROJECTS);
    setTechnologies(TECHNOLOGIES);
    setCertificates(CERTIFICATES);
    setHackathons(HACKATHONS);
    setExperiences(EXPERIENCES);
    setEducations(EDUCATIONS);
    setAdminPassword(DEFAULT_PASSWORD);
    setAdminCodeword(DEFAULT_CODEWORD);
    setSocials(DEFAULT_SOCIALS);
  };

  return (
    <PortfolioContext.Provider value={{
      profile,
      sections,
      projects,
      technologies,
      certificates,
      hackathons,
      experiences,
      educations,
      adminPassword,
      adminCodeword,
      showAdmin,
      socials,
      setSocials,
      setShowAdmin,
      adminAuthorized,
      setAdminAuthorized,
      setProfile,
      setSections,
      setProjects,
      setTechnologies,
      setCertificates,
      setHackathons,
      setExperiences,
      setEducations,
      setAdminPassword,
      setAdminCodeword,
      resetToDefault,
      firestoreError,
      setFirestoreError
    }}>

      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
