import { metrics } from '@/lib/data';
import { Reveal } from './Reveal';
import styles from './Metrics.module.css';

/** Verified headline numbers. Sources are documented next to the data. */
export function Metrics() {
  return (
    <section aria-label="Highlights" className={styles.wrap}>
      <dl className={`container ${styles.grid}`}>
        {metrics.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.06} className={styles.item}>
            <dt className={styles.label}>{m.label}</dt>
            <dd className={styles.value}>{m.value}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
