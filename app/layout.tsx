import './globals.css';
import type { Metadata } from 'next';
import ThemeToggle from './ThemeToggle';
import BirdAnimations from './BirdAnimations';
import ThemeScript from './ThemeScript';

export const metadata: Metadata = {
  title: 'Notely',
  description: 'A simple place to jot down ideas',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="relative min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        {/* Background image layer */}
        <div className="absolute inset-0 z-0 bg-[url('/forest-bottom.png')] bg-no-repeat bg-bottom bg-cover dark:brightness-75 opacity-90" />

        <BirdAnimations />

        {/* Foreground content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <header className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
            <h1 className="text-xl font-bold">🌲 Notely</h1>
            <ThemeToggle />
          </header>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
