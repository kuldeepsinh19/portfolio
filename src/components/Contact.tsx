import { me } from '@/lib/data';
import { Reveal } from './Reveal';
import styles from './Contact.module.css';

export function Contact() {
  const links = [
    { label: 'Email', value: me.email, href: `mailto:${me.email}` },
    { label: 'LinkedIn', value: 'kuldeepsinh-rajput', href: me.linkedin, external: true },
    { label: 'GitHub', value: 'kuldeepsinh19', href: me.github, external: true },
    { label: 'Phone', value: me.phone, href: `tel:${me.phone.replace(/\s/g, '')}` },
  ];
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <Reveal className={styles.layout}>
          <div>
            <p className="eyebrow">
              <b>Contact</b>
            </p>
            <h2 id="contact-title" className={styles.title}>
              Let&apos;s <em>connect.</em>
            </h2>
            <p className="lede">
              Open to backend and AI engineering roles, and to conversations about agentic workflows,
              SaaS architecture or anything in this portfolio.
            </p>
            <a href={`mailto:${me.email}`} className={`btn btn-primary ${styles.cta}`}>
              Send an email <span aria-hidden>→</span>
            </a>
          </div>

          <ul className={styles.list}>
            {links.map(l => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  <span className={styles.k}>{l.label}</span>
                  <span className={styles.v}>{l.value}</span>
                  <span className={styles.arrow} aria-hidden>
                    {l.external ? '↗' : '→'}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
