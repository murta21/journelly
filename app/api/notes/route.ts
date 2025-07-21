import { NextResponse } from 'next/server'

export async function GET() {
  const sampleNotes = [
    { id: 1, content: 'Sample note 1' },
    { id: 2, content: 'Sample note 2' },
  ];

  return NextResponse.json(sampleNotes);
}
