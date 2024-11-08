import React from 'react';
import { getPages } from '../../../../content.config';

export const dynamicParams = false;

async function GardenPage({ params: { slug } }: { params: { slug: string } }) {
  const pageData = await getPages(
    ({ params: { slug: pageSlug } }) => pageSlug[0] === slug,
  );
  console.log('@--> pageData', pageData);
  return (
    <div>
      <h1>garden page for {slug}</h1>
    </div>
  );
}

export async function generateStaticParams() {
  const pages = await getPages();

  return pages.reduce(
    (a, { params: { slug }, frontmatter: { draft } }) => {
      if (!draft) {
        a.push({ slug: slug[0] });
      }
      return a;
    },
    [] as { slug?: string }[],
  );
}

export default GardenPage;
