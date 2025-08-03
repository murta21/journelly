import { createClient } from '@/lib/supabase/server'; // Use the new server client
import { NextRequest, NextResponse } from 'next/server';

// GET /api/notes → fetch all notes for the logged-in user
export async function GET() {
  const supabase = await createClient();
  
  // Get the current user from the session
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch notes that belong to the current user
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id) // Only get notes for this user
    .order('created_at', { ascending: true }); 

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(notes);
}

// POST /api/notes → create a new note for the logged-in user
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content } = await req.json();

  if (!content || typeof content !== 'string') {
    return NextResponse.json({ error: 'Invalid note content' }, { status: 400 });
  }

  // Insert the new note with the user's ID
  const { data, error } = await supabase
    .from('notes')
    .insert([{ content, user_id: user.id }]) // Add the user_id
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/notes → delete a note for the logged-in user
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { id } = await req.json();

  // Delete the note only if the ID and the user_id match
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
