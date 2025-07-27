import React from 'react';

// This script is injected into the <head> to block rendering and
// prevent a flash of the incorrect theme. It runs before any React code.
const themeScript = `
  (function() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    // If theme is 'light' or not set, we do nothing, as light is the default.
  })();
`;

const ThemeScript = () => {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
};

export default ThemeScript;
