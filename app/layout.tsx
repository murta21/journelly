import './globals.css';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import ThemeToggle from './ThemeToggle';
import BirdAnimations from './BirdAnimations';
import StarrySky from './StarrySky';

// 1. Import the new font
import { Quicksand } from 'next/font/google';

// 2. Configure the font
const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand', // Use a CSS variable
});

// 3. Update the site metadata
export const metadata: Metadata = {
  title: 'Journelly',
  description: 'A simple place for your journey of ideas',
  icons: {
    icon: '/favicon.ico',
  },
};

// The function is now correctly marked as async
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // We now correctly await the cookies() call
  const ck = await cookies()
  const theme = ck.get('theme')?.value || 'light';

  return (
    <html lang="en" className={`${quicksand.variable} ${theme}`}>
      <head>
        {/* Add the Caveat font for the sticky notes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      {/* 4. Apply the new font class to the body */}
      <body className={`relative min-h-screen font-sans bg-gray-50 text-gray-900 dark:bg-[#0d1117] dark:text-white`}>
        
        <StarrySky />
        <BirdAnimations />

        <div className="absolute inset-0 z-0 bg-[url('/forest-bottom.png')] bg-no-repeat bg-bottom bg-cover dark:brightness-50 opacity-90" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <header className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
            {/* --- UPDATED HEADER --- */}
            <div>
              <a
                href="#" // You can replace this with your portfolio or social media link
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors mb-1"
              >
                By [Your Name]
              </a>
              <h1 className="text-xl font-bold">🌿 Journelly</h1>
            </div>
            <ThemeToggle initialTheme={theme as 'light' | 'dark'} />
          </header>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
