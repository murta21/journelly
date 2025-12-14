// app/more-notes/page.tsx

'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

type Note = {
  id: number;
  content: string;
  created_at: string;
};

export default function MoreNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  // Track dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    
    // Watch for class changes on html element
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Simple auth effect - stay on More Notes even when logged in
  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (ignore) return;

        if (!user) {
          setIsLoading(false);
          setTimeout(() => {
            if (!ignore) setShowLoginOverlay(true);
          }, 600);
        } else {
          const response = await fetch('/api/notes', { credentials: 'include' });
          if (response.ok && !ignore) {
            const data: Note[] = await response.json();
            setNotes(data);
          }
          if (!ignore) setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking user or fetching notes', error);
        if (!ignore) setIsLoading(false);
      }
    }

    loadData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (ignore) return;

        if (event === 'SIGNED_IN') {
          // Close overlay and fetch notes
          setShowLoginOverlay(false);
          const response = await fetch('/api/notes', { credentials: 'include' });
          if (response.ok && !ignore) {
            const data: Note[] = await response.json();
            setNotes(data);
          }
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setNotes([]);
          setShowLoginOverlay(true);
        }
      }
    );

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white text-2xl bg-black/50 p-4 rounded-lg">Loading your journel...</p>
      </div>
    );
  }

  return (
    // REMOVED THE OUTER <> AND THE FIXED BACKGROUND DIV
    <div className="relative z-10 p-4 sm:p-6 md:p-8">
      <h1 className="text-4xl font-brand text-white text-center mb-8" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          Your Journ<span 
            style={{ 
              display: 'inline-block', 
              transform: 'rotate(-12deg)',
              // Here is the color property you were looking for
              color: '#ffe600ee' 
            }}
          >e</span>l
        </h1>

      {notes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-6 bg-yellow-100/90 dark:bg-yellow-200/90 backdrop-blur-sm rounded-lg shadow-lg font-caveat text-xl text-gray-800"
            >
              <p>{note.content}</p>
              <p className="text-xs text-right mt-4 text-gray-600">
                {new Date(note.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-white bg-black/50 p-6 rounded-lg">
          <p>You haven't written any notes yet.</p>
        </div>
      )}

      {showLoginOverlay && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60">
          <div 
            className="max-w-md w-full mx-4 p-8 rounded-lg shadow-lg relative"
            style={{ backgroundColor: isDark ? '#4c2048' : '#5C2E0A' }}
          >
            <div className="flex justify-end mb-4">
              <a
                href="/"
                className="hover:text-white cursor-pointer"
                style={{ color: isDark ? '#bfdbfe' : '#FFD699' }}
                aria-label="Close"
              >
                {/* X icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </a>
            </div>

            <h1 
              className="text-2xl font-bold text-center mb-6"
              style={{ color: isDark ? '#bfdbfe' : '#FFD699' }}
            >
              Welcome to Journelly
            </h1>

            <Auth
              supabaseClient={supabase}
              theme="auto"
              appearance={{
                theme: ThemeSupa,
                className: {
                  container: 'supabase-auth',
                  input: 'bg-[#0b1220] text-white border-slate-600',
                  anchor: 'text-gray-400 hover:text-gray-200',
                  button: 'bg-emerald-500 hover:bg-emerald-600',
                },
                variables: {
                  dark: {
                    colors: {
                      brand: '#10b981',
                      brandAccent: '#059669',
                      inputBackground: '#0b1220',
                      inputText: '#ffffff',
                      inputBorder: '#4c5056ff',
                    },
                  },
                  default: {
                    colors: {
                      brand: '#10b981',
                      brandAccent: '#059669',
                      inputBackground: '#ffffff',
                      inputText: '#0f172a',
                      inputBorder: '#d1d5db',
                      defaultButtonBackground: '#292929ff',
                      defaultButtonBackgroundHover: '#313131ff',
                      defaultButtonBorder: '#3f6cab',
                      defaultButtonText: '#ffffffff',
                    },
                    radii: { inputBorderRadius: '12px', buttonBorderRadius: '12px' },
                  },
                },
              }}
              providers={['google']}
            />
          </div>
        </div>
      )}
    </div>
  );
}