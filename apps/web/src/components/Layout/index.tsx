import Link from 'next/link';
import React, { type PropsWithChildren } from 'react';

import styles from './index.module.css';
import dynamic from 'next/dynamic';

const ToggleTheme = dynamic(() => import('./ToggleTheme'), {
  ssr: false,
});

const menuConfig = [
  { label: 'writing', href: '/garden' },
  { label: 'projects', href: '/projects' },
  { label: 'changelog', href: '/changelog' },
  { label: 'about', href: '/about' },
];

const footerMenu = [
  { href: 'https://github.com/inadeqtfuturs', label: 'github' },
  { href: 'https://www.polywork.com/inadeqt_futurs', label: 'polywork' },
];

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <header className={styles.sharedLayout}>
        <Link href='/' aria-label='home'>
          home
          <div className='brand-logo' />
        </Link>
        <nav>
          <ul>
            {menuConfig.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className={styles.headerLink}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer className={styles.sharedLayout}>
        <nav>
          <ul>
            {footerMenu.map(({ label, href }) => (
              <li key={label}>
                <Link href={href}>{label}</Link>
                {label !== 'polywork' && (
                  <span className={styles.spacer}>/</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <ToggleTheme />
      </footer>
    </>
  );
}

export default Layout;
