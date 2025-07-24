'use client';

import { useEffect, useState, FormEvent } from 'react';

type Note = {
  id: number;
  content: string;
};

export default function Page() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      });

      if (res.ok) {
        const addedNote = await res.json();
        setNotes((prev) => [...prev, addedNote]);
        setNewNote('');
      } else {
        console.error('Failed to add note');
      }
    } catch (err) {
      console.error('Request failed:', err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-10">
      {/* Centered title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">📝 Notely</h1>
        <p className="text-gray-600 mt-2">A simple place to jot down ideas</p>
      </div>

      {/* Main content box */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a new note..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add Note
          </button>
        </form>

        {/* Notes list */}
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note.id}
              className="p-4 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition"
            >
              {note.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
