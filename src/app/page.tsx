import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Metrics } from '@/components/Metrics';
import { About } from '@/components/About';
import { FeaturedWork } from '@/components/FeaturedWork';
import { AiEngineering } from '@/components/AiEngineering';
import { ArchitectureExplorer } from '@/components/ArchitectureExplorer';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Page() {
  return (
    <>
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
        <Contact />
      </main>
      <Footer />
    </>
  );
}
