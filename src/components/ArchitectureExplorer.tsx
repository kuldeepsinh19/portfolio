'use client';

import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { caseStudies } from '@/lib/case-studies';
import { FlowDiagram } from './FlowDiagram';
import { SectionHeader } from './SectionHeader';
import styles from './ArchitectureExplorer.module.css';

/**
 * Tabbed explorer over the case-study architectures. Implements the WAI-ARIA
 * tabs pattern: arrow keys / Home / End move between tabs.
 */
export function ArchitectureExplorer() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();
  const study = caseStudies[active];

  function onKeyDown(e: React.KeyboardEvent) {
    const last = caseStudies.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = active === last ? 0 : active + 1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = active === 0 ? last : active - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section id="system-design" className="section" aria-labelledby="sd-title">
      <div className="container">
        <SectionHeader
          index="03"
          label="System design"
          id="sd-title"
          title={
            <>
              Explore the <em>architecture.</em>
            </>
          }
          lede="Pick a system to see how a request moves through it — and the design decisions behind the shape."
        />

        <div className={styles.layout}>
          <div role="tablist" aria-label="Systems" aria-orientation="vertical" className={styles.tabs} onKeyDown={onKeyDown}>
            {caseStudies.map((c, i) => (
              <button
                key={c.slug}
                ref={el => {
                  tabs.current[i] = el;
                }}
                role="tab"
                type="button"
                id={`${base}-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`${base}-panel`}
                tabIndex={i === active ? 0 : -1}
                className={styles.tab}
                onClick={() => setActive(i)}
              >
                <span className={styles.tabIndex}>{c.index}</span>
                <span className={styles.tabText}>
                  <span className={styles.tabTitle}>{c.architecture.short}</span>
                  <span className={styles.tabSub}>{c.architecture.title}</span>
                </span>
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`${base}-panel`}
            aria-labelledby={`${base}-tab-${active}`}
            className={styles.panel}
            key={study.slug}
          >
            <FlowDiagram flow={study.architecture} />
            <div className={styles.why}>
              <p className="eyebrow">Why it&apos;s built this way</p>
              <ul>
                {study.decisions.slice(0, 2).map(d => (
                  <li key={d.title}>
                    <strong>{d.title}.</strong> {d.body}
                  </li>
                ))}
              </ul>
              <Link href={`/projects/${study.slug}`} className="link-arrow">
                {study.title} case study <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
