// app/more-notes/page.tsx
export default function MoreNotesPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Page-specific background image */}
      <div className="absolute inset-0 z-0 bg-[url('/notes-bg.png')] bg-cover bg-center bg-no-repeat" />

      {/* Your page content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">More Notes</h1>
        <p className="text-lg opacity-90">
          Put whatever you want here—extra notes, lists, whatever.
        </p>
      </div>
    </div>
  );
}
