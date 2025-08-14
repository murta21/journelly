
import './globals.css';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import ThemeToggle from './ThemeToggle';
import BirdAnimations from './BirdAnimations';
import StarrySky from './StarrySky';
import { createClient } from '@/lib/supabase/server';

import { Quicksand, Caveat } from 'next/font/google';

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Journelly',
  description: 'A simple place for your journey of ideas',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const ck = await cookies();
  const theme = ck.get('theme')?.value || 'light';

  return (
    <html lang="en" className={`${quicksand.variable} ${caveat.variable} ${theme}`}>
      <body className={`relative min-h-screen font-sans bg-gray-50 text-gray-900 dark:bg-[#0d1117] dark:text-white`}>
        
        <StarrySky />
        <BirdAnimations />

        <div className="absolute inset-0 z-0 bg-[url('/forest-bottom.png')] bg-no-repeat bg-bottom bg-cover dark:brightness-50 opacity-90" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <header className="relative z-20 p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
            <div>
              <a href="#" className="block text-xs text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 mb-1">
                made by Murtaza
              </a>
              {/* --- UPDATED TITLE --- */}
              <a href="/" className="text-xl font-bold">🌿 Journelly</a>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <form action="/auth/logout" method="post">
                  <button type="submit" className="text-sm hover:underline">Logout</button>
                </form>
              ) : (
                 <a href="/login" className="text-sm hover:underline">Login</a>
              )}
              <ThemeToggle initialTheme={theme as 'light' | 'dark'} />
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
