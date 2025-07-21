// `notely`, a full-stack note-taking app.

'use client'; // Important: enables useEffect and useState in App Router

import { useEffect, useState, FormEvent } from 'react';

// Define the structure of a note (for TypeScript)
type Note = {
  id: number;
  content: string;
};

export default function HomePage() {
  // State to hold the list of notes
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState(''); // input box state

  useEffect(() => {
    fetchNotes();
  }, []); // [] = only run this once when the page loads

  // Fetch notes from the backend when the component loads
  async function fetchNotes() {
      try {
        const res = await fetch('/api/notes');
        const data = await res.json();
        setNotes(data);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      }
  }
  

// Handle form submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); // stop page refresh
    if (!newNote.trim()) return;

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newNote }),
      });

      if (res.ok) {
        setNewNote('');       // Clear the input
        fetchNotes();         // Reload notes from server
      } else {
        console.error('Failed to add note');
      }
    } catch (err) {
      console.error('Request failed:', err);
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Notely</h1>

      {/* Form to add a new note */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new note..."
          style={{ padding: '0.5rem', marginRight: '0.5rem', width: '300px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Add Note
        </button>
      </form>

      {/* Display notes */}
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </main>
  );
}