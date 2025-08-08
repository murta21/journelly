// app/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function POST(req: NextRequest) {
  const body = await req.json(); // { event, session }
  const res = NextResponse.json({ ok: true });

  // hook Supabase into our request/response cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const event = String(body?.event || '');
  const session = body?.session;

  // Persist on any event that contains/refreshes a session
  if (
    session &&
    ['SIGNED_IN', 'SIGNED_UP', 'INITIAL_SESSION', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)
  ) {
    const { access_token, refresh_token } = session;
    await supabase.auth.setSession({ access_token, refresh_token });
  }

  // Clear on sign out
  if (event === 'SIGNED_OUT') {
    await supabase.auth.signOut();
  }

  return res;
}
