import type { Certification, Experience } from './types';

export const me = {
  name: 'Kuldeepsinh Rajput',
  title: 'Backend Engineer',
  role: 'Backend Engineer | Agentic AI & Software Engineering',
  location: 'Ahmedabad, India',
  experience: '3+ years',
  status: 'Available for opportunities',
  phone: '+91 91046 24966',
  email: 'kuldeepsinhrajput1919@gmail.com',
  linkedin: 'https://www.linkedin.com/in/kuldeepsinh-rajput-7089a8240/',
  github: 'https://github.com/kuldeepsinh19',
  site: 'https://portfolio-xi-eight-000yuu2s96.vercel.app',
  positioning:
    'I build scalable backend systems and engineer AI-powered workflows that help teams investigate issues, automate engineering operations, and deliver software.',
  techSummary: ['Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'AI Agents', 'MCP', 'Distributed Systems'],
};

export const hero = {
  headline: ['I Build Backend Systems.', 'I Engineer AI Workflows.'],
  intro: [
    "I'm a Backend Engineer specializing in Node.js, TypeScript, cloud infrastructure, and agentic AI systems.",
    'I build scalable SaaS platforms, design reliable backend architectures, and integrate AI agents into real-world engineering workflows — from customer issue investigation and production debugging to automated pull request creation.',
  ],
};

export const about = {
  title: 'Engineering beyond the code',
  paragraphs: [
    'My engineering journey has evolved from building backend APIs and SaaS applications to designing AI-powered systems that participate in real engineering workflows.',
    'I work across backend architecture, cloud infrastructure, database design and AI integrations. Alongside building product features, I’ve worked on agentic workflows using Hermes Agent and Capy, connecting AI systems with tools such as Slack, GitHub, Sentry and Supabase.',
    'I enjoy solving complex engineering problems, understanding how systems behave, and finding practical ways to improve how software is built, tested and operated.',
  ],
  principle: 'Build reliable systems, make intelligent use of AI, and focus on meaningful engineering outcomes.',
};

/**
 * Headline numbers. Every value here must be verifiable:
 * - 100+ PRs: confirmed count of pull requests opened by Capy.
 * - 2M+ / 3+ years: from my employment record (see experience below).
 * - 4 tools: Slack, GitHub, Sentry, Supabase connected to agents.
 */
export const metrics = [
  { value: '100+', label: 'Pull requests created by Capy in workflows I configured' },
  { value: '2M+', label: 'Users on the platform whose backend I maintain' },
  { value: '4', label: 'Engineering tools connected to agents — Slack, GitHub, Sentry, Supabase' },
  { value: '3+', label: 'Years of backend engineering' },
];

export const experiences: Experience[] = [
  {
    company: 'Avesta HQ',
    role: 'Backend & Agentic AI Developer',
    period: 'Jan 2024 – Present',
    type: 'full-time',
    summary:
      'Backend engineering for view.com.au, a high-traffic Australian real estate platform, and the agentic tooling the team uses to build it.',
    bullets: [
      'Maintain the AI-integrated backend for view.com.au — 2M+ users, 10+ repositories and 8 Node.js / TypeScript microservices.',
      'Architected a multi-agent development system on a legacy codebase with a SPEC-driven workflow (analyse → plan → implement → test), cutting feature delivery time by 70%.',
      'Built RAG pipelines with vector-indexed retrieval over 100K+ LOC in OpenSearch for context-aware code generation.',
      'Cut REST API response times by 30% with multi-layer caching and OpenSearch multi-search, validated at 10K concurrent users with k6.',
      'Designed AWS Lambda pipelines for SFMC triggers, cutting dispatch latency by 40%.',
      'Built 3 internal npm packages (HTTP client, DB adapter, OpenSearch wrapper) used across all 8 microservices, removing 60% of duplicated code; contributed to the Zeus core backend and an SEO-safe reverse proxy.',
    ],
  },
  {
    company: 'Avesta HQ',
    role: 'Backend Engineer Intern',
    period: 'Jul 2023 – Dec 2023',
    type: 'internship',
    summary: 'Started on the same real estate platform, inside a Clean Architecture Node.js codebase.',
    bullets: [
      'Built REST APIs and microservices in Node.js / TypeScript on AWS (Cognito, S3, RDS, Lambda).',
      'Implemented database operations, service integrations and backend improvements for property listings.',
      'Took features from technical specification through to production deployment.',
    ],
  },
];

export const certifications: Certification[] = [
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

// Legacy exports used by the old single-page layout; removed with it.
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
