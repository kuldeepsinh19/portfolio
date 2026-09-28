import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import {
  Stats,
  FeaturedProjects,
  Work,
  Experience,
  OpenSource,
  Skills,
  Certifications,
  Contact,
} from '@/components/Sections';

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <FeaturedProjects />
        <Work />
        <Experience />
        <OpenSource />
        <Skills />
        <Certifications />
        <Contact />
      </main>
    </>
  );
}
