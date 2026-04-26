'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { me, experiences, projects, skills, certifications } from '@/lib/data';

// ─── primitives ───────────────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  y = 28,
  fill = false,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  fill?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-12%' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      style={fill ? { height: '100%' } : undefined}
    >
      {children}
    </motion.div>
  );
}

function Container({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 max(24px, 6vw)', ...style }}>
      {children}
    </div>
  );
}

function Label({ n, text, dark }: { n: string; text: string; dark: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 64,
      }}
    >
      <span style={{ color: dark ? '#3a3a3a' : '#c7c7cc', fontSize: 12, letterSpacing: '0.06em' }}>
        {n}
      </span>
      <div style={{ flex: 1, height: 1, background: dark ? '#1d1d1f' : '#e5e5e5' }} />
      <span
        style={{
          color: dark ? '#555' : '#86868b',
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {text}
      </span>
    </div>
  );
}

// ─── Tech background ──────────────────────────────────────────────────────────

const techStack = [
  { slug: 'amazonaws',     x: 8,  y: 8,  size: 44, op: 0.10, dur: 6.0, dly: 0.0 },
  { slug: 'nodedotjs',     x: 30, y: 5,  size: 36, op: 0.08, dur: 7.2, dly: 1.2 },
  { slug: 'typescript',    x: 52, y: 9,  size: 30, op: 0.07, dur: 5.8, dly: 0.8 },
  { slug: 'docker',        x: 74, y: 6,  size: 34, op: 0.08, dur: 8.0, dly: 2.1 },
  { slug: 'github',        x: 91, y: 13, size: 28, op: 0.07, dur: 6.5, dly: 0.5 },
  { slug: 'react',         x: 83, y: 30, size: 30, op: 0.07, dur: 7.0, dly: 1.8 },
  { slug: 'nextdotjs',     x: 63, y: 22, size: 28, op: 0.06, dur: 8.5, dly: 0.3 },
  { slug: 'redis',         x: 16, y: 25, size: 24, op: 0.06, dur: 9.0, dly: 2.5 },
  { slug: 'terraform',     x: 41, y: 20, size: 22, op: 0.05, dur: 6.8, dly: 1.5 },
  { slug: 'elasticsearch', x: 89, y: 47, size: 26, op: 0.07, dur: 6.2, dly: 0.7 },
  { slug: 'githubactions', x: 71, y: 42, size: 22, op: 0.05, dur: 7.5, dly: 3.0 },
  { slug: 'openai',        x: 56, y: 38, size: 28, op: 0.06, dur: 7.0, dly: 1.0 },
  { slug: 'vercel',        x: 13, y: 44, size: 22, op: 0.05, dur: 9.2, dly: 2.2 },
  { slug: 'googlecloud',   x: 79, y: 64, size: 32, op: 0.07, dur: 8.3, dly: 0.6 },
  { slug: 'mysql',         x: 93, y: 74, size: 26, op: 0.06, dur: 5.0, dly: 1.7 },
  { slug: 'anthropic',     x: 61, y: 60, size: 24, op: 0.05, dur: 8.8, dly: 3.5 },
  { slug: 'javascript',    x: 46, y: 70, size: 26, op: 0.05, dur: 8.5, dly: 0.9 },
  { slug: 'linux',         x: 86, y: 86, size: 24, op: 0.06, dur: 6.3, dly: 2.8 },
  { slug: 'express',       x: 69, y: 88, size: 22, op: 0.05, dur: 7.2, dly: 1.3 },
  { slug: 'langchain',     x: 38, y: 55, size: 24, op: 0.05, dur: 7.8, dly: 4.0 },
];

function TechBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {techStack.map(t => (
        <img
          key={t.slug}
          src={`https://cdn.simpleicons.org/${t.slug}/ffffff`}
          alt=""
          className="tech-icon"
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

// ─── Nav ─────────────────────────────────────────────────────────────────────

const navItems = ['experience', 'projects', 'skills', 'certifications', 'contact'];

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        height: 52,
        background: scrolled ? 'rgba(0,0,0,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'background 0.4s ease, border-color 0.4s ease',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a
          href="#hero"
          style={{ color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.01em' }}
        >
          KR
        </a>
        <div className="nav-links">
          {navItems.map(id => (
            <a
              key={id}
              href={`#${id}`}
              style={{ color: '#86868b', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#86868b')}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>
      </Container>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: '14vh',
        position: 'relative',
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            style={{
              color: '#555',
              fontSize: 12,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: 36,
            }}
          >
            Available for opportunities
          </p>
          <h1
            style={{
              color: '#fff',
              fontSize: 'clamp(64px, 11vw, 148px)',
              fontWeight: 700,
              lineHeight: 0.93,
              letterSpacing: '-0.045em',
              marginBottom: 44,
            }}
          >
            Kuldeepsinh
            <br />
            Rajput.
          </h1>
          <p
            style={{
              color: '#86868b',
              fontSize: 'clamp(18px, 2.2vw, 30px)',
              fontWeight: 400,
              lineHeight: 1.45,
              maxWidth: 520,
              letterSpacing: '-0.01em',
            }}
          >
            Node.js. AWS. Agentic AI.
            <br />
            I build backends at scale — then build
            <br />
            the agents that build them faster.
          </p>
        </motion.div>
      </Container>

      <TechBackground />

      {/* scroll line */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ color: '#3a3a3a', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          scroll
        </span>
        <motion.div
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, #444, transparent)', transformOrigin: 'top' }}
        />
      </div>
    </section>
  );
}

// ─── Stats ───────────────────────────────────────────────────────────────────

const stats = [
  { value: '2M+',   label: 'Users Served' },
  { value: '3+',    label: 'Years Experience' },
  { value: '99.9%', label: 'Uptime Achieved' },
  { value: '5K+',   label: 'Concurrent Users' },
];

function Stats() {
  return (
    <section style={{ background: '#fff', padding: '88px 0' }}>
      <Container>
        <div className="stats-grid">
          {stats.map(({ value, label }, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <div
                style={{
                  borderTop: '1px solid #e5e5e5',
                  paddingTop: 28,
                  paddingRight: 32,
                  paddingBottom: 28,
                }}
              >
                <div
                  style={{
                    fontSize: 'clamp(40px, 5vw, 72px)',
                    fontWeight: 700,
                    color: '#000',
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    marginBottom: 10,
                  }}
                >
                  {value}
                </div>
                <div style={{ color: '#86868b', fontSize: 14, letterSpacing: '0.01em' }}>{label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

function Experience() {
  return (
    <section id="experience" style={{ background: '#000', padding: '120px 0' }}>
      <Container>
        <Reveal>
          <Label n="01" text="Experience" dark />
          <h2
            style={{
              color: '#fff',
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              marginBottom: 80,
              lineHeight: 1,
            }}
          >
            Where I&apos;ve built.
          </h2>
        </Reveal>

        {experiences.map((exp, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="exp-row">
              <div>
                <div style={{ color: '#555', fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>
                  {exp.period}
                </div>
                <div style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                  {exp.company}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    color: '#555',
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    border: '1px solid #2a2a2a',
                    padding: '3px 10px',
                    borderRadius: 100,
                    marginTop: 8,
                  }}
                >
                  {exp.type}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: '#fff',
                    fontSize: 'clamp(18px, 2vw, 24px)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    marginBottom: 28,
                  }}
                >
                  {exp.role}
                </div>
                <ul style={{ listStyle: 'none' }}>
                  {exp.bullets.map((b, bi) => (
                    <li
                      key={bi}
                      style={{
                        color: '#6e6e73',
                        fontSize: 15,
                        lineHeight: 1.6,
                        paddingLeft: 20,
                        position: 'relative',
                        marginBottom: 10,
                      }}
                    >
                      <span style={{ position: 'absolute', left: 0, color: '#3a3a3a' }}>—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function Projects() {
  return (
    <section id="projects" style={{ background: '#fff', padding: '120px 0' }}>
      <Container>
        <Reveal>
          <Label n="02" text="Projects" dark={false} />
          <h2
            style={{
              color: '#000',
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              marginBottom: 80,
              lineHeight: 1,
            }}
          >
            What I&apos;ve shipped.
          </h2>
        </Reveal>

        <div className="projects-grid">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={(i % 2) * 0.1} fill>
              <div
                style={{
                  background: '#000',
                  padding: 'max(40px, 5vw)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  minHeight: 320,
                }}
              >
                <div>
                  <div
                    style={{
                      color: '#fff',
                      fontSize: 'clamp(20px, 2vw, 26px)',
                      fontWeight: 700,
                      letterSpacing: '-0.025em',
                      marginBottom: 16,
                      lineHeight: 1.2,
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{
                      color: '#6e6e73',
                      fontSize: 14,
                      lineHeight: 1.65,
                      marginBottom: 28,
                    }}
                  >
                    {p.desc}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {p.tags.map(t => (
                      <span
                        key={t}
                        style={{
                          color: '#555',
                          fontSize: 11,
                          border: '1px solid #2a2a2a',
                          padding: '4px 12px',
                          borderRadius: 100,
                          letterSpacing: '0.03em',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 36 }}>
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: '#fff',
                        fontSize: 13,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        borderBottom: '1px solid #333',
                        paddingBottom: 2,
                        transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.borderBottomColor = '#fff')}
                      onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.borderBottomColor = '#333')}
                    >
                      View project <span>↗</span>
                    </a>
                  ) : (
                    <span style={{ color: '#3a3a3a', fontSize: 13 }}>Internal project</span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────

function SkillRow({ skill, i }: { skill: (typeof skills)[0]; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });

  return (
    <div ref={ref} className="skill-row">
      <div style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>{skill.name}</div>
      <div style={{ color: '#555', fontSize: 13, textAlign: 'right' }}>{skill.years}</div>
      <div className="skill-bar-col" style={{ background: '#1d1d1f', height: 1, borderRadius: 1, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.2, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', background: '#fff' }}
        />
      </div>
    </div>
  );
}

function Skills() {
  return (
    <section id="skills" style={{ background: '#000', padding: '120px 0' }}>
      <Container>
        <Reveal>
          <Label n="03" text="Skills" dark />
          <h2
            style={{
              color: '#fff',
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              marginBottom: 80,
              lineHeight: 1,
            }}
          >
            What I work with.
          </h2>
        </Reveal>

        <div>
          {skills.map((s, i) => (
            <SkillRow key={s.name} skill={s} i={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── Certifications ───────────────────────────────────────────────────────────

function Certifications() {
  return (
    <section id="certifications" style={{ background: '#fff', padding: '120px 0' }}>
      <Container>
        <Reveal>
          <Label n="04" text="Certifications" dark={false} />
          <h2
            style={{
              color: '#000',
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              marginBottom: 80,
              lineHeight: 1,
            }}
          >
            What I&apos;ve earned.
          </h2>
        </Reveal>

        <div className="certs-grid">
          {certifications.map((cert, i) => (
            <Reveal key={cert.title} delay={i * 0.1}>
              <a
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'block',
                  background: '#fff',
                  padding: 'max(36px, 4vw)',
                  textDecoration: 'none',
                  transition: 'background 0.25s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#f5f5f7')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#fff')}
              >
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#86868b',
                    marginBottom: 24,
                  }}
                >
                  {cert.issuer}
                </div>
                <div
                  style={{
                    color: '#000',
                    fontSize: 'clamp(18px, 2vw, 24px)',
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    lineHeight: 1.2,
                    marginBottom: 14,
                  }}
                >
                  {cert.title}
                </div>
                <div style={{ color: '#86868b', fontSize: 13, marginBottom: 36 }}>{cert.date}</div>
                <div
                  style={{
                    color: '#000',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    borderTop: '1px solid #e5e5e5',
                    paddingTop: 20,
                  }}
                >
                  View certificate <span>↗</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" style={{ background: '#000', padding: '120px 0 80px' }}>
      <Container>
        <Reveal>
          <Label n="05" text="Contact" dark />
          <h2
            style={{
              color: '#fff',
              fontSize: 'clamp(48px, 8vw, 112px)',
              fontWeight: 700,
              letterSpacing: '-0.045em',
              lineHeight: 0.92,
              marginBottom: 56,
            }}
          >
            Let&apos;s build
            <br />
            something.
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <a
            href={`mailto:${me.email}`}
            style={{
              display: 'inline-block',
              color: '#86868b',
              fontSize: 'clamp(15px, 1.8vw, 22px)',
              textDecoration: 'none',
              borderBottom: '1px solid #2a2a2a',
              paddingBottom: 4,
              marginBottom: 56,
              transition: 'color 0.25s, border-color 0.25s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = '#fff';
              el.style.borderBottomColor = '#fff';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = '#86868b';
              el.style.borderBottomColor = '#2a2a2a';
            }}
          >
            {me.email}
          </a>

          <div style={{ display: 'flex', gap: 40, marginBottom: 88 }}>
            {[
              { label: 'LinkedIn', href: me.linkedin },
              { label: 'GitHub', href: me.github },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#424245',
                  fontSize: 14,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#424245')}
              >
                {label} <span>↗</span>
              </a>
            ))}
          </div>

          <div
            style={{
              borderTop: '1px solid #1d1d1f',
              paddingTop: 32,
              display: 'flex',
              justifyContent: 'space-between',
              color: '#3a3a3a',
              fontSize: 12,
              letterSpacing: '0.02em',
            }}
          >
            <span>© 2026 Kuldeepsinh Rajput</span>
            <span>Ahmedabad, India</span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <Experience />
      <Projects />
      <Skills />
      <Certifications />
      <Contact />
    </>
  );
}
