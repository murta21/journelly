'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  // The theme now only exists for the current session, defaulting to 'light'.
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // When the theme state changes, toggle the 'dark' class on the page.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <button
      onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded"
    >
      Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}
