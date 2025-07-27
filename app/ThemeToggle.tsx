'use client';

import { useEffect, useState } from 'react';

// This helper function safely gets the initial theme on the client side.
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      return 'dark';
    }
  }
  return 'light';
};

export default function ThemeToggle() {
  // Initialize state directly from localStorage.
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  // This effect now only runs when the theme is changed by the user.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded"
    >
      Toggle to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}
