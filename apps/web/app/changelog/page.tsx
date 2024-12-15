import { getChangelogEntries } from '@content';
import React from 'react';
import ChangelogEntry from './components/ChangelogEntry';
import styles from './index.module.css';

async function Changelog() {
  const changelogEntries = await getChangelogEntries();

  return (
    <main className='changelog'>
      <div className={styles.header}>
        <h1>changelog</h1>
        <p>a running stream of events updated roughly monthly</p>
      </div>
      {changelogEntries.map((entry, i) => (
        <ChangelogEntry entry={entry} open={i === 0} key={entry.filePath} />
      ))}
    </main>
  );
}

export default Changelog;
