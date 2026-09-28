import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <p style={{ color: '#555', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase' }}>404</p>
      <h1 style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>
        Page not found.
      </h1>
      <Link href="/" className="btn btn-solid" style={{ marginTop: 16 }}>
        Back to home
      </Link>
    </main>
  );
}
