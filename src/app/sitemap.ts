import type { MetadataRoute } from 'next';
import { caseStudies } from '@/lib/case-studies';
import { me } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: me.site, changeFrequency: 'monthly', priority: 1 },
    ...caseStudies.map(c => ({
      url: `${me.site}/projects/${c.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
