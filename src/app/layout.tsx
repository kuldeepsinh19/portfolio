import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import { me } from '@/lib/data';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif-display',
  display: 'swap',
});
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-code', display: 'swap' });

const description =
  'Backend Engineer specializing in Node.js, TypeScript, AWS and agentic AI systems. I build scalable SaaS backends and engineer AI workflows that investigate issues and contribute to software delivery.';

export const metadata: Metadata = {
  metadataBase: new URL(me.site),
  title: {
    default: `${me.name} — Backend Engineer | Agentic AI & Software Engineering`,
    template: `%s · ${me.name}`,
  },
  description,
  authors: [{ name: me.name, url: me.site }],
  keywords: [
    'Backend Engineer',
    'Node.js',
    'TypeScript',
    'AWS',
    'Agentic AI',
    'AI agents',
    'MCP',
    'PostgreSQL',
    'Supabase',
    'SaaS architecture',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: me.name,
    title: `${me.name} — I Build Backend Systems. I Engineer AI Workflows.`,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${me.name} — Backend & Agentic AI Engineer`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a0d14',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
