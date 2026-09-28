'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  me,
  stats,
  featured,
  work,
  pipeline,
  outcomes,
  performance,
  experiences,
  contributions,
  clientSites,
  skills,
  certifications,
  type FeaturedProject,
  type Skill,
} from '@/lib/data';
import { Reveal, Container, SectionHead, Chip, ArrowLink } from './ui';

// ─── Stats ───────────────────────────────────────────────────────────────────

export function Stats() {
  return (
    <section className="sec sec-light sec-tight">
      <Container>
        <div className="stats-grid">
          {stats.map(({ value, label }, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <div className="stat">
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── Featured projects ───────────────────────────────────────────────────────

function ProjectCard({ p, flagship = false }: { p: FeaturedProject; flagship?: boolean }) {
  return (
    <article className={`pcard ${flagship ? 'pcard-flagship' : ''}`}>
      <div className="pcard-top">
        <span className="pcard-kind">{p.kind}</span>
        <span className="pcard-status">{p.status}</span>
      </div>

      <div className={flagship ? 'pcard-body-split' : undefined}>
        <div>
          <h3 className="pcard-name">{p.name}</h3>
          <p className="pcard-tagline">{p.tagline}</p>
          <p className="pcard-summary">{p.summary}</p>
        </div>
        <ul className="pcard-highlights">
          {p.highlights.map(h => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>

      <div className="pcard-foot">
        <div className="chips">
          {p.stack.map(s => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
        {p.caveat && <p className="pcard-caveat">Note: {p.caveat}</p>}
        <div className="pcard-links">
          <ArrowLink href={p.repo}>Source code</ArrowLink>
          {p.live && <ArrowLink href={p.live}>Live site</ArrowLink>}
        </div>
      </div>
    </article>
  );
}

export function FeaturedProjects() {
  const [flagship, ...rest] = featured;
  return (
    <section id="projects" className="sec sec-gray">
      <Container>
        <SectionHead
          n="01"
          label="Featured Projects"
          title={<>AI systems, built<br />in the open.</>}
          lead="Agentic pipelines, retrieval systems and LLM infrastructure — source on GitHub, with the limitations stated plainly."
          dark={false}
        />
        <div className="featured-grid">
          <Reveal fill>
            <ProjectCard p={flagship} flagship />
          </Reveal>
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.1} fill>
              <ProjectCard p={p} />
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="more-link">
            <ArrowLink href={`${me.github}?tab=repositories`}>All repositories on GitHub</ArrowLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

// ─── Professional work (+ agent pipeline + platform performance) ─────────────

export function Work() {
  return (
    <section id="work" className="sec sec-dark">
      <Container>
        <SectionHead n="02" label="Professional Work" title={<>What I&apos;ve shipped<br />in production.</>} dark />

        <div className="work-grid">
          {work.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08} fill>
              <div className="wcard">
                <div>
                  <h3 className="wcard-name">{p.name}</h3>
                  <p className="wcard-desc">{p.desc}</p>
                  <div className="chips">
                    {p.tags.map(t => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 32 }}>
                  {p.url ? (
                    <ArrowLink href={p.url}>View project</ArrowLink>
                  ) : (
                    <span className="muted-sm">Internal project</span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* SPEC-driven agent pipeline */}
        <div id="achievements" className="subsec">
          <Reveal>
            <div className="subsec-head">
              <span className="eyebrow">Achievements · Orchestrator AI Dev System</span>
              <div className="rule" />
            </div>
            <h3 className="subsec-title">
              SPEC-driven agents.
              <br />
              Production shipped.
            </h3>
            <p className="section-lead on-dark">
              Built a 4-agent autonomous development pipeline on a brownfield Node.js codebase serving
              2M+ users — moving from spec to production-grade code, reliably and at scale.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="pipeline-grid">
              {pipeline.map(stage => (
                <div key={stage.agent} className="stage">
                  <div className="stage-label">{stage.label}</div>
                  <div className="stage-agent">{stage.agent}</div>
                  <div className="stage-role">{stage.role}</div>
                  <div className="stage-desc">{stage.desc}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="outcome-grid">
              {outcomes.map(({ value, label }) => (
                <div key={label} className="outcome">
                  <div className="big-num">{value}</div>
                  <div className="muted-sm">{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* view.com.au platform performance */}
        <Reveal delay={0.15}>
          <div className="subsec">
            <div className="subsec-head">
              <span className="eyebrow">Platform Engineering</span>
              <div className="rule" />
              <a href="https://view.com.au" target="_blank" rel="noreferrer" className="subtle-link">
                view.com.au ↗
              </a>
            </div>

            <div className="perf-grid">
              <div>
                <h3 className="perf-title">
                  {performance.heading[0]}
                  <br />
                  {performance.heading[1]}
                </h3>
                <p className="perf-body">{performance.body}</p>
              </div>
              <div className="perf-tiles">
                {performance.tiles.map(({ value, label }) => (
                  <div key={label} className="perf-tile">
                    <div className="mid-num">{value}</div>
                    <div className="muted-xs">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

// ─── Experience ──────────────────────────────────────────────────────────────

export function Experience() {
  return (
    <section id="experience" className="sec sec-light">
      <Container>
        <SectionHead n="03" label="Experience" title={<>Where I&apos;ve built.</>} dark={false} />
        {experiences.map((exp, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="exp-row">
              <div>
                <div className="exp-period">{exp.period}</div>
                <div className="exp-company">{exp.company}</div>
                <div className="exp-type">{exp.type}</div>
              </div>
              <div>
                <div className="exp-role">{exp.role}</div>
                <ul className="dash-list">
                  {exp.bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
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

// ─── Open source + client websites ───────────────────────────────────────────

export function OpenSource() {
  return (
    <section id="open-source" className="sec sec-dark">
      <Container>
        <SectionHead
          n="04"
          label="Open Source"
          title={<>Contributing<br />upstream.</>}
          lead="Pull requests to OpenHands, the open-source AI software-development agent platform."
          dark
        />
        <div className="oss-list">
          {contributions.map((c, i) => (
            <Reveal key={c.number} delay={i * 0.06}>
              <a href={c.url} target="_blank" rel="noreferrer" className="oss-row">
                <span className={`badge ${c.status === 'Merged' ? 'badge-merged' : 'badge-draft'}`}>{c.status}</span>
                <span className="oss-title">{c.title}</span>
                <span className="oss-meta">
                  {c.repo} #{c.number} · {c.note} ↗
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="subsec">
          <Reveal>
            <div className="subsec-head">
              <span className="eyebrow">Client Websites</span>
              <div className="rule" />
            </div>
          </Reveal>
          <div className="client-grid">
            {clientSites.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.08} fill>
                <a href={s.url} target="_blank" rel="noreferrer" className="client-card">
                  <div className="client-name">{s.name} ↗</div>
                  <div className="client-desc">{s.desc}</div>
                  <div className="chips">
                    {s.tags.map(t => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── Skills ──────────────────────────────────────────────────────────────────

function SkillRow({ skill, i }: { skill: Skill; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });
  return (
    <div ref={ref} className="skill-row">
      <div className="skill-name">{skill.name}</div>
      <div className="skill-years">{skill.years}</div>
      <div className="skill-bar-col">
        <motion.div
          initial={{ width: '0%' }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.2, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', background: '#000' }}
        />
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="sec sec-light">
      <Container>
        <SectionHead n="05" label="Skills" title="What I work with." dark={false} />
        <div>
          {skills.map((s, i) => (
            <SkillRow key={s.name} skill={s} i={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── Certifications ──────────────────────────────────────────────────────────

export function Certifications() {
  return (
    <section id="certifications" className="sec sec-gray">
      <Container>
        <SectionHead n="06" label="Certifications" title={<>What I&apos;ve earned.</>} dark={false} />
        <div className="certs-grid">
          {certifications.map((cert, i) => (
            <Reveal key={cert.title} delay={i * 0.1} fill>
              <a href={cert.url} target="_blank" rel="noreferrer" className="cert">
                <div className="cert-issuer">{cert.issuer}</div>
                <div className="cert-title">{cert.title}</div>
                <div className="cert-date">{cert.date}</div>
                <div className="cert-cta">
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

export function Contact() {
  return (
    <section id="contact" className="sec sec-dark" style={{ paddingBottom: 72 }}>
      <Container>
        <Reveal>
          <div className="label on-dark">
            <span className="label-n">07</span>
            <div className="label-rule" />
            <span className="label-text">Contact</span>
          </div>
          <h2 className="contact-title">
            Let&apos;s build
            <br />
            something.
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <a href={`mailto:${me.email}`} className="contact-email">
            {me.email}
          </a>
          <div className="contact-links">
            <a href={`tel:${me.phone.replace(/\s/g, '')}`} className="contact-link">
              {me.phone}
            </a>
            <a href={me.linkedin} target="_blank" rel="noreferrer" className="contact-link">
              LinkedIn ↗
            </a>
            <a href={me.github} target="_blank" rel="noreferrer" className="contact-link">
              GitHub ↗
            </a>
          </div>
          <div className="footer">
            <span>© 2026 {me.name}</span>
            <span>{me.location}</span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
