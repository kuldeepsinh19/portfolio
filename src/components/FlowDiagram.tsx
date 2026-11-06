import type { Flow, NodeKind } from '@/lib/types';
import styles from './FlowDiagram.module.css';

const kindLabel: Record<NodeKind, string> = {
  input: 'Input',
  agent: 'Agent',
  tool: 'Tools',
  process: 'Process',
  guard: 'Guard',
  human: 'Human',
  output: 'Output',
};

/**
 * Responsive architecture diagram rendered as an ordered list, so it stays
 * readable at any width and to screen readers. `compact` renders a single
 * wrapping line of nodes for cards.
 */
export function FlowDiagram({ flow, compact = false }: { flow: Flow; compact?: boolean }) {
  if (compact) {
    return (
      <ol className={styles.compact} aria-label={flow.title}>
        {flow.steps.map(s => (
          <li key={s.label} data-kind={s.kind}>
            {s.items ? s.items.join(' / ') : s.label}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>
        <span className={styles.title}>{flow.title}</span>
        <span className={styles.sub}>{flow.caption}</span>
      </figcaption>
      <ol className={styles.flow}>
        {flow.steps.map((s, i) => (
          <li key={s.label} className={styles.step} data-kind={s.kind ?? 'process'}>
            <span className={styles.marker} aria-hidden>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className={styles.node}>
              <div className={styles.head}>
                <span className={styles.label}>{s.label}</span>
                {s.kind ? <span className={styles.kind}>{kindLabel[s.kind]}</span> : null}
              </div>
              {s.detail ? <p className={styles.detail}>{s.detail}</p> : null}
              {s.items ? (
                <ul className={styles.items}>
                  {s.items.map(it => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      {flow.note ? <p className={styles.note}>{flow.note}</p> : null}
    </figure>
  );
}
