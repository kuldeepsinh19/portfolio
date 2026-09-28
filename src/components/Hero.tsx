'use client';

import { motion } from 'framer-motion';
import { me, heroLines } from '@/lib/data';
import { Container, ArrowLink } from './ui';

// Only technologies that appear elsewhere on this page.
const techStack = [
  { slug: 'nodedotjs',     x: 30, y: 5,  size: 46, op: 0.34, dur: 7.2, dly: 1.2 },
  { slug: 'typescript',    x: 52, y: 9,  size: 38, op: 0.28, dur: 5.8, dly: 0.8 },
  { slug: 'docker',        x: 74, y: 6,  size: 44, op: 0.30, dur: 8.0, dly: 2.1 },
  { slug: 'github',        x: 91, y: 13, size: 38, op: 0.24, dur: 6.5, dly: 0.5 },
  { slug: 'python',        x: 8,  y: 10, size: 44, op: 0.26, dur: 6.0, dly: 0.0 },
  { slug: 'redis',         x: 16, y: 25, size: 32, op: 0.22, dur: 9.0, dly: 2.5 },
  { slug: 'postgresql',    x: 28, y: 32, size: 30, op: 0.22, dur: 7.5, dly: 1.8 },
  { slug: 'fastapi',       x: 41, y: 20, size: 30, op: 0.20, dur: 6.8, dly: 1.5 },
  { slug: 'nextdotjs',     x: 63, y: 22, size: 36, op: 0.22, dur: 8.5, dly: 0.3 },
  { slug: 'react',         x: 83, y: 30, size: 40, op: 0.24, dur: 7.0, dly: 1.8 },
  { slug: 'vercel',        x: 13, y: 44, size: 30, op: 0.18, dur: 9.2, dly: 2.2 },
  { slug: 'langchain',     x: 38, y: 50, size: 32, op: 0.18, dur: 7.8, dly: 4.0 },
  { slug: 'opensearch',    x: 56, y: 38, size: 36, op: 0.22, dur: 7.0, dly: 1.0 },
  { slug: 'githubactions', x: 71, y: 42, size: 30, op: 0.20, dur: 7.5, dly: 3.0 },
  { slug: 'firebase',      x: 89, y: 47, size: 34, op: 0.22, dur: 6.2, dly: 0.7 },
  { slug: 'git',           x: 7,  y: 66, size: 28, op: 0.14, dur: 8.0, dly: 1.0 },
  { slug: 'javascript',    x: 46, y: 68, size: 34, op: 0.16, dur: 8.5, dly: 0.9 },
  { slug: 'claude',        x: 52, y: 55, size: 34, op: 0.22, dur: 8.0, dly: 2.8 },
  { slug: 'anthropic',     x: 62, y: 60, size: 32, op: 0.20, dur: 8.8, dly: 3.5 },
  { slug: 'googlegemini',  x: 76, y: 53, size: 34, op: 0.22, dur: 7.6, dly: 1.4 },
  { slug: 'googlecloud',   x: 79, y: 64, size: 42, op: 0.24, dur: 8.3, dly: 0.6 },
  { slug: 'mysql',         x: 93, y: 74, size: 34, op: 0.22, dur: 5.0, dly: 1.7 },
  { slug: 'npm',           x: 27, y: 84, size: 26, op: 0.12, dur: 8.0, dly: 1.5 },
  { slug: 'express',       x: 69, y: 88, size: 30, op: 0.18, dur: 7.2, dly: 1.3 },
];

function TechBackground() {
  return (
    <div className="tech-bg" aria-hidden>
      {techStack.map(t => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={t.slug}
          src={`https://cdn.simpleicons.org/${t.slug}/ffffff`}
          alt=""
          className="tech-icon"
          loading="lazy"
          onError={e => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
          style={{
            left: `${t.x}%`,
            top: `${t.y}%`,
            width: t.size,
            height: t.size,
            opacity: t.op,
            '--dur': `${t.dur}s`,
            '--dly': `${t.dly}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="hero">
      <TechBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="hero-status">
            <span className="status-dot" aria-hidden />
            {me.status} · {me.location}
          </p>
          <h1 className="hero-name">
            Kuldeepsinh
            <br />
            Rajput.
          </h1>
          <p className="hero-title">{me.title}</p>
          <p className="hero-lines">
            {heroLines.map((l, i) => (
              <span key={i}>
                {l}
                {i < heroLines.length - 1 && <br />}
              </span>
            ))}
          </p>
          <div className="hero-ctas">
            <ArrowLink href="#projects" variant="solid">View projects</ArrowLink>
            <ArrowLink href={me.github} variant="ghost">GitHub</ArrowLink>
            <ArrowLink href={me.linkedin} variant="ghost">LinkedIn</ArrowLink>
            <ArrowLink href={`mailto:${me.email}`} variant="ghost">Email</ArrowLink>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
