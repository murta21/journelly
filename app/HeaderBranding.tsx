'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function HeaderBranding() {
  const pathname = usePathname();
  const isMoreNotes = pathname === '/more-notes';
  const [isDark, setIsDark] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Update header border color based on route and theme
  useEffect(() => {
    const header = containerRef.current?.closest('header');
    if (header) {
      if (isMoreNotes) {
        header.style.borderColor = isDark ? '#bfdbfe' : '#FFD699';
      } else {
        header.style.borderColor = ''; // Reset to default
      }
    }
  }, [isMoreNotes, isDark]);

  // On /more-notes: orange (#FFD699) in light mode, light blue (#bfdbfe) in dark mode
  // On other pages: default gray in light mode, light blue in dark mode
  const getTextColor = () => {
    if (isMoreNotes) {
      return isDark ? '#bfdbfe' : '#FFD699';
    }
    return undefined; // Use default Tailwind classes
  };

  const textColor = getTextColor();

  return (
    <div ref={containerRef}>
      <a
        href="#"
        className={`block text-xs hover:text-green-600 dark:hover:text-green-400 mb-1 ${!isMoreNotes ? 'text-gray-700 dark:text-[#bfdbfe]' : ''}`}
        style={textColor ? { color: textColor } : undefined}
      >
        made by Murtaza
      </a>
      <a 
        href="/" 
        className={`text-xl font-bold ${!isMoreNotes ? 'dark:text-[#bfdbfe]' : ''}`}
        style={textColor ? { color: textColor } : undefined}
      >
        🌿 Journelly
      </a>
    </div>
  );
}
