'use client';

import React, { useEffect, useState } from 'react';

import styles from './index.module.css';

function ToggleTheme() {
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState(global.window?.__theme || 'light');

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    global.window?.__setPreferredTheme(isDark ? 'light' : 'dark');
  };

  useEffect(() => {
    global.window.__onThemeChange = setTheme;
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button type='button' className={styles.toggle}>
        loading
      </button>
    );
  }

  return (
    <button type='button' onClick={toggleTheme} className={styles.toggle}>
      {theme}
    </button>
  );
}

export default ToggleTheme;
