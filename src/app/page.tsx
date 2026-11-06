import { me } from '@/lib/data';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Metrics } from '@/components/Metrics';
import { About } from '@/components/About';
import { FeaturedWork } from '@/components/FeaturedWork';
import { AiEngineering } from '@/components/AiEngineering';
import { ArchitectureExplorer } from '@/components/ArchitectureExplorer';
import { Experience } from '@/components/Experience';
import { Stack } from '@/components/Stack';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: me.name,
  jobTitle: me.role,
  url: me.site,
  email: `mailto:${me.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Ahmedabad', addressCountry: 'IN' },
  sameAs: [me.github, me.linkedin],
  knowsAbout: me.techSummary,
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Metrics />
        <About />
        <FeaturedWork />
        <AiEngineering />
        <ArchitectureExplorer />
        <Experience />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
