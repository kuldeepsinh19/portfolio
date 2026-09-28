// ─── types ────────────────────────────────────────────────────────────────────

export type Link = { label: string; href: string };

export type FeaturedProject = {
  slug: string;
  name: string;
  kind: string;
  tagline: string;
  summary: string;
  highlights: string[];
  stack: string[];
  status: string;
  repo: string;
  live?: string;
  caveat?: string;
};

export type WorkProject = {
  name: string;
  desc: string;
  tags: string[];
  url: string | null;
};

export type Contribution = {
  repo: string;
  number: number;
  title: string;
  status: 'Merged' | 'Draft';
  note: string;
  url: string;
};

export type ClientSite = { name: string; desc: string; tags: string[]; url: string };

export type Experience = {
  company: string;
  role: string;
  period: string;
  type: string;
  bullets: string[];
};

export type Certification = { title: string; issuer: string; date: string; url: string };

export type Skill = { name: string; level: number; years: string };

export type Stat = { value: string; label: string };

export type PipelineStage = { agent: string; role: string; label: string; desc: string };

// ─── profile ──────────────────────────────────────────────────────────────────

const GH = 'https://github.com/kuldeepsinh19';

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
  github: GH,
  site: 'https://portfolio-xi-eight-000yuu2s96.vercel.app',
};

export const heroLines = [
  'Node.js. AWS. Agentic AI.',
  'Backends that scale to millions.',
  "Agents that don't assist. They ship.",
];

export const stats: Stat[] = [
  { value: '2M+', label: 'Users Served' },
  { value: '3+', label: 'Years Experience' },
  { value: '99.9%', label: 'Uptime Achieved' },
  { value: '5K+', label: 'Concurrent Users' },
];

// ─── featured AI / backend projects (open source, on GitHub) ─────────────────

