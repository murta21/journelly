import { NextResponse, NextRequest } from 'next/server'

let notes = [
    { id: 1, content: 'Sample note 1' },
    { id: 2, content: 'Sample note 2' },
  ];

export async function GET() {
  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.content || typeof body.content !== 'string') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const newNote = {
    id: Date.now(), // use current timestamp as id
    content: body.content,
  };

  notes.push(newNote);
  return NextResponse.json(newNote); // return the added note
}