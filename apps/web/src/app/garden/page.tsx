import React from 'react';
import PostExcerpt from '@/components/RecentWriting/PostExcerpt';
import { getBlogPages } from '@content';

async function Garden() {
  const blogPages = await getBlogPages({
    filter: ({ frontmatter: { draft } }) => !draft,
  });
  return (
    <div>
      <h1>garden</h1>
      {blogPages
        .sort(({ frontmatter: { date: a } }, { frontmatter: { date: b } }) =>
          new Date(a) < new Date(b) ? 1 : -1,
        )
        .map((post) => (
          <PostExcerpt post={post} key={post.frontmatter.title} />
        ))}
    </div>
  );
}

export default Garden;
