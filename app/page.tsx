'use client';

import { useEffect, useState, FormEvent } from 'react';

// The Note type now includes properties for styling the sticky note
type Note = {
  id: number;
  content: string;
  rotation: number; // The tilt of the note
  x: number;        // The horizontal offset
  y: number;        // The vertical offset
};

// A helper function to generate the "messy" styles for a note
const generateNoteStyles = () => {
  const rotation = Math.random() * 10 - 5; // -5 to 5 degrees
  const x = Math.random() * 20 - 10;       // -10px to 10px
  const y = Math.random() * 20 - 10;       // -10px to 10px
  return { rotation, x, y };
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
      // When we fetch existing notes, we add the random styles to them
      const styledNotes = data.map((note: { id: number; content: string }) => ({
        ...note,
        ...generateNoteStyles(),
      }));
      setNotes(styledNotes);
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
        // Add the new note to the stack with its own unique messy style
        setNotes((prev) => [
          ...prev,
          {
            ...addedNote,
            ...generateNoteStyles(),
          },
        ]);
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

      {/* Main content area */}
      <div className="max-w-2xl mx-auto">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 mb-8">
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

        {/* Sticky Notes Stack */}
        <div className="relative w-80 h-80 mx-auto">
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <div
                key={note.id}
                className="absolute w-full h-full p-8 bg-yellow-300 dark:bg-yellow-400 shadow-xl rounded-lg transition-transform duration-300 ease-in-out"
                style={{
                  transform: `rotate(${note.rotation}deg) translate(${note.x}px, ${note.y}px)`,
                  zIndex: index, // This makes the notes stack on top of each other
                }}
              >
                {/* Only show content and delete button for the top note */}
                {index === notes.length - 1 && (
                  <>
                    <p className="font-caveat text-3xl text-gray-800 break-words">
                      {note.content}
                    </p>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="absolute top-2 right-2 px-2 py-1 text-xs text-red-700 hover:bg-red-200 rounded-full transition-colors"
                      aria-label="Delete note"
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 pt-16">
              No notes yet. Add your first note above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
