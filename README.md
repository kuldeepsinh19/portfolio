# Portfolio

Personal portfolio of **Kuldeepsinh Rajput**, a Backend & Agentic AI Engineer.

**Live:** https://portfolio-xi-eight-000yuu2s96.vercel.app

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
  app/          layout, page and 404 page (App Router)
  lib/data.ts   all profile content: experience, projects, skills, certificates
public/
  certs/        certificate PDFs
  diagrams/     architecture diagrams shown on the site
```

To update the content, edit `src/lib/data.ts`; the page renders from it.
