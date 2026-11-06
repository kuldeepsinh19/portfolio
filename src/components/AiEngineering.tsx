import { aiPractices, specPipeline } from '@/lib/content';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';
import styles from './AiEngineering.module.css';

export function AiEngineering() {
  return (
    <section id="ai-engineering" className="section" aria-labelledby="ai-title">
      <div className="container">
        <SectionHeader
          index="02"
          label="AI Engineering"
          id="ai-title"
          title={
            <>
              Agents that use <em>real tools</em> — with real limits.
            </>
          }
          lede="My AI work is less about chat and more about plumbing and judgement: which systems an agent can reach, what it is allowed to do there, and where a person takes over."
        />

        <div className={styles.practices}>
          {aiPractices.map((p, i) => (
            <Reveal key={p.title} as="article" className={styles.practice} delay={(i % 2) * 0.08}>
              <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              <ul aria-label="Examples">
                {p.examples.map(e => (
                  <li key={e} className="tag">
                    {e}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className={styles.spec}>
          <div className={styles.specHead}>
            <p className="eyebrow">
              <b>Example</b> from my role at Avesta HQ
            </p>
            <h3>{specPipeline.title}</h3>
            <p>{specPipeline.context}</p>
          </div>
          <ol className={styles.stages}>
            {specPipeline.stages.map((s, i) => (
              <li key={s.label}>
                <span className={styles.stageN}>
                  {String(i + 1).padStart(2, '0')} / {s.label}
                </span>
                <span className={styles.stageRole}>{s.role}</span>
                <p>{s.body}</p>
              </li>
            ))}
            <li className={styles.human}>
              <span className={styles.stageN}>05 / Hand-off</span>
              <span className={styles.stageRole}>Developer</span>
              <p>A person reviews the result and owns what ships.</p>
            </li>
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
