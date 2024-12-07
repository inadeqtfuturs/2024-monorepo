import React from 'react';
import * as runtime from 'react/jsx-runtime';
import type { Metadata } from 'next';
import { evaluate } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { getPage } from '@content';
import defaultMetadata from '@/lib/metadata';

export const metadata: Metadata = defaultMetadata({ title: 'about' });

async function About() {
  const pageData = await getPage({ slug: 'about' });
  if (!pageData) {
    return null;
  }

  const { default: Content } = await evaluate(pageData.content, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    Fragment: (props: object) =>
      React.createElement('section', {
        className: 'mdx',
        ...props,
      }),
  });

  return (
    <main className='about'>
      <Content />
    </main>
  );
}

export default About;
