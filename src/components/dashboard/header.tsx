'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/supabase/actions';

interface HeaderProps {
  email: string;
  creditsRemaining: number;
}

export function DashboardHeader({ email, creditsRemaining }: HeaderProps) {
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 rounded-full bg-sidebar-accent px-3 py-1 text-xs font-medium" aria-live="polite">
          <span className="text-[oklch(0.62_0.19_160)]" aria-hidden="true">●</span>
          {creditsRemaining.toLocaleString()} credits
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-accent text-xs text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{email}</span>
                <span className="text-xs text-muted-foreground">
                  {creditsRemaining.toLocaleString()} credits remaining
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<a href="/dashboard/settings" />}>Settings</DropdownMenuItem>
            <DropdownMenuItem render={<a href="/dashboard/billing" />}>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} data-variant="destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
