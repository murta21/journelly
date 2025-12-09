'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// The Note type now includes properties for styling the sticky note
type Note = {
  id: number | string; // Local notes will have a string ID
  content: string;
  rotation: number;
  x: number;
  y: number;
  user_id?: string;
};

const generateNoteStyles = () => {
  const rotation = Math.random() * 8 - 4;
  const x = Math.random() * 16 - 8;
  const y = Math.random() * 16 - 8;
  return { rotation, x, y };
};

export default function Page() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [flippedNoteId, setFlippedNoteId] = useState<number | string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const charLimit = 290;
  const frontCharLimit = 160;
  const guestNoteLimit = 3;

  // This effect runs once to check the user's auth state
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setIsLoading(false);
    };
    checkUser();
  }, [supabase]);

  // This effect runs when the user state changes (e.g., after login)
  useEffect(() => {
    if (user) {
      // User is logged in, fetch from DB
      fetchNotesFromDB();
    } else if (!isLoading) {
      // User is a guest, fetch from localStorage
      fetchNotesFromLocal();
    }
  }, [user, isLoading]);

  // Handle login event to save local notes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // 1) tell server to set/clear cookies
        await fetch('/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, session }),
          credentials: 'include',
        });

        // 2) your current migration logic on sign-in
        if (event === 'SIGNED_IN') {
          const localNotes = JSON.parse(localStorage.getItem('guestNotes') || '[]')
          if (localNotes.length > 0) {
            await fetch('/api/notes/batch-insert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ notes: localNotes }),
            })
            localStorage.removeItem('guestNotes')
          }
          setUser(session?.user ?? null)
          
          // Fetch notes from DB after sign-in
          const { data } = await supabase.from('notes').select('*').order('created_at');
          if (data) {
            const styledNotes = data.map((note) => ({ ...note, ...generateNoteStyles() }));
            setNotes(styledNotes);
          }
          setIsLoading(false)
          
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setNotes([])
          setIsLoading(false)
        }

        // 3) make layout re-run server code to switch Login→Logout
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          router.refresh()
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [supabase, router])

useEffect(() => {
  (async () => {
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/auth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'INITIAL_SESSION', session }),
      credentials: 'include',
    })
    // optional: 
    router.refresh()
  })()
}, [supabase])


  // --- Data Fetching Logic ---
  const fetchNotesFromDB = async () => {
    const { data } = await supabase.from('notes').select('*').order('created_at');
    if (data) {
      const styledNotes = data.map((note) => ({ ...note, ...generateNoteStyles() }));
      setNotes(styledNotes);
    }
  };

  const fetchNotesFromLocal = () => {
    const localNotes: Note[] = JSON.parse(localStorage.getItem('guestNotes') || '[]');
    const styledNotes = localNotes.map((note) => ({ ...note, ...generateNoteStyles() }));
    setNotes(styledNotes);
  };

  // --- Form Submission Logic ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    if (user) {
      // Logged-in user: save to DB
      const { data } = await supabase
        .from('notes')
        .insert({ content: newNote, user_id: user.id })
        .select()
        .single();
      if (data) {
        setNotes((prev) => [...prev, { ...data, ...generateNoteStyles() }]);
      }
    } else {
      // Guest user: save to localStorage
      if (notes.length >= guestNoteLimit) {
        alert('Please sign up to create more notes!');
        return;
      }
      const localNote: Note = {
        id: `local-${Date.now()}`,
        content: newNote,
        ...generateNoteStyles(),
      };
      const updatedLocalNotes = [...notes, localNote];
      localStorage.setItem('guestNotes', JSON.stringify(updatedLocalNotes));
      setNotes(updatedLocalNotes);
    }
    setNewNote('');
    setFlippedNoteId(null);
  };

  // --- Deletion Logic ---
  const handleDelete = async (id: number | string) => {
    if (user) {
      // Logged-in user: delete from DB
      await supabase.from('notes').delete().eq('id', id);
    } else {
      // Guest user: delete from localStorage
      const updatedLocalNotes = notes.filter((note) => note.id !== id);
      localStorage.setItem('guestNotes', JSON.stringify(updatedLocalNotes));
    }
    setNotes((prev) => prev.filter((note) => note.id !== id));
    setFlippedNoteId(null);
  };

  const handleFlip = (id: number | string) => {
    setFlippedNoteId((prevId) => (prevId === id ? null : id));
  };

  if (isLoading) {
    return <div className="text-center mt-16">Loading...</div>;
  }

  return (
    <div className="px-4 py-10">
      <div className="text-center mb-10">
        {/* Apply the new font and styles to the title */}
        <h1 className="text-5xl font-brand text-gray-900 dark:text-white">
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
              placeholder="Jot something down..."
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

        {!user && notes.length >= guestNoteLimit && (
          <div className="text-center p-4 mb-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              You've reached the guest limit!{' '}
              <a href="/login" className="font-bold underline hover:text-green-600">
                Sign up
              </a>{' '}
              to save notes and create more.
            </p>
          </div>
        )}

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
              Once upon a time, there was a note. This note was lost under a pile of many others...
            </div>
          )}
        </div>
        <div className="text-center mt-8">
          <a
            href="/more-notes"
            className="inline-block px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
          >
            More Notes...
          </a>
          </div>
      </div>
    </div>
  );
}
