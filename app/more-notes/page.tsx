// app/more-notes/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Note = {
  id: number;
  content: string;
  created_at: string;
};

export default function MoreNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUserAndFetchNotes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        const { data } = await supabase
          .from('notes')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data) {
          setNotes(data);
        }
        setIsLoading(false);
      }
    };
    checkUserAndFetchNotes();
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white text-2xl bg-black/50 p-4 rounded-lg">Loading your journal...</p>
      </div>
    );
  }

  return (
    // REMOVED THE OUTER <> AND THE FIXED BACKGROUND DIV
    <div className="relative z-10 p-4 sm:p-6 md:p-8">
      <h1 className="text-4xl font-brand text-white text-center mb-8" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          Your Journ<span 
            style={{ 
              display: 'inline-block', 
              transform: 'rotate(-12deg)',
              // Here is the color property you were looking for
              color: '#ffe600ee' 
            }}
          >e</span>l
        </h1>

      {notes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-6 bg-yellow-100/90 dark:bg-yellow-200/90 backdrop-blur-sm rounded-lg shadow-lg font-caveat text-xl text-gray-800"
            >
              <p>{note.content}</p>
              <p className="text-xs text-right mt-4 text-gray-600">
                {new Date(note.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-white bg-black/50 p-6 rounded-lg">
          <p>You haven't written any notes yet.</p>
        </div>
      )}
    </div>
  );
}