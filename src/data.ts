import { Project, Certificate, Technology, Hackathon, Experience, Education } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'neural-synapse-core',
    title: 'NEURAL_SYNAPSE_CORE',
    description: 'A decentralized AI operating system designed for edge computing clusters. Handles real-time inference across 50+ neural nodes, coordinating high-performance AI logic.',
    tags: ['PYTORCH', 'RUST', 'WEBGL'],
    year: '2023 - 2024',
    status: 'ACTIVE_STATE',
    category: 'xr-vr-ai',
    serial: 'CORE-V.01',
    client: 'U.S. AIRFORCE / GAME',
    details: 'A hyper-optimized AI agent orchestration system that uses zero-cost abstractions in Rust to schedule, balance, and distribute inference tasks dynamically over high-performance visual clusters.'
  },
  {
    id: 'void-mesh-gateway',
    title: 'VOID_MESH_GATEWAY',
    description: 'Ultra-low latency API gateway and visualization tool for high-throughput stream computing. Handles multi-gigabit financial and spatial data telemetry.',
    tags: ['GO', 'KAFKA', 'D3.JS'],
    year: '2022',
    status: 'STABLE_REL',
    category: 'multiplayer',
    serial: 'NET-M.72',
    client: 'IBM RESEARCH',
    details: 'An enterprise-grade high-availability proxy and messaging hub capable of processing 1M+ transactions per second, paired with real-time web-socket monitoring graphics.'
  },
  {
    id: 'quantum-flow-viz',
    title: 'QUANTUM_FLOW_VIZ',
    description: 'Real-time interactive particle simulation engine for visualizing complex high-dimensional dataset relationships in 3D web spaces.',
    tags: ['THREE.JS', 'GLSL', 'REACT'],
    year: '2024',
    status: 'OPTIMIZING',
    category: 'websites',
    serial: 'VFX-F.88',
    client: 'COGNITIVE LABS',
    details: 'A custom WebGL canvas implementation that executes custom vertex and fragment shaders to coordinate 500k+ independent gravitational forces reacting to sound, mouse movement, and touchscreen inputs.'
  },
  {
    id: 'google-racer',
    title: 'GOOGLE_RACER',
    description: 'An interactive multi-device slot racing game built for Google Chrome. Synchronizes high-speed WebGL canvas render pipelines across multiple physical mobile screens placed side by side.',
    tags: ['WEBGL', 'SOCKET.IO', 'HTML5 CANVAS'],
    year: '2021',
    status: 'STABLE_REL',
    category: 'multiplayer',
    serial: 'GOOG-R.10',
    client: 'GOOGLE CREATIVE LAB',
    details: 'A revolutionary chrome experiment leveraging low-latency WebSockets to allow users to build custom physical racetracks using up to 12 mobile phones and drive virtual cars seamlessly across screens.'
  },
  {
    id: 'frontier-within',
    title: 'THE_FRONTIER_WITHIN',
    description: 'An immersive digital physical installation capturing biometric telemetry—circulatory, respiratory, and nervous system frequencies—transforming it into a living WebGL portrait.',
    tags: ['BIOMETRICS', 'GLSL', 'NODE.JS'],
    year: '2019',
    status: 'STABLE_REL',
    category: 'installations',
    serial: 'INST-F.09',
    client: 'THORNE HEALTHCARE',
    details: 'Transforms discrete pulse and respiration inputs into real-time fluid dynamic particle renderings on giant LED screens. Built for sensory therapy and creative experience showrooms.'
  },
  {
    id: 'patronus-experience',
    title: 'DISCOVER_YOUR_PATRONUS',
    description: 'An immersive voice-activated 3D WebGL quest where Potterheads explore a mystical forest to conjure their custom 3D Patronus companion with reactive ambient music.',
    tags: ['THREE.JS', 'WEB AUDIO API', 'GLSL'],
    year: '2022',
    status: 'ACTIVE_STATE',
    category: 'xr-vr-ai',
    serial: 'HP-P.39',
    client: 'WARNER BROS',
    details: 'A cinematic browser encounter featuring a customized three-dimensional audio layout, reactive lighting shaders, and a complex physics simulation of particle energy trails.'
  },
  {
    id: 'kandinsky-music',
    title: 'KANDINSKY_PLAYGROUND',
    description: 'Creative tool that translates brush strokes on a digital canvas into rich synth-driven music. Part of Chrome Music Lab, designed for tactile learning and artistic synthesis.',
    tags: ['HTML5 CANVAS', 'TONE.JS', 'VUE'],
    year: '2020',
    status: 'ACTIVE_STATE',
    category: 'installations',
    serial: 'MUSIC-K.02',
    client: 'GOOGLE CREATIVE LAB',
    details: 'Leverages neural handwriting classification in the browser to recognize circles, triangles, and lines, and generates proportional sound frequencies in real-time.'
  },
  {
    id: 'ibm-harmonic-state',
    title: 'HARMONIC_STATE',
    description: 'A responsive full-dome physical installation combining IBM Watson speech analytics with high-fidelity interactive particles reflecting team emotional resonance.',
    tags: ['WATSON API', 'THREE.JS', 'WEBSOCKETS'],
    year: '2023',
    status: 'STABLE_REL',
    category: 'xr-vr-ai',
    serial: 'IBM-H.41',
    client: 'IBM WATSON',
    details: 'Analyzes live mic streams for emotional tone indicators, translating them into dynamic color palettes, gravity forces, and volumetric structures mapped in real-time.'
  }
];