export const featured: FeaturedProject[] = [
  {
    slug: 'forge',
    name: 'Forge',
    kind: 'AI coding agent · CLI',
    tagline: 'Context-efficient AI agents for software engineering.',
    summary:
      'Turns a task into an investigated, implemented, validated and independently reviewed change. The pipeline is plain code, not an orchestrating agent: detect → investigate → verify citations → implement → validate → review (bounded revisions) → commit → optional pull request.',
    highlights: [
      'Model calls only in investigate, implement and review — every other stage is deterministic',
      'Investigation must cite file + line ranges; citations are checked mechanically against the working tree',
      'Stages hand off typed state, never transcripts; reviewer sees the real diff and test results, not the implementer’s reasoning',
      'Per-call telemetry: tokens, prompt-cache hits, cost and latency; hard spend cap on recorded spend',
      '~137 tests · CI on 3 OSes × Node 20/22',
    ],
    stack: ['TypeScript', 'Node.js', 'Anthropic SDK', 'Zod', 'Vitest', 'GitHub API'],
    status: 'v0.1 · early',
    repo: `${GH}/forge`,
  },
  {
    slug: 'multi-tenant-rag-platform',
    name: 'Multi-Tenant RAG Platform',
    kind: 'RAG chatbot platform · Backend',
    tagline: 'One dashboard, many businesses, each with an isolated knowledge base and a cited chatbot.',
    summary:
      'Business admins upload documents; an Arq worker chunks and embeds them into Postgres + pgvector, scoped by business_id. Each chat turn is a bounded LangGraph loop — retrieve → generate → verify → retry or escalate — streamed over SSE to a React dashboard and an embeddable widget.',
    highlights: [
      'Hybrid retrieval: pgvector cosine + Postgres full-text, fused with RRF, then cross-encoder rerank — every query tenant-filtered',
      'Tenant id comes only from the JWT or a validated widget key, never from the request body',
      'Deterministic citation check: every cited chunk must have actually been retrieved',
      'Primary/fallback LLM (Gemini · Groq) with retries and a circuit breaker; Redis rate limits and token budgets',
      'PII redaction + prompt-injection screening; promptfoo / Ragas evals; ~250 backend and ~200 frontend tests',
    ],
    stack: ['Python', 'FastAPI', 'LangGraph', 'PostgreSQL', 'pgvector', 'Redis', 'React', 'Docker'],
    status: 'Complete · runs locally',
    repo: `${GH}/multi-tenant-rag-platform`,
  },
  {
    slug: 'floodsense-ai',
    name: 'FloodSense AI',
    kind: 'Multi-agent system · Safety-critical',
    tagline: 'Flood early-warning for rural Indian villages — an LLM that cannot talk a real emergency down.',
    summary:
      'A 2024 college project rebuilt in 2026 with three Claude agents: a tool-using risk agent, an advisory agent that writes SMS and loudspeaker scripts, and an incident agent that writes after-action reports.',
    highlights: [
      'Risk agent runs a real tool-use loop over 4 tools, then returns a schema-enforced decision (Zod)',
      'Deterministic safety floor: the model may escalate the original threshold rule, never downgrade it; model failure falls back to the rule',
      'Warnings in English, Gujarati and Hindi',
      'Live Open-Meteo rainfall; river levels simulated with a Nash-cascade rainfall-runoff model',
      '24 labelled eval scenarios · 11 tests · per-run cost traces',
    ],
    stack: ['Node.js', 'Express', 'Anthropic SDK', 'Zod', 'Open-Meteo', 'Firebase'],
    status: 'Working · local',
    repo: `${GH}/floodsense-ai`,
    caveat: 'River levels are simulated; SMS delivery is not wired up.',
  },
  {
    slug: 'agent-decision-gateway',
    name: 'Agent Decision Gateway',
    kind: 'LLM cost & routing · Library',
    tagline: 'Stop paying generation prices for yes/no decisions.',
    summary:
      'Routes the small structured decisions agents make — which tool next, keep going, does this pass, which model tier — to TypeSafe AI’s Jev model, and turns its confidence-scored answers into actions through a deterministic policy layer. The expensive LLM is called only when generation is actually needed.',
    highlights: [
      'evaluate() batches many decisions into one call; chain() handles dependent decisions',
      'Every decision has a documented default when Jev fails, times out or has no key — no throws',
      'OpenAI and Anthropic provider adapters behind one interface',
      'Benchmark (12 synthetic tasks): 132 → 36 LLM calls with real Jev calls',
      '~148 tests',
    ],
    stack: ['TypeScript', 'npm workspaces', '@typesafe-ai/sdk', 'OpenAI SDK', 'Anthropic SDK', 'Vitest'],
    status: 'MVP',
    repo: `${GH}/agent-decision-gateway`,
    caveat: 'In the benchmark the generative-LLM side is mocked; only Jev calls are live.',
  },
  {
    slug: 'raaya-agri-export-ai',
    name: 'Raaya Global',
    kind: 'Client product · Serverless AI',
    tagline: 'An agri-export site that answers buyers in their own language.',
    summary:
      'Client website for an Indian agricultural exporter with an additive AI layer on Vercel serverless functions. The enquiry email is sent before any AI runs, so no model outage can cost the business a lead.',
    highlights: [
      'Natural-language product search — model returns ids that are validated against the real catalogue, with keyword fallback',
      'Grounded buyer assistant with a two-layer guardrail that blocks prices, MOQs, certifications and dates',
      'Auto-drafted reply in the buyer’s language, timeout-capped and best-effort',
      'Honeypot, rate limiting and per-field validation on the public enquiry endpoint',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Vercel Functions', 'Anthropic SDK', 'Zod'],
    status: 'Live',
    repo: `${GH}/raaya-agri-export-ai`,
    live: 'https://raayaimportexport.vercel.app',
    caveat: 'AI features are currently disabled on the public deployment (no API key configured).',
  },
];

// ─── professional work ───────────────────────────────────────────────────────

export const work: WorkProject[] = [
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
];

export const pipeline: PipelineStage[] = [
  {
    agent: 'Winston',
    role: 'Planner',
    label: '01 / Plan',
    desc: 'Reads codebase, requirements, and architecture. Produces a structured SPEC — file targets, decision rationale, implementation sequence — before any code is written.',
  },
  {
    agent: 'Amelia',
    role: 'Developer',
    label: '02 / Implement',
    desc: 'Follows the SPEC step-by-step. Writes production-grade code across a brownfield Node.js codebase using RAG-retrieved context from 100K+ LOC via OpenSearch.',
  },
  {
    agent: 'Murat',
    role: 'Test Architect',
    label: '03 / Test',
    desc: 'Adversarial quality gate. Finds a minimum of 3–10 issues per run — edge cases, security gaps, reliability failures — before any output leaves the pipeline.',
  },
  {
    agent: 'Viktor',
    role: 'Code Reviewer',
    label: '04 / Review',
    desc: 'Final standards enforcement: architecture, performance, security, naming. Only code that clears Viktor reaches the developer for final human review.',
  },
];

export const outcomes: Stat[] = [
  { value: '70%', label: 'Faster Feature Delivery' },
  { value: '60%', label: 'Development Speed Increase' },
  { value: '100K+', label: 'LOC Codebase Covered' },
];

export const performance = {
  heading: ['30% faster API.', '10K users. Zero compromise.'],
  body: 'Diagnosed bottlenecks in a high-traffic real estate backend serving 2M+ users. Implemented multi-layer caching and rewrote fan-out queries using OpenSearch multi-search — collapsing multiple round trips into a single batched call. Validated under 10,000 concurrent users via k6 load testing with no degradation.',
  tiles: [
    { value: '30%', label: 'API Response Time Reduced' },
    { value: '10K', label: 'Concurrent Users Validated' },
    { value: '40%', label: 'Lambda Dispatch Latency Cut' },
    { value: '2M+', label: 'Users on the Platform' },
  ] as Stat[],
};

// ─── open source ─────────────────────────────────────────────────────────────

export const contributions: Contribution[] = [
  {
    repo: 'OpenHands/OpenHands',
    number: 17409,
    title: 'Toggle all workspace folders from the Conversations header',
    status: 'Merged',
    note: 'Shipped in v1.24.0',
    url: 'https://github.com/OpenHands/OpenHands/pull/17409',
  },
  {
    repo: 'OpenHands/OpenHands',
    number: 17428,
    title: 'Keep embedded provider instances stable across Strict Mode and sibling roots',
    status: 'Draft',
    note: 'Refs #16953',
    url: 'https://github.com/OpenHands/OpenHands/pull/17428',
  },
  {
    repo: 'OpenHands/OpenHands',
    number: 17731,
    title: 'Classify failed terminal commands and surface a failure icon in chat',
    status: 'Draft',
    note: 'Refs #17490',
    url: 'https://github.com/OpenHands/OpenHands/pull/17731',
  },
];

// ─── client websites ─────────────────────────────────────────────────────────

export const clientSites: ClientSite[] = [
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

// ─── experience ──────────────────────────────────────────────────────────────

export const experiences: Experience[] = [
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

// ─── certifications & skills ─────────────────────────────────────────────────

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

export const skills: Skill[] = [
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
