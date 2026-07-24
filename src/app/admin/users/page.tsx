import type { Metadata } from 'next';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { AdminUsersClient } from './users-client';

export const metadata: Metadata = { title: 'User Management' };

export default async function AdminUsersPage() {
  const supabase = createSupabaseAdminClient();

  const [profilesResult, verificationsResult] = await Promise.all([
    supabase.from('user_profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('verification_log').select('user_id'),
  ]);

  const verificationCounts: Record<string, number> = {};
  if (verificationsResult.data) {
    for (const row of verificationsResult.data) {
      verificationCounts[row.user_id] = (verificationCounts[row.user_id] ?? 0) + 1;
    }
  }

  return (
    <AdminUsersClient
      profiles={(profilesResult.data ?? []) as any}
      verificationCounts={verificationCounts}
    />
  );
}
