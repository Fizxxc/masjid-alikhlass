'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, HeartHandshake, Home, ScrollText, UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/reports', label: 'Laporan', icon: ScrollText },
  { href: '/doa', label: 'Doa', icon: Compass },
  { href: '/donasi', label: 'Donasi', icon: HeartHandshake },
  { href: '/profile', label: 'Profil', icon: UserCircle2 }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto mb-4 w-[min(96%,520px)] rounded-full border bg-card/95 p-2 shadow-soft backdrop-blur">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn('flex flex-col items-center rounded-full px-2 py-2 text-[11px]', active ? 'bg-primary text-white' : 'text-foreground/70')}>
              <Icon className="mb-1 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
