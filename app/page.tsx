'use client';

import { useEffect, useState, FormEvent } from 'react';

// Define the shape of a Note object
type Note = {
  id: number;
  content: string;
};

export default function Page() {
  // State to hold the list of existing notes
  const [notes, setNotes] = useState<Note[]>([]);
  // State to track what's typed into the input box
  const [newNote, setNewNote] = useState('');

  // Fetch notes only once when the component is first rendered
  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch notes from the backend API route
  async function fetchNotes() {
    try {
      const res = await fetch('/api/notes'); // Send GET request
      const data = await res.json();         // Parse JSON response
      setNotes(data);                        // Update state with notes
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  }

  // Called when the "Add Note" form is submitted
  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); // Prevent page from refreshing

    if (!newNote.trim()) return; // Ignore empty notes

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      });

      if (res.ok) {
        const addedNote = await res.json();
        // Add the new note to the list without needing to re-fetch
        setNotes((prev) => [...prev, addedNote]);
        setNewNote(''); // Clear the input box
      } else {
        console.error('Failed to add note');
      }
    } catch (err) {
      console.error('Request failed:', err);
    }
  }

  return (
    <main className="p-4 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      {/* Page title */}
      <h1 className="text-2xl font-bold mb-4">Notely by Murtaza</h1>

      {/* Form to add a new note */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new note..."
          className="p-2 mr-2 w-72 rounded border dark:bg-gray-800 dark:border-gray-700"
        />
        <button
          type="submit"
          className="p-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Note
        </button>
      </form>

      {/* Display all notes */}
      <ul>
        {notes.map((note) => (
          <li
            key={note.id}
            className="p-2"
          >
            {note.content}
          </li>
        ))}
      </ul>
    </main>
  );
}
