import type { Metadata } from 'next';
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'Kuldeepsinh Rajput — Backend & AI Engineer',
  description:
    'Backend Engineer with 3+ years building scalable Node.js systems on AWS, serving 2M+ users. Specialized in microservices and agentic AI systems.',
  metadataBase: new URL('https://kuldeepsinhrajput.dev'),
  openGraph: {
    title: 'Kuldeepsinh Rajput — Backend & AI Engineer',
    description: 'Backend & AI Engineer — Node.js · AWS · LangChain · 2M+ users served',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
