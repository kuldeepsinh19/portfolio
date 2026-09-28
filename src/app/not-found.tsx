import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#1e1e1e',
      color: '#d4d4d4',
      fontFamily: 'Consolas, monospace',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#6a9955', marginBottom: 8 }}>{'// 404 — file not found'}</div>
        <div style={{ color: '#569cd6', marginBottom: 24 }}>
          <span style={{ color: '#c586c0' }}>throw</span>{' '}
          <span style={{ color: '#4ec9b0' }}>new Error</span>
          {'('}<span style={{ color: '#ce9178' }}>"Page does not exist"</span>{')'}
        </div>
        <Link href="/" style={{ color: '#9cdcfe', textDecoration: 'underline' }}>
          cd ~/home
        </Link>
      </div>
    </div>
  );
}
