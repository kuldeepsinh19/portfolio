'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function Reveal({
  children,
  delay = 0,
  y = 28,
  fill = false,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  fill?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-12%' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      style={fill ? { height: '100%' } : undefined}
    >
      {children}
    </motion.div>
  );
}

export function Container({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <div className="container" style={style}>{children}</div>;
}

export function Label({ n, text, dark }: { n: string; text: string; dark: boolean }) {
  return (
    <div className={`label ${dark ? 'on-dark' : 'on-light'}`}>
      <span className="label-n">{n}</span>
      <div className="label-rule" />
      <span className="label-text">{text}</span>
    </div>
  );
}

export function SectionHead({
  n,
  label,
  title,
  lead,
  dark,
}: {
  n: string;
  label: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  dark: boolean;
}) {
  return (
    <Reveal>
      <Label n={n} text={label} dark={dark} />
      <h2 className="section-title" style={{ color: dark ? '#fff' : '#000', marginBottom: lead ? 24 : 72 }}>
        {title}
      </h2>
      {lead && <p className={`section-lead ${dark ? 'on-dark' : 'on-light'}`}>{lead}</p>}
    </Reveal>
  );
}

export function Chip({ children, dark = true }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={`chip ${dark ? 'on-dark' : 'on-light'}`}>{children}</span>;
}

export function ArrowLink({
  href,
  children,
  variant = 'underline',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'underline' | 'solid' | 'ghost';
}) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      className={`btn btn-${variant}`}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
      {external && <span aria-hidden>↗</span>}
    </a>
  );
}
