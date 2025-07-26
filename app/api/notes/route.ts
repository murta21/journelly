import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/notes → fetch all notes
export async function GET() {
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: true }); 

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(notes);
}

// POST /api/notes → create a new note
export async function POST(req: NextRequest) {
  const { content } = await req.json();

  if (!content || typeof content !== 'string') {
    return NextResponse.json({ error: 'Invalid note content' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('notes')
    .insert([{ content }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  const { error } = await supabase.from('notes').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}