import Link from 'next/link';
import { Bell, ShieldCheck } from 'lucide-react';
import { getProfile } from '@/lib/queries';

export async function Header() {
  const profile = await getProfile();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Masjid</p>
          <h1 className="text-xl font-bold">Masjid Al-Ikhlas</h1>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {profile?.role === 'admin' && (
            <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border px-3 py-2">
              <ShieldCheck className="h-4 w-4" /> Admin
            </Link>
          )}
          <Link href="/profile" className="inline-flex items-center gap-2 rounded-full border px-3 py-2">
            <Bell className="h-4 w-4" /> Profil
          </Link>
        </div>
      </div>
    </header>
  );
}
