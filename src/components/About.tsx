import { about } from '@/lib/data';
import { Reveal } from './Reveal';
import styles from './About.module.css';

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className={`container ${styles.layout}`}>
        <Reveal>
          <p className="eyebrow">
            <b>About</b>
          </p>
          <h2 id="about-title" className={`h-section ${styles.title}`}>
            Engineering <em>beyond</em> the code.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className={styles.body}>
          <div className="prose">
            {about.paragraphs.map(p => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <blockquote className={styles.principle}>
            <p>
              My approach is simple: <span>{about.principle}</span>
            </p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
