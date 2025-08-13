import Link from 'next/link';

export default function Navigation() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">لوحة الأسهم</Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:underline">الرئيسية</Link>
          <Link href="/portfolio" className="hover:underline">المحفظة</Link>
          <a href="https://github.com/" target="_blank" rel="noreferrer" className="text-sm opacity-80">GitHub</a>
        </div>
      </nav>
    </header>
  );
}
