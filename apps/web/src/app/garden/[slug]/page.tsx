import React from 'react';
import * as runtime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';
import rehypePrettyCode from 'rehype-pretty-code';
import { getBlogPages } from '../../../../content.config';

export const dynamicParams = false;

async function GardenPage({ params: { slug } }: { params: { slug: string } }) {
  const [pageData] = await getBlogPages({
    filter: ({ params: { slug: pageSlug } }) => pageSlug[0] === slug,
  });

  if (!pageData) {
    return null;
  }

  const { content, frontmatter, metadata } = pageData;

  const { default: Content } = await evaluate(content, {
    ...runtime,
    rehypePlugins: [rehypePrettyCode],
  });

  return (
    <div>
      <h1>garden page for {slug}</h1>
      <Content />
    </div>
  );
}

export async function generateStaticParams() {
  const pages = await getBlogPages();

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
