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

  async function handleDelete(id: number) {
    try {
      const res = await fetch('/api/notes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
      } else {
        console.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  }

  return (
    <div className="px-4 py-10">
      {/* Centered title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Notely</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">A simple place to jot down ideas</p>
      </div>

      {/* Main content box */}
      <div className="max-w-2xl mx-auto dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 mb-6">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a new note..."
            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Add
          </button>
        </form>

        {/* Notes list */}
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors flex justify-between items-center"
            >
              <span className="text-gray-900 dark:text-white">{note.content}</span>
              <button
                onClick={() => handleDelete(note.id)}
                className="px-3 py-1 text-sm text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:bg-red-500 rounded transition-all duration-200 font-medium"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {notes.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No notes yet. Add your first note above!
          </div>
        )}
      </div>
    </div>
  );
}