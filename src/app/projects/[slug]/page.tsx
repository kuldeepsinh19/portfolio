import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { caseStudies, getCaseStudy } from '@/lib/case-studies';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { FlowDiagram } from '@/components/FlowDiagram';
import { StudyMeta } from '@/components/FeaturedWork';
import styles from './page.module.css';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  const title = `${study.title} — Case study`;
  return {
    title,
    description: study.summary,
    alternates: { canonical: `/projects/${study.slug}` },
    openGraph: { title, description: study.summary, type: 'article', url: `/projects/${study.slug}` },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();

  const i = caseStudies.findIndex(c => c.slug === study.slug);
  const next = caseStudies[(i + 1) % caseStudies.length];
  const links = study.links.filter((l): l is { label: string; href: string } => Boolean(l.href));

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main" className={styles.page}>
        <div className="container">
          <Link href="/#projects" className={styles.back}>
            <span aria-hidden>←</span> All case studies
          </Link>

          <header className={styles.header}>
            <StudyMeta study={study} />
            <h1 className={styles.title}>{study.title}</h1>
            <p className={styles.subtitle}>{study.subtitle}</p>
          </header>

          <div className={styles.layout}>
            <div className={styles.body}>
              <section aria-labelledby="overview" className={styles.block}>
                <h2 id="overview" className={styles.h2}>Overview</h2>
                <div className="prose">
                  {study.overview.map(p => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
              </section>

              <section aria-label="Problem and solution" className={`${styles.block} ${styles.pair}`}>
                <div>
                  <h2 className={styles.h2}>Problem</h2>
                  <p className={styles.text}>{study.problem}</p>
                </div>
                <div>
                  <h2 className={styles.h2}>Solution</h2>
                  <p className={styles.text}>{study.solution}</p>
                </div>
              </section>

              <section aria-labelledby="architecture" className={styles.block}>
                <h2 id="architecture" className={styles.h2}>Technical architecture</h2>
                <FlowDiagram flow={study.architecture} />
              </section>

              <section aria-labelledby="contributions" className={styles.block}>
                <h2 id="contributions" className={styles.h2}>My contributions</h2>
                <ul className={styles.list}>
                  {study.contributions.map(c => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </section>

              {study.extras?.map(extra => (
                <section key={extra.title} aria-label={extra.title} className={styles.block}>
                  <h2 className={styles.h2}>{extra.title}</h2>
                  {extra.items.some(it => it.term) ? (
                    <dl className={styles.defs}>
                      {extra.items.map(it => (
                        <div key={it.text}>
                          <dt>{it.term}</dt>
                          <dd>{it.text}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <ul className={styles.chips}>
                      {extra.items.map(it => (
                        <li key={it.text}>{it.text}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              <section aria-labelledby="decisions" className={styles.block}>
                <h2 id="decisions" className={styles.h2}>Engineering decisions</h2>
                <div className={styles.decisions}>
                  {study.decisions.map((d, n) => (
                    <article key={d.title}>
                      <span className={styles.dIndex}>{String(n + 1).padStart(2, '0')}</span>
                      <h3>{d.title}</h3>
                      <p>{d.body}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section aria-labelledby="impact" className={styles.block}>
                <h2 id="impact" className={styles.h2}>Impact</h2>
                <ul className={styles.impact}>
                  {study.impact.map(m => (
                    <li key={m.label}>
                      {m.value ? <span className={styles.iValue}>{m.value}</span> : null}
                      <span className={styles.iLabel}>{m.label}</span>
                      {m.note ? <span className={styles.iNote}>{m.note}</span> : null}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className={styles.aside} aria-label="Project facts">
              <dl className={styles.facts}>
                <div>
                  <dt>Type</dt>
                  <dd>{study.kind}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{study.status}</dd>
                </div>
                <div>
                  <dt>Technologies</dt>
                  <dd>
                    <ul className={styles.tags}>
                      {study.stack.map(t => (
                        <li key={t} className="tag">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                {links.length > 0 && (
                  <div>
                    <dt>Links</dt>
                    <dd className={styles.links}>
                      {links.map(l => (
                        <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="link-arrow">
                          {l.label} <span aria-hidden>↗</span>
                        </a>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
              {study.confidentiality ? <p className={styles.conf}>{study.confidentiality}</p> : null}
            </aside>
          </div>

          <nav aria-label="Next case study" className={styles.next}>
            <span className="eyebrow">Next case study</span>
            <Link href={`/projects/${next.slug}`}>
              <span className={styles.nextIndex}>{next.index}</span> {next.title} <span aria-hidden>→</span>
            </Link>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
