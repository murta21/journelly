// app/api/notes/batch-insert/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { notes } = await req.json();

  if (!Array.isArray(notes)) {
    return NextResponse.json({ error: 'Invalid notes array' }, { status: 400 });
  }

  // Map guest notes into rows for Supabase
  const rows = notes.map((n: { content: string }) => ({
    content: n.content,
    user_id: user.id,
  }));

  const { error } = await supabase.from('notes').insert(rows);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
