'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Theme = 'light' | 'dark';

export default function ThemeToggle({ initialTheme }: { initialTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  // This state ensures we only render the dynamic styles on the client
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const isMoreNotes = pathname === '/more-notes';

  // This effect runs only once on the client, after the initial render
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  // On the server, and for the initial client render, we show a generic button.
  // This guarantees the server and client HTML match perfectly.
  if (!isClient) {
    return (
      <button
        className="px-4 py-2 rounded font-semibold bg-gray-200 text-gray-700"
        aria-label="Toggle theme"
        disabled
      >
        {initialTheme === 'light' ? 'daytime' : 'nighttime'}
      </button>
    );
  }

  // --- THE FIX ---
  // Define the full class strings so Tailwind's JIT compiler can find them.
  const lightClasses = isMoreNotes
    ? "bg-[#b64926] text-[#5b3412] hover:bg-[#b64926]"
    : 'bg-sky-200 text-sky-800 hover:bg-sky-300';
  const darkClasses = isMoreNotes
    ? "bg-[#4c2048] text-blue-200 hover:bg-[#4c2048]"
    : 'bg-blue-900 text-blue-200 hover:bg-blue-800';

  const buttonStyle = isMoreNotes
    ? { backgroundColor: theme === 'light' ? '#b64926' : '#4c2048' }
    : undefined;

  // After the component has mounted on the client, we render the fully styled button.
  return (
    <button
      onClick={toggleTheme}
      style={buttonStyle}
      className={`px-4 py-2 rounded font-semibold transition-colors duration-300 ${
        theme === 'light' ? lightClasses : darkClasses
      }`}
    >
      {theme === 'light' ? 'daytime' : 'nighttime'}
    </button>
  );
}
