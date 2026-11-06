import { clientSites, sideProjects } from '@/lib/content';
import { Reveal } from './Reveal';
import styles from './MoreProjects.module.css';

/** Smaller projects shown under the featured case studies. */
export function MoreProjects() {
  return (
    <div className={styles.wrap} role="region" aria-labelledby="more-title">
      <h2 id="more-title" className={styles.title}>
        More projects
      </h2>
      <div className={styles.grid}>
        {sideProjects.map((p, i) => {
          const links = p.links.filter((l): l is { label: string; href: string } => Boolean(l.href));
          return (
            <Reveal as="article" key={p.title} className={styles.item} delay={(i % 2) * 0.06}>
              <div className={styles.meta}>
                <span className="tag">{p.kind}</span>
                <span className={styles.status}>{p.status}</span>
              </div>
              <h3>{p.title}</h3>
              <p className={styles.summary}>{p.summary}</p>
              <ul className={styles.points}>
                {p.points.map(pt => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <div className={styles.foot}>
                <span className={styles.stack}>{p.stack.join(' · ')}</span>
                {links.map(l => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="link-arrow">
                    {l.label} <span aria-hidden>↗</span>
                  </a>
                ))}
              </div>
            </Reveal>
          );
        })}
      </div>

      <p className={styles.clients}>
        <span>Also built — client websites:</span>
        {clientSites.map(c => (
          <a key={c.url} href={c.url} target="_blank" rel="noreferrer">
            {c.name} <span aria-hidden>↗</span>
          </a>
        ))}
      </p>
  </div>
  );
}
