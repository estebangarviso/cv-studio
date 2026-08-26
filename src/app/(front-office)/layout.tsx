export default function FrontOfficeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Front Office navbar placeholder */}
      <header className="border-b bg-white px-6 py-4">
        <h2 className="text-lg font-semibold">cv-studio</h2>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
