// app/travel-community/layout.tsx
import '../../styles/globals.css';

export default function TravelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 py-6">
      {children}
    </section>
  );
}
