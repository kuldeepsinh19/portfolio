'use client';

import { useEffect, useState } from 'react';
import { me } from '@/lib/data';
import styles from './Nav.module.css';

export const navItems = [
  { id: 'projects', label: 'Projects' },
  { id: 'ai-engineering', label: 'AI Engineering' },
  { id: 'system-design', label: 'System Design' },
  { id: 'experience', label: 'Experience' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in view (homepage only — other pages have no matches).
  useEffect(() => {
    const sections = navItems
      .map(n => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={styles.bar} data-scrolled={scrolled || open}>
      <nav className={`container ${styles.inner}`} aria-label="Primary">
        <a href={`tel:${me.phone.replace(/\s/g, '')}`} className={styles.phone}>
          {me.phone}
        </a>

        <ul className={styles.links}>
          {navItems.map(n => (
            <li key={n.id}>
              <a href={`/#${n.id}`} aria-current={active === n.id ? 'true' : undefined}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(o => !o)}
        >
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
          <span className={styles.burger} data-open={open} aria-hidden />
        </button>
      </nav>

      <div id="mobile-menu" className={styles.mobile} data-open={open} hidden={!open}>
        <ul className="container">
          {navItems.map(n => (
            <li key={n.id}>
              <a href={`/#${n.id}`} onClick={() => setOpen(false)}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
