// This file is for creating a Supabase client for use in Client Components
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Make sure to set these in a .env.local file
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
