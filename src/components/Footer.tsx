import { me } from '@/lib/data';

export function Footer() {
  return (
    <footer className="container" style={{ borderTop: '1px solid var(--line)' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'space-between',
          padding: '28px 0 40px',
          color: 'var(--text-3)',
          fontSize: 13,
        }}
      >
        <span>© {new Date().getFullYear()} {me.name}</span>
        <span>{me.location}</span>
      </div>
    </footer>
  );
}
