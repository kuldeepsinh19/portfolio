import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

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
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
