import React, { PropsWithChildren } from 'react';
import Link from 'next/link';

const menuConfig = [
  { label: 'writing', href: '/garden' },
  { label: 'work', href: '/work' },
  { label: 'about', href: '/about' },
];

const footerMenu = [
  { href: 'https://github.com/inadeqtfuturs', label: 'github' },
  { href: 'https://twitter.com/speculative_dev', label: 'twitter' },
  { href: 'https://www.polywork.com/inadeqt_futurs', label: 'polywork' },
];

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <header>
        <Link href="/" aria-label="home">
          home
          <div className="brand-logo" />
        </Link>
        <nav>
          <ul>
            {menuConfig.map(({ label, href }) => (
              <li key={label}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <nav>
          <ul>
            {footerMenu.map(({ label, href }) => (
              <li key={label}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </footer>
    </>
  );
}

export default Layout;
