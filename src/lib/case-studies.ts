import type { CaseStudy } from './types';

/**
 * Featured case studies, in display order.
 *
 * Accuracy rules for this file:
 * - No invented metrics. The only number used is the confirmed Capy PR count.
 * - Company work is described without naming customers or exposing internals.
 * - `href: null` marks a link that isn't public yet; components skip it.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'agentic-engineering-operations',
    index: '01',
    title: 'Agentic Engineering Operations',
    subtitle: 'Hermes Agent · Capy · Slack · GitHub · Sentry · Supabase · MCP',
    kind: 'Professional work',
    status: 'In active use',
    statusTone: 'live',
    summary:
      'Designed, configured and operated tool-connected AI agents that investigate issues, work inside engineering systems and open pull requests for human review.',
    overview: [
      'Designed, configured, and operated AI-powered engineering workflows using Hermes Agent and Capy, integrating AI agents into real-world software development and operational processes.',
      'The work focused on moving beyond conversational AI toward tool-connected agents capable of investigating issues, interacting with engineering systems, supporting customer communication, and contributing directly to software delivery.',
    ],
    problem:
      'Engineering time was being spent on repeatable work: reading an issue in Slack, pulling the matching Sentry error, checking data in Supabase, finding the relevant code and drafting a fix. A chatbot that only answers questions does not remove any of those steps — the agent has to be able to use the same tools engineers use, with clear limits.',
    solution:
      'Connected Hermes Agent and Capy to the team’s working tools through MCP and native integrations. Requests start in Slack; the agent gathers context from GitHub, Sentry and Supabase, investigates, reports findings back to the thread and, where a code change is appropriate, opens a pull request. Engineers review and validate every change before it ships.',
    contributions: [
      'Designed and configured agent workflows using Hermes Agent and Capy.',
      'Integrated agents with Slack, GitHub, Sentry and Supabase through MCP and connected tools.',
      'Built and refined workflows for customer issue investigation and engineering support.',
      'Used agents to investigate problems, analyse technical context and assist with code changes.',
      'Enabled agent-driven pull request creation.',
      'Contributed to the architecture and configuration behind these workflows.',
      'Worked on Slack-to-agent communication.',
      'Refined agent instructions, tool permissions and operational boundaries.',
    ],
    architecture: {
      id: 'agent-ops',
      title: 'Slack → Agent → Tools → Pull request',
      short: 'Agent operations',
      caption: 'How a request moves from a Slack thread to a reviewed pull request.',
      steps: [
        { label: 'Slack', detail: 'Request, bug report or question arrives in a thread', kind: 'input' },
        { label: 'Hermes Agent / Capy', detail: 'Agent picks up the request with its instructions and permissions', kind: 'agent' },
        { label: 'MCP / connected tools', detail: 'Scoped tool access — read by default, write only where allowed', kind: 'process' },
        { label: 'Engineering context', items: ['GitHub', 'Sentry', 'Supabase'], kind: 'tool' },
        { label: 'Issue investigation', detail: 'Reproduce, trace the error, read the code path, summarise findings', kind: 'process' },
        { label: 'Pull request', detail: 'Agent opens a PR with the proposed change and its reasoning', kind: 'output' },
        { label: 'Review & validation', detail: 'Engineers review, test and decide what merges', kind: 'human' },
      ],
      note: 'Agents propose; people approve. Merging and production changes stay with the engineering team.',
    },
    decisions: [
      {
        title: 'Tools before prompts',
        body: 'An agent is only as useful as the context it can reach. Most of the effort went into connecting the right systems — errors, data, code — rather than writing longer prompts.',
      },
      {
        title: 'Least-privilege tool access',
        body: 'Each tool is granted for a reason. Read access to investigate is broad; actions that change state are narrow and explicit. Instructions describe what the agent must not do, not just what it should do.',
      },
      {
        title: 'Slack as the interface',
        body: 'Work starts where the team already talks. Findings come back to the same thread, so the history of an investigation is visible to everyone, not hidden in an agent session.',
      },
      {
        title: 'Human review is part of the design',
        body: 'Pull requests are the hand-off point. The agent does the legwork; engineers keep ownership of correctness, architecture and what reaches production.',
      },
    ],
    stack: ['Hermes Agent', 'Capy', 'MCP', 'Slack', 'GitHub', 'Sentry', 'Supabase', 'TypeScript'],
    impact: [
      {
        value: '100+',
        label: 'pull requests created by Capy',
        note: 'Opened by the agent inside the workflows described here, then reviewed and validated by engineers. I configured and operated the workflows — I didn’t hand-write every change.',
      },
      { label: 'Investigation starts from a Slack message instead of a manual hand-off between support and engineering.' },
      { label: 'Agent instructions, permissions and boundaries refined from real usage, not set once and forgotten.' },
    ],
    links: [
      { label: 'Public repository', href: null },
      { label: 'Demo', href: null },
    ],
    confidentiality:
      'Company and customer details are left out. The workflow shape, tools and decisions are described as they were built.',
  },
  {
    slug: 'ai-bug-investigator',
    index: '02',
    title: 'AI Bug Investigator',
    subtitle: 'Intelligent support triage & engineering investigation',
    kind: 'Professional work',
    status: 'In active use',
    statusTone: 'live',
    summary:
      'AI-assisted triage that separates real defects from support and feature requests — even when a bug is phrased as a question — and hands engineers an investigation, not just a ticket.',
    overview: [
      'Developed and refined AI-assisted workflows for investigating customer-reported issues across a production SaaS platform.',
      'Designed classification rules to distinguish actual product defects from support requests and feature requests, ensuring that actionable issues are not overlooked simply because they are phrased as questions.',
      'Connected investigation workflows with engineering context to support more effective troubleshooting and issue resolution.',
    ],
    problem:
      'Customers rarely say “I found a bug.” They ask “how do I…?” or “why can’t I…?”. Keyword or tone-based triage files these as support questions, and real defects wait in the wrong queue.',
    solution:
      'Gave the agent explicit definitions based on product behaviour rather than wording, then connected classification to an investigation step that gathers engineering context before anyone picks the issue up.',
    contributions: [
      'Designed structured issue-classification logic.',
      'Refined agent instructions for actionable issue detection.',
      'Integrated engineering context into investigation workflows.',
      'Supported AI-assisted debugging and pull request generation.',
      'Improved collaboration between customer support and engineering.',
    ],
    extras: [
      {
        title: 'Classification rules',
        items: [
          { term: 'Bug', text: 'The product is not behaving as designed.' },
          { term: 'Feature request', text: 'The product works as intended, but the reporter wants new behaviour.' },
          { term: 'Support request', text: 'The reporter needs help, information or an action.' },
        ],
      },
    ],
    architecture: {
      id: 'bug-investigator',
      title: 'Customer message → Engineering findings',
      short: 'Bug investigator',
      caption: 'Classification is decided by product behaviour, not by how the message is worded.',
      steps: [
        { label: 'Customer message', detail: 'Free-form text, often phrased as a question', kind: 'input' },
        { label: 'Intent & actionability', detail: 'What is the reporter actually describing?', kind: 'agent' },
        { label: 'Classification', items: ['Bug', 'Feature request', 'Support request'], kind: 'guard' },
        { label: 'Context gathering', detail: 'Errors, recent changes, account data, relevant code', kind: 'tool' },
        { label: 'Investigation', detail: 'Narrow down cause and scope', kind: 'process' },
        { label: 'Engineering findings', detail: 'Summary, evidence and suggested next step', kind: 'output' },
        { label: 'Resolution or follow-up', detail: 'Fix, PR, answer or product feedback — owned by the team', kind: 'human' },
      ],
    },
    decisions: [
      {
        title: 'Define classes by behaviour',
        body: '“Is the product doing what it was designed to do?” is a question an agent can investigate. “Does this sound like a complaint?” is not.',
      },
      {
        title: 'Classify, then investigate',
        body: 'A label alone doesn’t save engineering time. The value is in arriving with context already gathered.',
      },
      {
        title: 'Bias toward actionable',
        body: 'Rules are written so a defect phrased as a question is still caught. A false “bug” costs minutes; a missed one costs a customer.',
      },
    ],
    stack: ['AI agents', 'Instruction design', 'Classification rules', 'Engineering context', 'PR workflows'],
    impact: [
      { label: 'Actionable defects are no longer lost because they were phrased as questions.' },
      { label: 'Engineers start from findings and evidence rather than a raw customer message.' },
    ],
    links: [],
    confidentiality: 'Platform and customer details are anonymised.',
  },
  {
    slug: 'zinnova',
    index: '03',
    title: 'Zinnova',
    subtitle: 'AI-powered marketing intelligence platform',
    kind: 'Personal product',
    status: 'Live',
    statusTone: 'live',
    summary:
      'A marketing SaaS for Indian startups. Its Business DNA Studio runs a four-agent pipeline that turns a website URL into a structured marketing intelligence report.',
    overview: [
      'Built an AI-powered marketing SaaS platform designed to help businesses generate marketing strategies and creative content through intelligent workflows.',
      'Developed Business DNA Studio, a multi-agent AI pipeline that analyses a business website and produces a structured marketing intelligence report. The workflow combines business analysis, marketing strategy, social media planning and campaign strategy into a coordinated pipeline.',
      'Integrated generative AI for marketing content and image creation, alongside SaaS infrastructure for authentication, payments, credit management and user-facing AI tools.',
    ],
    problem:
      'Early-stage startups need a marketing plan and a steady flow of creative, but rarely have a strategist or designer. Generic AI tools produce generic output because they know nothing about the business.',
    solution:
      'Start from the business itself. Business DNA Studio reads the company’s website and passes it through specialised agents, each building on the previous one’s output, to produce a plan grounded in that business. The rest of the product — AI Studio, image recreation, creatives — uses that context.',
    contributions: [
      'Designed and built the product end to end as a solo founder-engineer.',
      'Designed the Business DNA multi-agent pipeline and each agent’s responsibility.',
      'Built the Node.js / TypeScript backend with a Clean Architecture structure.',
      'Integrated Google Gemini and Vertex AI for text and image generation.',
      'Implemented authentication, Razorpay payments and a credit-based usage system.',
      'Migrated infrastructure to AWS.',
    ],
    extras: [
      {
        title: 'Product surface',
        items: [
          { text: 'AI Studio' },
          { text: 'Business DNA Studio' },
          { text: 'AI image recreation' },
          { text: 'AI-generated marketing creatives' },
          { text: 'Portfolio of generated work' },
          { text: 'Credit-based usage with Razorpay payments' },
        ],
      },
    ],
    architecture: {
      id: 'zinnova-dna',
      title: 'Business URL → Business DNA report',
      short: 'Zinnova pipeline',
      caption: 'Each agent has one job and builds on the structured output of the previous one.',
      steps: [
        { label: 'Business URL', detail: 'The user enters their website', kind: 'input' },
        { label: 'Business Analyst', detail: 'What the business does, for whom, and how it positions itself', kind: 'agent' },
        { label: 'Marketing Strategist', detail: 'Audience, positioning and messaging strategy', kind: 'agent' },
        { label: 'Content & Social Planner', detail: 'Channels, content pillars and posting plan', kind: 'agent' },
        { label: 'Campaign & Ad Strategist', detail: 'Campaign ideas and ad direction', kind: 'agent' },
        { label: 'Business DNA Report', detail: 'Structured report reused across the product', kind: 'output' },
      ],
    },
    decisions: [
      {
        title: 'Specialised agents over one large prompt',
        body: 'Splitting analysis, strategy, content and campaigns keeps each step focused, makes intermediate output inspectable, and lets a single stage be improved without rewriting the rest.',
      },
      {
        title: 'Structured hand-offs',
        body: 'Each stage produces structured output, so later stages and the UI can rely on the shape of the result.',
      },
      {
        title: 'Credits as the billing primitive',
        body: 'AI calls have real, variable cost. A credit system maps that cost to usage and keeps pricing simple with Razorpay.',
      },
      {
        title: 'Clean Architecture in the backend',
        body: 'Model providers, payments and storage sit behind interfaces, which kept the infrastructure migration to AWS contained instead of touching business logic everywhere.',
      },
    ],
    stack: ['Node.js', 'TypeScript', 'Clean Architecture', 'AWS', 'Cognito', 'JWT', 'Razorpay', 'Google Gemini', 'Vertex AI', 'Supabase'],
    impact: [
      { label: 'Live product at zinnova.in, built and operated solo.' },
      { label: 'A single website URL produces a full, structured marketing plan.' },
    ],
    links: [
      { label: 'zinnova.in', href: 'https://www.zinnova.in/' },
      { label: 'Source code', href: null },
    ],
  },
  {
    slug: 'secure-supabase-auth',
    index: '04',
    title: 'Secure Authentication Architecture',
    subtitle: 'Supabase Auth · server-side execution · CAPTCHA',
    kind: 'Engineering audit',
    status: 'Audited and validated locally',
    statusTone: 'muted',
    summary:
      'An audit of a Supabase auth setup to move CAPTCHA-protected operations server-side — checking credential boundaries, IP forwarding and compatibility across web and Capacitor clients.',
    overview: [
      'Audited and improved a Supabase authentication architecture to support CAPTCHA-protected authentication operations through server-side execution.',
      'Validated sign-in, sign-up and password-reset flows across web and Capacitor clients while ensuring protected operations were handled by the server.',
      'Investigated security boundaries between public client credentials and privileged server-side credentials, verified IP forwarding behaviour, and tested compatibility with existing authentication workflows.',
    ],
    problem:
      'CAPTCHA protection only helps if the protected call can’t be made around it. With auth calls issued directly from clients — including a Capacitor mobile app — it wasn’t clear which operations were truly protected, or whether the server would see the real client IP.',
    solution:
      'Route the protected operations through the server, keep privileged credentials there, and verify each flow end to end on both web and Capacitor before relying on it.',
    contributions: [
      'Mapped every auth operation and where it executes (client vs server).',
      'Separated what the public anon key may do from what needs privileged credentials.',
      'Designed server-side execution for CAPTCHA-protected operations.',
      'Verified IP forwarding so rate limits and CAPTCHA see the real client.',
      'Tested sign-in, sign-up and password reset on web and Capacitor.',
    ],
    architecture: {
      id: 'auth',
      title: 'Client → Server → Supabase Auth',
      short: 'Secure auth',
      caption: 'Protected operations run on the server, where privileged credentials live.',
      steps: [
        { label: 'Clients', items: ['Web', 'Capacitor app'], kind: 'input' },
        { label: 'CAPTCHA token', detail: 'Issued on the client, verified with the request', kind: 'guard' },
        { label: 'Server route', detail: 'Executes sign-in, sign-up and reset; forwards client IP', kind: 'process' },
        { label: 'Privileged boundary', detail: 'Server-only credentials never shipped to clients', kind: 'guard' },
        { label: 'Supabase Auth', detail: 'Session returned to the client', kind: 'tool' },
      ],
      note: 'Status: validated in a local audit. Presented as an audit and migration plan, not as a completed production rollout.',
    },
    decisions: [
      {
        title: 'Protect the operation, not the button',
        body: 'Client-side checks can be skipped. The operation itself has to run where the check is enforced.',
      },
      {
        title: 'Public vs privileged credentials',
        body: 'The anon key is designed to be public; anything beyond it stays on the server. The audit made that line explicit for every flow.',
      },
      {
        title: 'Test every client',
        body: 'Capacitor apps behave differently from browsers (origins, cookies, redirects). Each flow was validated on both before being considered compatible.',
      },
    ],
    stack: ['Supabase Auth', 'TypeScript', 'Server-side auth', 'CAPTCHA', 'Capacitor', 'IP forwarding'],
    impact: [
      { label: 'A clear map of which auth operations are protected and where they run.' },
      { label: 'Sign-in, sign-up and password reset validated on web and Capacitor.' },
    ],
    links: [],
    confidentiality: 'Product details are anonymised.',
  },
  {
    slug: 'multi-tenant-booking-restrictions',
    index: '05',
    title: 'Multi-Tenant Booking Restrictions',
    subtitle: 'Database & application enforcement',
    kind: 'Professional work',
    status: 'Designed and implemented',
    statusTone: 'accent',
    summary:
      'A layered customer-blacklisting system for a multi-tenant booking platform, enforced in PostgreSQL triggers and a TypeScript checkout guard so no booking surface can bypass it.',
    overview: [
      'Designed a layered customer-blacklisting system for a multi-tenant booking platform, enforcing business rules across application and database boundaries.',
      'Implemented a shared database helper, booking-level triggers and a TypeScript checkout guard to prevent restricted customers from completing bookings across supported booking surfaces.',
      'Designed consistent error handling, optional customer-facing restriction reasons, account-merge compatibility and capability-based feature access, while reusing existing database structures to minimise schema changes.',
    ],
    problem:
      'A booking can be created from several surfaces. A check in one code path protects that path only — any other surface, or a future one, could still create a booking for a restricted customer.',
    solution:
      'Enforce the rule twice, on purpose. The application guard gives a fast, friendly error at checkout; database triggers guarantee the rule holds no matter which surface writes the booking. Both call the same shared helper so the logic lives in one place.',
    contributions: [
      'Designed the layered enforcement model.',
      'Implemented a shared PostgreSQL helper used by every check.',
      'Added booking-level triggers as the final line of enforcement.',
      'Built a TypeScript checkout guard for early, user-friendly errors.',
      'Defined consistent error codes and optional customer-facing reasons.',
      'Kept restrictions correct when customer accounts are merged.',
      'Gated the feature behind tenant capabilities.',
    ],
    architecture: {
      id: 'booking',
      title: 'Checkout → Guard → Database enforcement',
      short: 'Booking guard',
      caption: 'Two layers, one source of truth: both layers call the same database helper.',
      steps: [
        { label: 'Booking surfaces', items: ['Checkout', 'Other booking flows'], kind: 'input' },
        { label: 'TypeScript checkout guard', detail: 'Early check, friendly message, consistent error code', kind: 'guard' },
        { label: 'Shared DB helper', detail: 'One function answers “is this customer restricted for this tenant?”', kind: 'process' },
        { label: 'Booking triggers', detail: 'Reject the write if the helper says no — covers every surface', kind: 'guard' },
        { label: 'Booking created or rejected', detail: 'Same error code from either layer', kind: 'output' },
      ],
      note: 'Capability flags decide which tenants have the feature; account merges carry restrictions across.',
    },
    decisions: [
      {
        title: 'Defence in depth',
        body: 'Application checks are good UX; database constraints are the guarantee. Using both means a new booking surface can’t forget the rule.',
      },
      {
        title: 'One helper, many callers',
        body: 'The rule is defined once in the database and reused by triggers and the guard, so the layers can’t drift apart.',
      },
      {
        title: 'Reuse existing structures',
        body: 'Built on existing tables wherever possible to keep the migration small and the review easy.',
      },
      {
        title: 'Consistent errors',
        body: 'Both layers surface the same error code, so clients handle a restriction the same way whichever layer caught it.',
      },
    ],
    stack: ['PostgreSQL', 'Supabase', 'Database triggers', 'TypeScript', 'Multi-tenancy', 'Capability flags'],
    impact: [
      { label: 'Restricted customers are blocked across supported booking surfaces, not just one code path.' },
      { label: 'Minimal schema change by reusing existing structures.' },
    ],
    links: [],
    confidentiality: 'Platform and tenant details are anonymised.',
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find(c => c.slug === slug);
}
