import React from 'react';
import PostExcerpt from '@/components/RecentWriting/PostExcerpt';
import { getBlogPages } from '@content';

import styles from './index.module.css'

async function Garden() {
  const blogPages = await getBlogPages({
    filter: ({ frontmatter: { draft } }) => !draft,
  });
  return (
    <main className={styles.gardenIndex}>
      <h1>garden</h1>
      {blogPages
        .sort(({ frontmatter: { date: a } }, { frontmatter: { date: b } }) =>
          new Date(a) < new Date(b) ? 1 : -1,
        )
        .map((post) => (
          <PostExcerpt post={post} key={post.frontmatter.title} />
        ))}
    </main>
  );
}

export default Garden;