export const CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    title: 'ADVANCED_CREATIVE_CODING_&_VFX_SHADERS',
    issuer: 'THE ACADEMY OF INTERACTIVE ARTS',
    date: '2024-03-12',
    credentialId: 'VFX-9382-7711',
    status: 'VERIFIED'
  },
  {
    id: 'cert-2',
    title: 'RUST_SYSTEMS_ENGINEERING_&_WebASSEMBLY',
    issuer: 'RUST FOUNDATION CERTIFIED ACADEMY',
    date: '2023-11-05',
    credentialId: 'SYS-5541-0021',
    status: 'VERIFIED'
  },
  {
    id: 'cert-3',
    title: 'DEEP_LEARNING_&_NEURAL_NETWORKS',
    issuer: 'STANFORD ONLINE / DEEPLEARNING.AI',
    date: '2023-05-18',
    credentialId: 'AI-2094-8821',
    status: 'COMPLETED'
  },
  {
    id: 'cert-4',
    title: 'GOOGLE_DEVELOPER_EXPERT_&_WEB_VFX',
    issuer: 'GOOGLE DEVELOPER GROUPS',
    date: '2022-08-30',
    credentialId: 'GDE-WEB-7362',
    status: 'VERIFIED'
  }
];

export const TECHNOLOGIES: Technology[] = [
  { name: 'TypeScript / JS', category: 'Languages', proficiency: 98, status: 'MASTERED', metric: '0.12 ms compilation' },
  { name: 'Rust', category: 'Languages', proficiency: 88, status: 'ACTIVE', metric: 'Zero-cost memory safety' },
  { name: 'Go', category: 'Languages', proficiency: 85, status: 'ACTIVE', metric: '6.4 ms garbage cycles' },
  { name: 'Python', category: 'Languages', proficiency: 90, status: 'MASTERED', metric: 'Optimized neural bindings' },
  
  { name: 'React / Next.js', category: 'Frontend', proficiency: 97, status: 'MASTERED', metric: '98% Lighthouse performance' },
  { name: 'Three.js / WebGL', category: 'Creative Tech', proficiency: 95, status: 'MASTERED', metric: '60 FPS stable renders' },
  { name: 'GLSL Shaders', category: 'Creative Tech', proficiency: 92, status: 'MASTERED', metric: 'GPU accelerated vertices' },
  { name: 'HTML5 Canvas', category: 'Creative Tech', proficiency: 98, status: 'MASTERED', metric: 'Pixel-level manipulation' },

  { name: 'TensorFlow / PyTorch', category: 'AI / Neural', proficiency: 82, status: 'EXPLORING', metric: '94% validation accuracy' },
  { name: 'Gemini AI SDK', category: 'AI / Neural', proficiency: 94, status: 'ACTIVE', metric: 'Real-time agentic context' },
  { name: 'WebSockets', category: 'Infrastructure', proficiency: 96, status: 'MASTERED', metric: '3.1 ms ping stability' },
  { name: 'Docker & Kubernetes', category: 'Infrastructure', proficiency: 80, status: 'ACTIVE', metric: 'Immutable micro-containers' }
];

