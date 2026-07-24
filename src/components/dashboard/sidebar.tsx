'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/supabase/actions';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '▦' },
  { href: '/dashboard/bulk', label: 'Bulk Verify', icon: '⤓' },
  { href: '/dashboard/api-keys', label: 'API Keys', icon: '⚷' },
  { href: '/dashboard/history', label: 'History', icon: '⏣' },
  { href: '/dashboard/webhooks', label: 'Webhooks', icon: '⌁' },
  { href: '/dashboard/billing', label: 'Billing', icon: '◈' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside aria-label="Dashboard navigation" className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border/50 bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-border/50 px-5">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight text-foreground">
          Veri<span className="text-[oklch(0.67_0.16_210)]">flow</span>
        </Link>
      </div>
      <nav aria-label="Main" className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <span className="text-base" aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border/50 p-3">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <span className="text-base">⇤</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
