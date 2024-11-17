import React from 'react';
import Button from '@if/ui/components/button';
import { getBlogPages, getPage } from '../../content.config';
import getGithubRepoInfo from '@/lib/getGithubRepoInfo';

async function Home() {
  const pageData = await getPage({ slug: 'index' });
  // most recent 2 posts
  const pages = await getBlogPages();
  const [first, second] = pages.slice(-2);
  const repositories = await getGithubRepoInfo('inadeqtfuturs', [
    'garden',
    'next-mdx-relations',
    'if-sf',
  ]);
  console.log('@--> first', first);
  return (
    <div>
      <h1>hello world -- root page</h1>
    </div>
  );
}

export default Home;
