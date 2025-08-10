'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // persist/clear server cookies so layout can see `user`
        await fetch('/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, session }),
          credentials: 'include',          // <— important
        })

        if (event === 'SIGNED_IN') {
          router.refresh()
          router.push('/')
        } else if (event === 'SIGNED_OUT') {
          router.refresh()
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [supabase, router])

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-end mb-4">
        <a href="/" className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" aria-label="Close">
          {/* X icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round"
               strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </a>
      </div>

      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Welcome to Journelly
      </h1>
      <Auth
        supabaseClient={supabase}
        theme="dark"
        appearance={{
          theme: ThemeSupa,
          className: {
            container: 'supabase-auth',                // was: className: 'supabase-auth'
            input: 'bg-[#0b1220] text-white border-slate-600',
            anchor: 'text-gray-400 hover:text-gray-200',
            button: 'bg-emerald-500 hover:bg-emerald-600',
          },
          variables: {
            dark: {
              colors: {
                brand: '#10b981',
                brandAccent: '#059669',
                inputBackground: '#0b1220', // near-black
                inputText: '#ffffff',
                inputBorder: '#334155',
              },
            },
            default: {
              colors: {
                brand: '#10b981',
                brandAccent: '#059669',
                inputBackground: '#ffffff',
                inputText: '#0f172a',
                inputBorder: '#d1d5db',
              },
              radii: { inputBorderRadius: '12px', buttonBorderRadius: '12px' },
            }
          },
        }}
        providers={['google']}
      />
    </div>
  )
}