export const HACKATHONS: Hackathon[] = [
  {
    id: 'hack-1',
    title: 'ETH_GLOBAL_HACK_V3',
    position: '1ST_PLACE_GOLD',
    year: '2024',
    description: 'Architected and built a high-speed interactive multi-chain visualization tool featuring complex WebGL graph node rendering.',
    tags: ['REACT', 'THREE.JS', 'WEB3'],
    location: 'SAN FRANCISCO, CA'
  },
  {
    id: 'hack-2',
    title: 'GOOGLE_CREATIVE_SANDBOX',
    position: 'BEST_INTERACTIVE_VFX',
    year: '2023',
    description: 'Designed a tactile projection-mapped sound board using a web interface paired with real-time audio analysis and local socket servers.',
    tags: ['WEB AUDIO API', 'GLSL', 'NODE.JS'],
    location: 'MOUNTAN VIEW, CA'
  },
  {
    id: 'hack-3',
    title: 'NEURAL_SYSTEMS_HACK',
    position: '2ND_PLACE_OVERALL',
    year: '2022',
    description: 'Developed an edge-based cognitive interface utilizing browser WebAssembly execution to model synaptic propagation in real time.',
    tags: ['WASM', 'RUST', 'REACT'],
    location: 'AUSTIN, TX'
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    role: 'CHIEF_CREATIVE_ENGINEER',
    company: 'COGNITIVE LABS / VFX DEPT',
    period: '2023 - PRESENT',
    description: 'Pioneering sensory digital interfaces and high-performance immersive WebGL software suites for enterprise cognitive analytics.',
    bullets: [
      'Engineered an custom WebGL graphics pipeline supporting 1,000,000+ interactive particles at a stable 60 frames per second.',
      'Designed micro-circuitry UI templates with glassmorphic depth, reducing render layouts shifts and boosting engagement by 45%.',
      'Architected AI-powered real-time sensory grounding dashboards leveraging server-side Gemini endpoints.'
    ],
    status: 'ACTIVE_UPLINK'
  },
  {
    id: 'exp-2',
    role: 'SENIOR_INTERACTIVE_VFX_DEVELOPER',
    company: 'SYNAPTIC DIGITAL SYSTEMS',
    period: '2021 - 2023',
    description: 'Formulated visual strategies, immersive web campaigns, and modular component architectures using high-tech aesthetic frameworks.',
    bullets: [
      'Developed and deployed over 12 high-end web experiences utilizing custom GLSL shader pipelines and Tone.js sound synthesis.',
      'Reduced initial web loading overhead by 40% through strict code-splitting, texture optimization, and lazy asset allocation.',
      'Mentored 6 front-end engineers in math-based animation, coordinate transformations, and responsive CSS grids.'
    ],
    status: 'COMPLETED_MISSION'
  },
  {
    id: 'exp-3',
    role: 'CREATIVE_TECHNOLOGY_INTERN',
    company: 'ACTIVE ARCHITECTS STUDIO',
    period: '2020 - 2021',
    description: 'Assisted in designing prototypes, experimental installations, and tactile web tools for hardware integrations.',
    bullets: [
      'Constructed responsive HTML5 interactive canvas simulations for ambient data visualizations.',
      'Configured local development socket routers and automated script modules to accelerate physical system setup steps.'
    ],
    status: 'COMPLETED_MISSION'
  }
];

export const EDUCATIONS: Education[] = [
  {
    id: 'edu-1',
    degree: 'B.S. COMPUTER SCIENCE & INTERACTIVE COMPUTATION',
    institution: 'MASS INSTITUTE OF COGNITIVE DESIGN',
    period: '2017 - 2021',
    grade: 'GPA: 3.96 / 4.00',
    details: 'Specialization in Computer Graphics, Human-Computer Interaction, and Neural Computation. Recipient of Creative Excellence Scholarship.'
  }
];
