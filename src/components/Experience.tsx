import { certifications, experiences } from '@/lib/data';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';
import styles from './Experience.module.css';

export function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="exp-title">
      <div className="container">
        <SectionHeader
          index="04"
          label="Experience"
          id="exp-title"
          title={
            <>
              Where I&apos;ve <em>built.</em>
            </>
          }
        />

        <ol className={styles.list}>
          {experiences.map((exp, i) => (
            <Reveal as="li" key={exp.role} className={styles.row} delay={i * 0.06}>
              <div className={styles.side}>
                <span className={styles.period}>{exp.period}</span>
                <span className={styles.company}>{exp.company}</span>
                <span className="tag">{exp.type}</span>
              </div>
              <div>
                <h3 className={styles.role}>{exp.role}</h3>
                <p className={styles.summary}>{exp.summary}</p>
                <ul className={styles.bullets}>
                  {exp.bullets.map(b => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className={styles.certs}>
          <h3 className="eyebrow">
            <b>Certifications</b>
          </h3>
          <ul>
            {certifications.map(c => (
              <li key={c.title}>
                <a href={c.url} target="_blank" rel="noreferrer">
                  <span className={styles.cTitle}>{c.title}</span>
                  <span className={styles.cMeta}>
                    {c.issuer} · {c.date}
                  </span>
                  <span className={styles.cArrow} aria-hidden>
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
