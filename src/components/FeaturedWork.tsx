import Link from 'next/link';
import { caseStudies } from '@/lib/case-studies';
import type { CaseStudy } from '@/lib/types';
import { FlowDiagram } from './FlowDiagram';
import { MoreProjects } from './MoreProjects';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';
import styles from './FeaturedWork.module.css';

export function StudyMeta({ study }: { study: CaseStudy }) {
  return (
    <div className={styles.meta}>
      <span className={styles.index}>{study.index}</span>
      <span className="tag">{study.kind}</span>
      <span className="status" data-tone={study.statusTone === 'live' ? undefined : study.statusTone}>
        {study.status}
      </span>
    </div>
  );
}

function Flagship({ study }: { study: CaseStudy }) {
  const metric = study.impact.find(i => i.value);
  return (
    <Reveal as="article" className={styles.flagship}>
      <div className={styles.flagshipText}>
        <StudyMeta study={study} />
        <h3 className={styles.flagshipTitle}>
          <Link href={`/projects/${study.slug}`}>{study.title}</Link>
        </h3>
        <p className={styles.subtitle}>{study.subtitle}</p>
        <p className={styles.summary}>{study.overview[1]}</p>

        {metric ? (
          <div className={styles.metric}>
            <span className={styles.metricValue}>{metric.value}</span>
            <span className={styles.metricLabel}>
              {metric.label}
              {metric.note ? <small>{metric.note}</small> : null}
            </span>
          </div>
        ) : null}

        <ul className={styles.points}>
          {study.contributions.slice(0, 4).map(c => (
            <li key={c}>{c}</li>
          ))}
        </ul>

        <Link href={`/projects/${study.slug}`} className="link-arrow">
          Read the full case study <span aria-hidden>→</span>
        </Link>
      </div>
      <FlowDiagram flow={study.architecture} />
    </Reveal>
  );
}

function Card({ study, delay }: { study: CaseStudy; delay: number }) {
  return (
    <Reveal as="article" className={styles.card} delay={delay}>
      <StudyMeta study={study} />
      <h3 className={styles.cardTitle}>
        <Link href={`/projects/${study.slug}`} className={styles.stretch}>
          {study.title}
        </Link>
      </h3>
      <p className={styles.subtitle}>{study.subtitle}</p>
      <p className={styles.summary}>{study.summary}</p>
      <div className={styles.cardFlow}>
        <FlowDiagram flow={study.architecture} compact />
      </div>
      <div className={styles.cardFoot}>
        <ul className={styles.tags} aria-label="Technologies">
          {study.stack.slice(0, 5).map(t => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>
        <span className={styles.more} aria-hidden>
          Case study →
        </span>
      </div>
    </Reveal>
  );
}

export function FeaturedWork() {
  const [flagship, ...rest] = caseStudies;
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeader
          index="01"
          label="Selected work"
          id="projects-title"
          title={
            <>
              Case studies from <em>real systems.</em>
            </>
          }
          lede="Agent workflows, AI products and backend architecture — each with the problem, the design, my part in it and an honest status. Company work is anonymised."
        />
        <Flagship study={flagship} />
        <div className={styles.grid}>
          {rest.map((s, i) => (
            <Card key={s.slug} study={s} delay={(i % 2) * 0.08} />
          ))}
        </div>
        <MoreProjects />
      </div>
    </section>
  );
}
