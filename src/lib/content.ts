import type { SideProject, StackGroup } from './types';

// ─── AI Engineering ──────────────────────────────────────────────────────────

export type AiPractice = {
  title: string;
  body: string;
  examples: string[];
};

/** What "practical AI engineering" means in my work, grouped by the problem it solves. */
export const aiPractices: AiPractice[] = [
  {
    title: 'Connecting agents to real tools',
    body: 'An agent becomes useful when it can see what engineers see. I connect agents to the systems where the evidence lives, through MCP servers and native integrations.',
    examples: ['MCP', 'Slack-to-agent threads', 'GitHub PR automation', 'Sentry investigation', 'Supabase queries'],
  },
  {
    title: 'Designing the workflow, not just the prompt',
    body: 'Most of the work is deciding the steps: where a request enters, what context is gathered, what the agent produces and who picks it up next.',
    examples: ['Hermes Agent', 'Capy', 'AI-assisted debugging', 'Support triage', 'Multi-agent pipelines'],
  },
  {
    title: 'Permissions and boundaries',
    body: 'Agents get the access their job needs and no more. Instructions spell out what is off-limits, and state-changing actions are narrow and explicit.',
    examples: ['Agent configuration', 'Tool scoping', 'Read vs write access', 'Operational limits'],
  },
  {
    title: 'Humans stay in the loop',
    body: 'Agents investigate and propose. Engineers review, test and decide what ships. Pull requests are the natural hand-off point.',
    examples: ['PR review', 'Validation', 'Ownership stays with the team'],
  },
];

/** The SPEC-driven development pipeline from my role at Avesta HQ. */
export const specPipeline = {
  title: 'SPEC-driven multi-agent development',
  context:
    'Built at Avesta HQ on a brownfield Node.js / TypeScript codebase. Each stage is a dedicated agent, and nothing reaches a developer without passing the stages before it.',
  stages: [
    { label: 'Plan', role: 'Planner', body: 'Reads requirements, code and architecture; writes a SPEC with target files, rationale and order of work.' },
    { label: 'Implement', role: 'Developer', body: 'Follows the SPEC step by step, using RAG-retrieved context from 100K+ LOC indexed in OpenSearch.' },
    { label: 'Test', role: 'Test architect', body: 'Adversarial pass for edge cases, security gaps and reliability failures.' },
    { label: 'Review', role: 'Code reviewer', body: 'Architecture, performance, security and naming — then hand-off for human review.' },
  ],
};

// ─── Stack ───────────────────────────────────────────────────────────────────

export const stackGroups: StackGroup[] = [
  {
    title: 'Backend Engineering',
    blurb: 'Where most of my work lives: APIs and services that stay maintainable as they grow.',
    items: ['Node.js', 'TypeScript', 'Express.js', 'REST APIs', 'Clean Architecture', 'JWT', 'Bcrypt', 'Joi'],
  },
  {
    title: 'AI & Agentic Systems',
    blurb: 'Agents, retrieval and tool calling used inside real workflows.',
    items: ['LangChain', 'LangGraph', 'MCP', 'Hermes Agent', 'Gemini', 'Vertex AI', 'RAG', 'Tool calling'],
  },
  {
    title: 'Cloud & Infrastructure',
    blurb: 'Serverless and container workloads on AWS.',
    items: ['AWS Lambda', 'ECS', 'SQS', 'Step Functions', 'S3', 'RDS', 'Cognito', 'Docker', 'Serverless Framework'],
  },
  {
    title: 'Databases & Distributed Systems',
    blurb: 'Data models, enforcement in the database, and performance under load.',
    items: ['PostgreSQL', 'Supabase', 'Redis', 'OpenSearch', 'Database triggers', 'Caching', 'Multi-tenancy', 'Partitioning'],
  },
  {
    title: 'AI-Assisted Engineering',
    blurb: 'The tooling I use to investigate, change and ship code with agents.',
    items: ['Hermes', 'Claude', 'GitHub', 'Sentry', 'Slack', 'AI code investigation', 'Agent configuration', 'PR workflows'],
  },
];

// ─── Additional projects ─────────────────────────────────────────────────────

export const sideProjects: SideProject[] = [
  {
    title: 'Water Level Alert System',
    kind: 'Personal project',
    status: 'Built 2024 · extended 2026',
    summary:
      'Village-level water monitoring with admin controls. Revisited in 2026 as FloodSense AI, adding agent-based risk forecasting behind a deterministic safety floor.',
    points: [
      'Admin controls with persistent ON/OFF states',
      'Water-level generation logic and peak levels',
      'Responsive UI and contact-form management',
    ],
    stack: ['Node.js', 'Express', 'Firebase Realtime DB', 'Firebase Auth', 'EJS'],
    links: [{ label: 'GitHub', href: 'https://github.com/kuldeepsinh19/flood-alert-pe-vgec' }],
  },
  {
    title: 'Multi-Tenant RAG Platform',
    kind: 'Personal project',
    status: 'Public repository',
    summary:
      'RAG chatbot platform with per-business document isolation, grounded and cited answers, and an embeddable chat widget. Provider-agnostic LLMs.',
    points: ['Per-tenant document isolation', 'Cited, grounded answers', 'Embeddable widget'],
    stack: ['FastAPI', 'LangGraph', 'pgvector', 'PostgreSQL'],
    links: [{ label: 'GitHub', href: 'https://github.com/kuldeepsinh19/multi-tenant-rag-platform' }],
  },
  {
    title: 'Multi-Tenant SaaS Architecture',
    kind: 'Architecture study',
    status: 'Architecture & investigation',
    summary:
      'Working notes and investigation into how multi-tenant SaaS data should be isolated and scaled as tenants grow unevenly.',
    points: [
      'Tenant isolation models and their trade-offs',
      'Partitioning and sharding for uneven tenant workloads',
      'Caching and backend performance',
    ],
    stack: ['PostgreSQL', 'Redis', 'Supabase', 'AWS'],
    links: [],
  },
  {
    title: 'Staff Calendar Synchronization',
    kind: 'Architecture study',
    status: 'Architecture & product design',
    summary:
      'Designing two-way calendar sync for a multi-tenant scheduling product — who owns a calendar, and what syncs where.',
    points: [
      'Calendar ownership: staff-wise vs admin-wise sync',
      'Google Calendar and Outlook integration requirements',
      'Multi-tenant behaviour and scheduling architecture',
    ],
    stack: ['Google Calendar', 'Outlook', 'Multi-tenant SaaS'],
    links: [],
  },
];

/** Smaller client builds kept from the previous portfolio. */
export const clientSites = [
  { name: 'Mitansh Interiors', note: 'Business website', url: 'https://mitanshinteriors.com' },
  { name: 'Aristo Cafe Restro', note: 'Restaurant website', url: 'http://aristocaferestro.com' },
];
