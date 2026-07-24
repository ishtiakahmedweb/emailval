'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Overview', icon: '▦' },
  { href: '/admin/users', label: 'Users', icon: '◉' },
  { href: '/admin/plans', label: 'Plans', icon: '◈' },
  { href: '/admin/analytics', label: 'Analytics', icon: '◔' },
  { href: '/admin/logs', label: 'Verification Logs', icon: '⏣' },
  { href: '/admin/webhooks', label: 'Webhooks', icon: '⌁' },
  { href: '/admin/emails', label: 'Email Templates', icon: '✉' },
  { href: '/admin/audit', label: 'Audit Log', icon: '⚷' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside aria-label="Admin navigation" className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border/50 bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-border/50 px-5">
        <Link href="/admin" className="text-lg font-bold tracking-tight text-foreground">
          Veri<span className="text-[oklch(0.67_0.16_210)]">flow</span>
          <span className="ml-1.5 rounded-md bg-[oklch(0.67_0.16_210)/0.15] px-1.5 py-0.5 text-[10px] font-medium text-[oklch(0.67_0.16_210)]">
            ADMIN
          </span>
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
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <span className="text-base">⇤</span>
          Back to Dashboard
        </Link>
      </div>
    </aside>
  );
}
