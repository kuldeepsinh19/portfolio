/**
 * Content model for the portfolio. All copy lives in `src/lib/*` data files
 * and is rendered by components, so updating the site means editing data,
 * not markup.
 */

/** A URL that may not be public yet. `null` means "placeholder — don't render a link". */
export type MaybeUrl = string | null;

export type ExternalLink = {
  label: string;
  href: MaybeUrl;
};

/** Visual role of a node in a flow diagram. */
export type NodeKind = 'input' | 'agent' | 'tool' | 'process' | 'guard' | 'human' | 'output';

export type FlowStep = {
  label: string;
  detail?: string;
  kind?: NodeKind;
  /** Renders the step as a group of parallel nodes (e.g. GitHub / Sentry / Supabase). */
  items?: string[];
};

export type Flow = {
  id: string;
  title: string;
  /** Short name for tabs. */
  short: string;
  caption: string;
  steps: FlowStep[];
  /** Optional note shown under the diagram, e.g. what stays human-controlled. */
  note?: string;
};

/**
 * How the work should be read. Kept explicit so personal products, company
 * work, audits and architecture studies are never blurred together.
 */
export type WorkKind =
  | 'Professional work'
  | 'Personal product'
  | 'Engineering audit'
  | 'Architecture study'
  | 'Personal project';

export type Decision = { title: string; body: string };

export type Impact = { value?: string; label: string; note?: string };

export type CaseStudy = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  kind: WorkKind;
  /** Honest status line, e.g. "In active use" or "Validated in a local audit". */
  status: string;
  statusTone?: 'live' | 'muted' | 'accent';
  /** One or two sentences for cards. */
  summary: string;
  overview: string[];
  problem: string;
  solution: string;
  contributions: string[];
  architecture: Flow;
  decisions: Decision[];
  stack: string[];
  impact: Impact[];
  links: ExternalLink[];
  /** Extra labelled lists, e.g. classification rules or feature lists. */
  extras?: { title: string; items: { term?: string; text: string }[] }[];
  confidentiality?: string;
};

export type SideProject = {
  title: string;
  kind: WorkKind;
  status: string;
  summary: string;
  points: string[];
  stack: string[];
  links: ExternalLink[];
};

export type StackGroup = {
  title: string;
  blurb: string;
  items: string[];
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  type: 'full-time' | 'internship';
  summary: string;
  bullets: string[];
};

export type Certification = {
  title: string;
  issuer: string;
  date: string;
  url: string;
};
