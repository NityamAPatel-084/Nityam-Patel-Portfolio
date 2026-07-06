export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  year: string;
  status: 'ACTIVE_STATE' | 'STABLE_REL' | 'OPTIMIZING' | 'DEPRECATED';
  category: 'websites' | 'installations' | 'xr-vr-ai' | 'multiplayer' | 'games';
  serial: string;
  client?: string;
  videoUrl?: string;
  imageUrl?: string;
  link?: string;
  details?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  status: 'VERIFIED' | 'COMPLETED';
}

export interface Technology {
  name: string;
  category: 'Languages' | 'Frontend' | 'AI / Neural' | 'Infrastructure' | 'Creative Tech';
  proficiency: number; // 0-100
  status: string; // e.g. "ACTIVE", "EXPLORING", "MASTERED"
  metric: string; // e.g. "2.4 ms avg", "98.4% accuracy"
}

export interface Hackathon {
  id: string;
  title: string;
  position: string;
  year: string;
  description: string;
  tags: string[];
  location: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  bullets: string[];
  status: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade?: string;
  details: string;
}

export interface SocialAccount {
  id: string;
  platform: string;
  url: string;
}
