'use client';

import React, { useEffect, useState } from 'react';

function ToggleTheme() {
  const [theme, setTheme] = useState(global.window?.__theme || 'light');

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    global.window?.__setPreferredTheme(isDark ? 'light' : 'dark');
  };

  useEffect(() => {
    global.window.__onThemeChange = setTheme;
  }, []);

  return (
    <button type='button' onClick={toggleTheme}>
      {theme}
    </button>
  );
}

export default ToggleTheme;
