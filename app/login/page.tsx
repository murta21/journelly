'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client' // Use the new client from Step 2
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  // This will listen for when a user successfully signs in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // When the user is signed in, refresh the page to update the server session
        // and then redirect them to the homepage.
        router.refresh()
        router.push('/')
      }
    })

    // Cleanup the listener when the component is unmounted
    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase, router])

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Welcome to Journelly
      </h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google', 'github']} // You can choose your social login providers
        theme="dark" // You can set this to 'light' or remove it to match the system
      />
    </div>
  )
}
