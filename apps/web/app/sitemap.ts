import { getBlogPages } from '@content';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = 'https://alexchristie.dev';
  const blogPages = await getBlogPages({
    filter: ({ frontmatter: { draft } }) => !draft,
  });

  const blogPageEntries = blogPages.map(({ params: { slug } }) => ({
    url: `${domain}/garden/${slug.join('/')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  })) as MetadataRoute.Sitemap;

  const staticPages = ['', 'garden', 'about'].map((x) => ({
    url: `${domain}/${x}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  })) as MetadataRoute.Sitemap;

  return [...staticPages, ...blogPageEntries];
}
