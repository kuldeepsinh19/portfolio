import type { Certification, Experience } from './types';

/**
 * Public URL used for canonical links, the sitemap and social previews.
 * NEXT_PUBLIC_SITE_URL overrides it (e.g. for a custom domain later).
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kuldeepsinh-rajput.vercel.app';

export const me = {
  name: 'Kuldeepsinh Rajput',
  title: 'Backend Engineer',
  role: 'Backend Engineer | Agentic AI & Software Engineering',
  location: 'Ahmedabad, India',
  experience: '2+ years',
  status: 'Available for opportunities',
  phone: '+91 91046 24966',
  email: 'kuldeepsinhrajput1919@gmail.com',
  linkedin: 'https://www.linkedin.com/in/kuldeepsinh-rajput-7089a8240/',
  github: 'https://github.com/kuldeepsinh19',
  site: siteUrl,
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
 * - 2M+ / 2+ years: from my employment record, Jan 2024 – May 2026 (see experience below).
 * - 4 tools: Slack, GitHub, Sentry, Supabase connected to agents.
 */
export const metrics = [
  { value: '100+', label: 'Pull requests created by Capy in workflows I configured' },
  { value: '2M+', label: 'Users on the platform whose backend I maintained' },
  { value: '4', label: 'Engineering tools connected to agents — Slack, GitHub, Sentry, Supabase' },
  { value: '2+', label: 'Years of backend engineering' },
];

export const experiences: Experience[] = [
  {
    company: 'Avesta HQ',
    role: 'Backend & Agentic AI Developer',
    period: 'Jan 2024 – May 2026',
    type: 'full-time',
    summary:
      'Backend engineering for view.com.au, a high-traffic Australian real estate platform — from API performance and AWS pipelines to a multi-agent development system on its codebase.',
    bullets: [
      'Maintained the AI-integrated backend for view.com.au — 2M+ users, 10+ repositories and 8 Node.js / TypeScript microservices.',
      'Architected a multi-agent development system on a legacy codebase with a SPEC-driven workflow (analyse → plan → implement → test), cutting feature delivery time by 70%.',
      'Built RAG pipelines with vector-indexed retrieval over 100K+ LOC in OpenSearch for context-aware code generation.',
      'Cut REST API response times by 30% with multi-layer caching and OpenSearch multi-search, validated at 10K concurrent users with k6.',
      'Designed AWS Lambda pipelines for SFMC triggers, cutting dispatch latency by 40%.',
      'Built 3 internal npm packages (HTTP client, DB adapter, OpenSearch wrapper) used across all 8 microservices, removing 60% of duplicated code; contributed to the Zeus core backend and an SEO-safe reverse proxy.',
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
