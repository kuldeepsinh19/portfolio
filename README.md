# Portfolio

Personal portfolio of **Kuldeepsinh Rajput** — Backend Engineer | Agentic AI & Software Engineering.
around 3 years of experience in software development

**Live:** https://kuldeepsinh-rajput.vercel.app

## Stack

- [Next.js 15](https://nextjs.org/) (App Router), statically prerendered
- React 19 and TypeScript
- Tailwind CSS
- Framer Motion for animations
- Deployed on Vercel

## Run locally

Requires Node.js 20 (see `.nvmrc`).

```bash
npm ci
npm run dev        # http://localhost:7000
```

Other scripts:

| Script              | What it does                         |
| ------------------- | ------------------------------------ |
| `npm run build`     | Production build                     |
| `npm start`         | Serve the production build on :7000  |
| `npm run typecheck` | Type-check without emitting files    |

## Structure

```
src/
  app/
    layout.tsx               fonts, metadata, viewport
    page.tsx                 homepage: composes the sections below
    projects/[slug]/         statically generated case study pages
    opengraph-image.tsx      build-time social preview image
    sitemap.ts, robots.ts
  components/                one component + CSS module per section
    FlowDiagram.tsx          reusable architecture diagram (full and compact)
    ArchitectureExplorer.tsx tabbed "System Design" explorer
  lib/
    types.ts                 content model
    data.ts                  profile, hero/about copy, metrics, experience, certifications
    case-studies.ts          featured case studies (drives cards, pages, explorer, sitemap)
    content.ts               AI engineering, stack groups, additional projects
public/
  certs/                     certificate PDFs
```

## Updating content

All copy lives in `src/lib/*`; components only render it.

- **Add a case study:** append an object to `caseStudies` in `src/lib/case-studies.ts`.
  It automatically gets a homepage card, a `/projects/<slug>` page, an explorer tab
  and a sitemap entry.
- **Links that aren't public yet:** use `href: null`. They are skipped instead of
  rendered as broken links — fill in the URL when it's ready.
- **Metrics:** only add numbers that can be verified. `metrics` in `data.ts` documents
  where each one comes from.
- **Design tokens** (colours, spacing, type) are CSS variables at the top of
  `src/app/globals.css`.
