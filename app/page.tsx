'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Use the new client

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
  const rotation = Math.random() * 8 - 4; // -4 to 4 degrees
  const x = Math.random() * 16 - 8;       // -8px to 8px
  const y = Math.random() * 16 - 8;       // -8px to 8px
  return { rotation, x, y };
};

export default function Page() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [flippedNoteId, setFlippedNoteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const router = useRouter();
  const supabase = createClient();

  const charLimit = 300;
  const frontCharLimit = 150;

  useEffect(() => {
    const checkUserAndFetchNotes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // If no user is logged in, redirect to the login page.
        router.push('/login');
      } else {
        // If a user is logged in, fetch their notes.
        await fetchNotes();
        setIsLoading(false);
      }
    };
    checkUserAndFetchNotes();
  }, [router, supabase]);

  async function fetchNotes() {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const styledNotes = data.map((note: { id: number; content: string }) => ({
          ...note,
          ...generateNoteStyles(),
        }));
        setNotes(styledNotes);
      } else {
        console.error('Failed to fetch notes, received:', data);
        setNotes([]);
      }
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
        setNotes((prev) => [
          ...prev,
          { ...addedNote, ...generateNoteStyles() },
        ]);
        setNewNote('');
        setFlippedNoteId(null);
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
        setFlippedNoteId(null);
      } else {
        console.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  }

  const handleFlip = (id: number) => {
    setFlippedNoteId((prevId) => (prevId === id ? null : id));
  };

  // Show a loading message while we check for the user
  if (isLoading) {
    return <div className="text-center mt-16">Loading...</div>;
  }

  return (
    <div className="px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Journ<span className="text-green-600">e</span>lly
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">A simple place for your journey of ideas</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 mb-8">
          <div className="w-full flex items-center gap-3">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Start your journey..."
              maxLength={charLimit}
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add
            </button>
          </div>
          <p className="w-full text-right text-sm text-gray-500 dark:text-gray-400">
            {newNote.length} / {charLimit}
          </p>
        </form>

        <div className="relative w-80 h-80 mx-auto">
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <div
                key={note.id}
                className="absolute w-full h-full note-scene"
                style={{
                  transform: `rotate(${note.rotation}deg) translate(${note.x}px, ${note.y}px)`,
                  zIndex: index,
                }}
              >
                <div className={`note-card-inner ${flippedNoteId === note.id ? 'is-flipped' : ''}`}>
                  <div className="note-face note-front">
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="absolute top-2 right-2 px-2 py-1 text-xs text-red-700 hover:bg-red-200 rounded-full"
                      aria-label="Delete note"
                    >
                      ✕
                    </button>
                    <p className="font-caveat text-3xl text-gray-800 break-words">
                      {note.content.slice(0, frontCharLimit)}
                    </p>
                    {note.content.length > frontCharLimit && (
                      <button
                        onClick={() => handleFlip(note.id)}
                        className="absolute bottom-2 left-4 text-xs text-green-700 hover:underline"
                        aria-label="Flip note"
                      >
                        Flip
                      </button>
                    )}
                  </div>
                  <div className="note-face note-back">
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="absolute top-2 right-2 px-2 py-1 text-xs text-red-700 hover:bg-red-200 rounded-full"
                      aria-label="Delete note"
                    >
                      ✕
                    </button>
                    <p className="font-caveat text-3xl text-gray-800 break-words">
                      {note.content.slice(frontCharLimit)}
                    </p>
                    <button
                      onClick={() => handleFlip(note.id)}
                      className="absolute bottom-2 left-4 text-xs text-green-700 hover:underline"
                      aria-label="Flip note back"
                    >
                      Flip Back
                    </button>
                  </div>
                </div>
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
