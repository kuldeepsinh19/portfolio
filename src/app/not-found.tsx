import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main id="main" className={`container ${styles.page}`}>
      <p className="eyebrow">
        <b>404</b> Not found
      </p>
      <h1 className="h-section">
        This page <em>doesn&apos;t exist.</em>
      </h1>
      <p className="lede">The link may be outdated, or the case study may have moved.</p>
      <div className={styles.actions}>
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link href="/#projects" className="btn btn-ghost">
          See case studies
        </Link>
      </div>
    </main>
  );
}
