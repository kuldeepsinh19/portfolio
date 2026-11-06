import { stackGroups } from '@/lib/content';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';
import styles from './Stack.module.css';

export function Stack() {
  return (
    <section id="stack" className="section" aria-labelledby="stack-title">
      <div className="container">
        <SectionHeader
          index="05"
          label="Stack"
          id="stack-title"
          title={
            <>
              Tools I <em>reach for.</em>
            </>
          }
          lede="Grouped by the kind of problem they solve. Everything here is something I've used in real work and can talk through in depth."
        />
        <div className={styles.groups}>
          {stackGroups.map((g, i) => (
            <Reveal key={g.title} className={styles.group} delay={i * 0.04}>
              <div className={styles.head}>
                <h3>{g.title}</h3>
                <p>{g.blurb}</p>
              </div>
              <ul>
                {g.items.map(t => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
