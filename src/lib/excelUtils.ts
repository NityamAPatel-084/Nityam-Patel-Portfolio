import { Project, Certificate, Technology, Hackathon, Experience, Education } from '../types';

// Helper to generate unique ID
const genId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

// ─── CSV Helpers ──────────────────────────────────────────────────────────────

/** Escapes a cell value for CSV output */
function csvCell(val: any): string {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Converts an array of objects to a CSV string */
function toCsv(rows: Record<string, any>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.map(csvCell).join(',')];
  for (const row of rows) {
    lines.push(headers.map(h => csvCell(row[h])).join(','));
  }
  return lines.join('\n');
}

/** Triggers a browser download of a CSV file */
function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Parses a CSV string into an array of row objects */
function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  const parseRow = (line: string): string[] => {
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        cells.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    cells.push(current);
    return cells;
  };

  const headers = parseRow(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseRow(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
    return row;
  });
}

/** Reads a File and returns its text content */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('File reading error'));
    reader.readAsText(file);
  });
}

// ─── 1. Projects ─────────────────────────────────────────────────────────────

export const downloadProjectsTemplate = () => {
  const data = [{
    'project title/key': 'QUANTUM_FLOW_VIZ',
    'project serial ID': 'VFX-F.88',
    'Client Name': 'COGNITIVE LABS',
    'Timeline/Year': '2026',
    'Status Node': 'STABLE_REL',
    'Category': 'websites',
    'summary description': 'A real-time visual sandbox for neural weight mapping.',
    'Detailed Narrative': 'Developed a high performance canvas simulation...',
    'Tech stack tags (comma separated)': 'REACT | THREEJS | WEBAUDIO | RUST',
    'External Live website link': 'https://quantum-flow.nityam.me',
    'Thumbnail Image': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  }];
  downloadCsv('portfolio_projects_template.csv', toCsv(data));
};

export const parseProjectsExcel = async (file: File): Promise<Project[]> => {
  const text = await readFileAsText(file);
  const rows = parseCsv(text);
  return rows.map((row, idx) => ({
    id: genId('proj'),
    title: (row['project title/key'] || `PROJECT_${idx + 1}`).toUpperCase().replace(/\s+/g, '_'),
    serial: row['project serial ID'] || `PRJ-${idx + 1}`,
    client: row['Client Name'] || undefined,
    year: row['Timeline/Year'] || new Date().getFullYear().toString(),
    status: (row['Status Node'] || 'ACTIVE_STATE') as any,
    category: (row['Category'] || 'websites') as any,
    description: row['summary description'] || '',
    details: row['Detailed Narrative'] || undefined,
    tags: row['Tech stack tags (comma separated)']
      ? row['Tech stack tags (comma separated)'].split('|').map(t => t.trim().toUpperCase()).filter(Boolean)
      : [],
    link: row['External Live website link'] || undefined,
    imageUrl: row['Thumbnail Image'] || undefined,
  }));
};

// ─── 2. Certificates ─────────────────────────────────────────────────────────

export const downloadCertsTemplate = () => {
  const data = [{
    'certificate title': 'CLOUD_COSMOLOGY_ARCHITECT',
    'Issuer Academy': 'Google Cloud Academy',
    'Verification Date': '2026-05-15',
    'Credential Serial ID': 'GCP-9482-COSMO',
    'Clearance Status': 'VERIFIED',
    'Certificate URL/PDF': 'https://example.com/certificates/cosmo.pdf',
  }];
  downloadCsv('portfolio_certificates_template.csv', toCsv(data));
};

export const parseCertsExcel = async (file: File): Promise<Certificate[]> => {
  const text = await readFileAsText(file);
  const rows = parseCsv(text);
  return rows.map((row, idx) => ({
    id: genId('cert'),
    title: (row['certificate title'] || `CERTIFICATION_${idx + 1}`).toUpperCase().replace(/\s+/g, '_'),
    issuer: row['Issuer Academy'] || 'Unknown Academy',
    date: row['Verification Date'] || new Date().toISOString().split('T')[0],
    credentialId: row['Credential Serial ID'] || undefined,
    credentialUrl: row['Certificate URL/PDF'] || undefined,
    status: (row['Clearance Status'] || 'VERIFIED') as any,
  }));
};

// ─── 3. Hackathons ────────────────────────────────────────────────────────────

