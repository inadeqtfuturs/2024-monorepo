import React from 'react';
import { getBlogPages } from '@content';

export const dynamicParams = false;

async function GardenPage({ params: { tag } }: { params: { tag: string } }) {
  const pages = await getBlogPages({
    filter: ({ frontmatter: { tags } }) => tags.includes(tag),
  });

  if (!pages) {
    return null;
  }

  console.log('@--> pages', pages.length);

  return (
    <div>
      <h1>garden page for {tag}</h1>
    </div>
  );
}

export async function generateStaticParams() {
  const pages = await getBlogPages({
    filter: ({ frontmatter: { draft } }) => !draft,
  });

  return [...new Set(pages.flatMap(({ frontmatter: { tags } }) => tags))].map(
    (tag) => ({
      slug: tag.toLowerCase().replace(' ', '-'),
    }),
  );
}

export default GardenPage;
