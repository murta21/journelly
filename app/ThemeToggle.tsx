'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load saved theme on first mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('dark', saved === 'dark');
    }
  }, []);

  // Apply theme class + save to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    console.log('Theme is:', theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
    >
      Toggle to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}