export const downloadHacksTemplate = () => {
  const data = [{
    'Hackathon Title': 'SYNAPSE_AI_GLOBAL_HACK',
    'Placement/Award': '1ST_PLACE_GOLD',
    'Year': '2026',
    'Location': 'San Francisco, CA (Hybrid)',
    'Summary Description': 'Engineered a low-latency neural audio rendering module...',
    'Tech stack tags (comma separated)': 'RUST | WASM | NEXTJS | TAILWIND',
    'Winning Certificate URL': 'https://example.com/hacks/winning.pdf',
    'Participation Certificate URL': 'https://example.com/hacks/participation.pdf',
  }];
  downloadCsv('portfolio_hackathons_template.csv', toCsv(data));
};

export const parseHacksExcel = async (file: File): Promise<Hackathon[]> => {
  const text = await readFileAsText(file);
  const rows = parseCsv(text);
  return rows.map((row, idx) => ({
    id: genId('hack'),
    title: (row['Hackathon Title'] || `HACKATHON_${idx + 1}`).toUpperCase().replace(/\s+/g, '_'),
    position: (row['Placement/Award'] || 'PARTICIPANT').toUpperCase().replace(/\s+/g, '_'),
    year: row['Year'] || new Date().getFullYear().toString(),
    location: row['Location'] || 'Online',
    description: row['Summary Description'] || '',
    tags: row['Tech stack tags (comma separated)']
      ? row['Tech stack tags (comma separated)'].split('|').map(t => t.trim().toUpperCase()).filter(Boolean)
      : [],
    winningCertUrl: row['Winning Certificate URL'] || undefined,
    participationCertUrl: row['Participation Certificate URL'] || undefined,
  }));
};

// ─── 4. Skills ────────────────────────────────────────────────────────────────

export const downloadSkillsTemplate = () => {
  const data = [{
    'Skill Name': 'React / Next.js',
    'Category': 'Frontend',
    'Proficiency (0-100)': '95',
    'Status': 'MASTERED',
    'Performance Metric': '4.2 ms layout draw',
  }];
  downloadCsv('portfolio_skills_template.csv', toCsv(data));
};

export const parseSkillsExcel = async (file: File): Promise<Technology[]> => {
  const text = await readFileAsText(file);
  const rows = parseCsv(text);
  return rows.map((row, idx) => ({
    name: row['Skill Name'] || `Skill ${idx + 1}`,
    category: (row['Category'] || 'Frontend') as any,
    proficiency: Number(row['Proficiency (0-100)'] || 80),
    status: row['Status'] || 'ACTIVE',
    metric: row['Performance Metric'] || '',
  }));
};

// ─── 5. Experience ────────────────────────────────────────────────────────────

export const downloadExperienceTemplate = () => {
  const data = [{
    'Role Title': 'SENIOR SYSTEM ARCHITECT',
    'Company': 'Quantum Core Labs',
    'Employment Period': '2025 - PRESENT',
    'Summary Description': 'Lead architect in designing ultra low-latency portfolio state syncer nodes.',
    'Bullets (pipe separated)': 'Engineered multi-threaded state synchronization pipeline | Deployed visual telemetry on GCP | Mentored 5 junior developers',
    'Status': 'ACTIVE_UPLINK',
  }];
  downloadCsv('portfolio_experience_template.csv', toCsv(data));
};

export const parseExperienceExcel = async (file: File): Promise<Experience[]> => {
  const text = await readFileAsText(file);
  const rows = parseCsv(text);
  return rows.map((row, idx) => ({
    id: genId('exp'),
    role: row['Role Title'] || `Role ${idx + 1}`,
    company: row['Company'] || 'Unknown Corp',
    period: row['Employment Period'] || '2024 - Present',
    description: row['Summary Description'] || '',
    bullets: row['Bullets (pipe separated)']
      ? row['Bullets (pipe separated)'].split('|').map(b => b.trim()).filter(Boolean)
      : [],
    status: row['Status'] || 'ACTIVE_UPLINK',
  }));
};

// ─── 6. Education ─────────────────────────────────────────────────────────────

export const downloadEducationTemplate = () => {
  const data = [{
    'Degree Level': 'B.S. COMPUTER SCIENCE & DESIGN',
    'Institution': 'Massachusetts Institute of Technology',
    'Study Period': '2022 - 2026',
    'Grade/GPA': '3.98/4.00 GPA',
    'Details': 'Specialization in Interactive Systems and High Performance Graphics.',
  }];
  downloadCsv('portfolio_education_template.csv', toCsv(data));
};

export const parseEducationExcel = async (file: File): Promise<Education[]> => {
  const text = await readFileAsText(file);
  const rows = parseCsv(text);
  return rows.map((row, idx) => ({
    id: genId('edu'),
    degree: row['Degree Level'] || `Degree ${idx + 1}`,
    institution: row['Institution'] || 'Unknown University',
    period: row['Study Period'] || '2020 - 2024',
    grade: row['Grade/GPA'] || undefined,
    details: row['Details'] || '',
  }));
};
