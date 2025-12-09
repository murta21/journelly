// app/more-notes/layout.tsx

import CarAnimation from '../CarAnimation';

export default function MoreNotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* This div provides the full-screen, animated background for this route. */}
      {/* It sits above the global forest (z-0) and below our newly elevated header (z-20). */}
      <div
        aria-hidden
        className="fixed inset-0 z-[1] pointer-events-none
                   bg-[url('/notesbg3.avif')] bg-cover bg-center bg-no-repeat
                   animate-slide-in-right"
      />
      {/* Car driving along the road at the bottom */}
      <CarAnimation />
      {/* This div ensures the page content appears above the new background. */}
      <div className="relative z-10">{children}</div>
    </>
  );
}