import { ImageResponse } from 'next/og';
import { me } from '@/lib/data';

export const alt = `${me.name} — I Build Backend Systems. I Engineer AI Workflows.`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Social preview card, generated at build time. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#0a0d14',
          color: '#e8ebf1',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, color: '#a3abba', letterSpacing: 1 }}>
          {me.name} · {me.role}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
          <span>I Build Backend Systems.</span>
          <span style={{ color: '#e2b973' }}>I Engineer AI Workflows.</span>
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#6f7889' }}>{me.techSummary.join('  ·  ')}</div>
      </div>
    ),
    size,
  );
}
