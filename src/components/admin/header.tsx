'use client';

import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { signOut } from '@/lib/supabase/actions';

interface AdminHeaderProps {
  email: string;
}

export function AdminHeader({ email }: AdminHeaderProps) {
  const router = useRouter();
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[oklch(0.67_0.16_210)]">Admin Panel</span>
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="h-8 w-8 cursor-pointer" onClick={() => router.push('/admin/settings')}>
          <AvatarFallback className="bg-sidebar-accent text-xs text-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
