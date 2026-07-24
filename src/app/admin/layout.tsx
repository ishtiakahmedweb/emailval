import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';
import { Toaster } from 'sonner';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, email')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="ml-60 flex flex-1 flex-col">
        <AdminHeader email={profile.email ?? user.email ?? ''} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}
