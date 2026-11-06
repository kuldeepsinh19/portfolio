import { hero, me } from '@/lib/data';
import { caseStudies } from '@/lib/case-studies';
import styles from './Hero.module.css';

export function Hero() {
  const flagship = caseStudies[0];
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.grid} aria-hidden />
      <div className={`container ${styles.layout}`}>
        <div className={styles.main}>
          <p className={`status rise ${styles.meta}`}>
            {me.status} · {me.location}
          </p>
          <p className={`mono rise rise-1 ${styles.role}`}>{me.role}</p>

          <h1 id="hero-title" className={`rise rise-1 ${styles.title}`}>
            <span>{hero.headline[0]}</span>{' '}
            <em>{hero.headline[1]}</em>
          </h1>

          <div className={`rise rise-2 ${styles.intro}`}>
            {hero.intro.map(p => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <p className={`mono rise rise-2 ${styles.tech}`}>
            {me.techSummary.map((t, i) => (
              <span key={t}>
                {i > 0 && <span className={styles.dot} aria-hidden>·</span>}
                {t}
              </span>
            ))}
          </p>

          <div className={`rise rise-3 ${styles.ctas}`}>
            <a href="#projects" className="btn btn-primary">
              Explore My Work <span aria-hidden>→</span>
            </a>
            <a href="#contact" className="btn btn-ghost">
              Let&apos;s Connect
            </a>
          </div>

          <ul className={`rise rise-4 ${styles.social}`} aria-label="Profiles">
            <li><a href={me.github} target="_blank" rel="noreferrer">GitHub ↗</a></li>
            <li><a href={me.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
            <li><a href={`mailto:${me.email}`}>Email</a></li>
          </ul>
        </div>

        <aside className={`rise rise-3 ${styles.card}`} aria-label="Flagship case study">
          <p className="eyebrow">
            <b>Flagship</b> case study
          </p>
          <p className={styles.cardTitle}>{flagship.title}</p>
          <p className={styles.cardSub}>{flagship.summary}</p>
          <div className={styles.cardMetric}>
            <span className={styles.cardValue}>{flagship.impact[0].value}</span>
            <span className={styles.cardLabel}>{flagship.impact[0].label}</span>
          </div>
          <ol className={styles.trace}>
            {flagship.architecture.steps.slice(0, 6).map(s => (
              <li key={s.label} data-kind={s.kind}>
                {s.items ? s.items.join(' · ') : s.label}
              </li>
            ))}
          </ol>
          <a href={`/projects/${flagship.slug}`} className="link-arrow">
            Read the case study <span aria-hidden>→</span>
          </a>
        </aside>
      </div>
    </section>
  );
}
