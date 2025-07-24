'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDarkPreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const fallback = isDarkPreferred ? 'dark' : 'light';

    // only accept valid values
    const initial = stored === 'dark' || stored === 'light' ? stored : fallback;

    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const next: 'light' | 'dark' = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 border rounded text-sm bg-gray-200 dark:bg-gray-800 dark:text-white"
    >
      Toggle {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
