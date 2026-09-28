'use client';

import { useEffect, useState } from 'react';
import { me } from '@/lib/data';

const navItems = [
  { id: 'projects', label: 'Projects' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'open-source', label: 'Open Source' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <nav className={`nav ${scrolled || open ? 'nav-solid' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="nav-brand" onClick={() => setOpen(false)}>
          <span className="nav-mono">KR</span>
          <span className="nav-name">{me.name}</span>
        </a>

        <div className="nav-links">
          {navItems.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className="nav-link">
              {label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span className={open ? 'bar bar-1 x' : 'bar bar-1'} />
          <span className={open ? 'bar bar-2 x' : 'bar bar-2'} />
        </button>
      </div>

      {open && (
        <div className="nav-sheet">
          {navItems.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className="nav-sheet-link" onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
