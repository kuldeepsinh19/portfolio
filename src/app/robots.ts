import type { MetadataRoute } from 'next';
import { me } from '@/lib/data';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${me.site}/sitemap.xml`,
  };
}
