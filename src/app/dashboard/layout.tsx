import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { Toaster } from 'sonner';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('credits_remaining')
    .eq('id', user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="ml-60 flex flex-1 flex-col">
        <DashboardHeader
          email={user.email ?? ''}
          creditsRemaining={profile?.credits_remaining ?? 0}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}
