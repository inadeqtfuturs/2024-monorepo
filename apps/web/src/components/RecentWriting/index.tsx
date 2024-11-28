import React from 'react';
import type { Page } from '@content';
import Link from 'next/link';

import styles from './index.module.css';

function RecentWriting({ posts }: { posts: Page[] }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3>recent writing</h3>
        <Link href='/garden'>see more</Link>
      </div>
      <div className={styles.wrapper}>
        {posts.map(
          ({
            frontmatter: { date, excerpt, title, tags },
            params: { slug },
          }) => (
            <div key={title} className={styles.itemWrapper}>
              <span className={styles.date}>
                {new Date(date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <Link href={`/garden/${slug}`} className={styles.title}>
                {title}
              </Link>
              <p className={styles.excerpt}>{excerpt}</p>
              <div className={styles.tagWrapper}>
                {tags.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

export default RecentWriting;
