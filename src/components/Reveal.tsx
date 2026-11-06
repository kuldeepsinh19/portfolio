'use client';

import { MotionConfig, motion } from 'framer-motion';

/**
 * Fades content up once when it scrolls into view.
 * `reducedMotion="user"` drops the movement for visitors who ask for less motion,
 * without changing the server-rendered markup (no hydration mismatch).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'article';
}) {
  const Comp = motion[as];
  return (
    <MotionConfig reducedMotion="user">
      <Comp
        className={className}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </Comp>
    </MotionConfig>
  );
}
