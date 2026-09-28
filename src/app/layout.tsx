import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const title = 'Kuldeepsinh Rajput — Backend & Agentic AI Engineer';
const description =
  'Backend & Agentic AI Engineer with 3+ years building Node.js / TypeScript systems on AWS for a platform serving 2M+ users. Open-source AI agents, RAG platforms and LLM infrastructure.';

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL('https://portfolio-xi-eight-000yuu2s96.vercel.app'),
  openGraph: { title, description, type: 'website', url: '/' },
  twitter: { card: 'summary', title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#000000' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
