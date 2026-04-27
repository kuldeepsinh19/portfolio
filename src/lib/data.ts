export const me = {
  name: 'Kuldeepsinh Rajput',
  title: 'Backend & Agentic AI Engineer',
  location: 'Ahmedabad, India',
  experience: '3+ years',
  focus: 'Backend · AI · Cloud',
  scale: '2M+ users served',
  status: 'Available for opportunities',
  phone: '+91 91046 24966',
  email: 'kuldeepsinhrajput1919@gmail.com',
  linkedin: 'https://www.linkedin.com/in/kuldeepsinh-rajput-7089a8240/',
  github: 'https://github.com/kuldeepsinh19',
};

export const experiences = [
  {
    company: 'Avesta HQ',
    role: 'Backend & Agentic AI Developer',
    period: 'Jan 2024 – Present',
    type: 'full-time',
    bullets: [
      'Maintained AI-integrated backend for view.com.au — serving 2M+ users across 10+ repositories and 8 Node.js / TypeScript microservices',
      'Architected a production multi-agent AI orchestration system on a legacy codebase with SPEC-driven workflow (analyze → plan → implement → test), cutting feature delivery time by 70%',
      'Built RAG pipelines with vector-indexed retrieval over 100K+ LOC via OpenSearch for accurate, context-aware code generation',
      'Optimised REST API response times by 30% via multi-layer caching and OpenSearch multi-search; validated at 10K concurrent users via k6; designed AWS Lambda pipelines (SFMC triggers) cutting dispatch latency by 40%',
      'Built 3 internal npm packages (HTTP client, DB adapter, OpenSearch wrapper) across all 8 microservices cutting duplicated code by 60%; contributed to Zeus core backend and SEO-safe reverse proxy system',
    ],
  },
  {
    company: 'Avesta HQ',
    role: 'Backend Engineer Intern',
    period: 'Jul 2023 – Dec 2023',
    type: 'internship',
    bullets: [
      'Built RESTful APIs and microservices in Node.js / TypeScript across AWS services (Cognito, S3, RDS, Lambda) within a Clean Architecture codebase',
      'Implemented database operations, service integrations, and backend improvements for a real estate platform managing property listings',
      'Participated in full feature delivery from technical specification to production deployment',
    ],
  },
];

export const projects = [
  {
    name: 'Zinnova',
    desc: 'Solo-built Generative AI marketing SaaS — full-stack (Node.js + Next.js) on AWS, architected to serve 5,000+ concurrent users with OAuth2/JWT auth and Razorpay payments. Google Gemini + Vertex AI power AI content and image generation, reducing manual content work by 70%. 99.9% uptime design with auto-scaling serverless infrastructure.',
    tags: ['Node.js', 'Next.js', 'LangChain', 'LangGraph', 'AWS', 'Gemini', 'Vertex AI', 'Razorpay'],
    url: 'https://zinnova.in',
  },
  {
    name: 'view.com.au',
    desc: 'High-traffic Australian real estate platform — maintained AI-integrated backend serving 2M+ users across 10+ repositories and 8 microservices. Optimised API response times by 30% via multi-layer caching and OpenSearch multi-search, built 3 reusable internal npm packages, and architected serverless event-driven pipelines cutting dispatch latency by 40%.',
    tags: ['Node.js', 'TypeScript', 'AWS', 'OpenSearch', 'Microservices', 'LangChain', 'LangGraph'],
    url: 'https://view.com.au',
  },
  {
    name: 'Orchestrator AI Dev System',
    desc: 'Internal multi-agent system driving the full dev lifecycle — from requirement analysis and architecture planning to code implementation and test generation. RAG pipelines with vector-indexed semantic search over 100K+ LOC via OpenSearch; pageIndex-based vectorless retrieval as an alternative. Achieved 70% reduction in feature delivery time on a brownfield production codebase.',
    tags: ['Node.js', 'LangChain', 'LangGraph', 'RAG', 'OpenSearch', 'Agentic AI'],
    url: null,
  },
  {
    name: 'Mitansh Interiors',
    desc: 'Business website — responsive, cloud deployed, production ready',
    tags: ['React.js', 'Next.js'],
    url: 'https://mitanshinteriors.com',
  },
  {
    name: 'Aristo Cafe Restro',
    desc: 'Restaurant website — full-stack, Node.js backend, brand-accurate UI',
    tags: ['React.js', 'Next.js', 'Node.js'],
    url: 'https://aristocaferestro.com',
  },
];

export const certifications = [
  {
    title: 'AWS Agentic AI Demonstrated',
    issuer: 'AWS Training & Certification',
    date: 'Apr 25, 2026',
    url: 'https://www.credly.com/badges/976d464d-d22c-4245-a9fd-65e8e90c0a64/public_url',
  },
  {
    title: 'Introduction to Agent Skills',
    issuer: 'Anthropic',
    date: '2026',
    url: 'https://verify.skilljar.com/c/dcn5safu5vnw',
  },
  {
    title: 'Claude Code in Action',
    issuer: 'Anthropic',
    date: '2026',
    url: 'https://verify.skilljar.com/c/nsh5ioskjjf5',
  },
];

export const skills = [
  { name: 'Node.js / TypeScript', level: 95, years: '3yr' },
  { name: 'AWS (Lambda / ECS / SQS)', level: 88, years: '2yr' },
  { name: 'REST API Design', level: 92, years: '3yr' },
  { name: 'Microservices / EDA', level: 85, years: '2yr' },
  { name: 'LangChain / LangGraph', level: 85, years: '1yr' },
  { name: 'RAG / LLM Integration', level: 82, years: '1yr' },
  { name: 'OpenSearch / MySQL', level: 80, years: '2yr' },
  { name: 'Docker / CI/CD', level: 78, years: '2yr' },
  { name: 'React.js / Next.js', level: 72, years: '2yr' },
];
