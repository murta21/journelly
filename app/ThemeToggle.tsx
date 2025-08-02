'use client';

import { useState } from 'react';

type Theme = 'light' | 'dark';

// We receive the initial theme from the server component (layout.tsx) as a prop.
export default function ThemeToggle({ initialTheme }: { initialTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Set the cookie to expire in one year.
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;

    // --- THE FIX ---
    // Instead of replacing the whole className, we specifically remove the old
    // theme and add the new one, leaving the font class untouched.
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded"
    >
      Toggle to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}
