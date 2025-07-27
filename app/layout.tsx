import './globals.css';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import ThemeToggle from './ThemeToggle';
import BirdAnimations from './BirdAnimations';
import StarrySky from './StarrySky';

export const metadata: Metadata = {
  title: 'Notely',
  description: 'A simple place to jot down ideas',
  icons: {
    icon: '/favicon.ico',
  },
};

// Make the component async to correctly handle the cookies function
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // By splitting this into two lines, we help TypeScript correctly infer the type.
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'light';

  // Apply the theme class directly to the <html> tag during server render.
  return (
    <html lang="en" className={theme}>
      <head>
        {/* Make sure ThemeScript.tsx is deleted as it's no longer needed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="relative min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0d1117] dark:text-white">
        
        <StarrySky />
        <BirdAnimations />

        <div className="absolute inset-0 z-0 bg-[url('/forest-bottom.png')] bg-no-repeat bg-bottom bg-cover dark:brightness-50 opacity-90" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <header className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
            <h1 className="text-xl font-bold">🌲 Notely</h1>
            {/* Pass the initial theme to the toggle component */}
            <ThemeToggle initialTheme={theme as 'light' | 'dark'} />
          </header>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
