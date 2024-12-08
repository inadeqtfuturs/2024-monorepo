import React from 'react';
import * as runtime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';

import { getBlogPages, getPage, type Page } from '@content';
import getGithubRepoInfo from '@/lib/getGithubRepoInfo';
import RecentProjects from '@/components/RecentProjects';
import RecentWriting from '@/components/RecentWriting';

async function Home() {
  const pageData = await getPage({ slug: 'index' });
  if (!pageData) {
    return null;
  }
  // most recent 2 posts
  const pages = await getBlogPages();
  const [first, second] = pages.slice(-2);
  const repositories = await getGithubRepoInfo('inadeqtfuturs', [
    'garden',
    'next-mdx-relations',
    'if-sf',
  ]);

  const { content } = pageData;
  const { default: Content } = await evaluate(content, {
    ...runtime,
    Fragment: (props: object) =>
      React.createElement('section', {
        className: 'mdx',
        ...props,
      }),
    jsx: runtime.jsx,
  });

  return (
    <main className='index'>
      <Content />
      <RecentWriting posts={[second, first] as Page[]} />
      {repositories && <RecentProjects repositories={repositories} />}
    </main>
  );
}

export default Home;
