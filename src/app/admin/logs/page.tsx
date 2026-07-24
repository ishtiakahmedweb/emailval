import type { Metadata } from 'next';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { AdminLogsClient } from './logs-client';

export const metadata: Metadata = { title: 'Verification Logs' };

export default async function AdminLogsPage() {
  const supabase = createSupabaseAdminClient();

  const { data: logs } = await supabase
    .from('verification_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  return <AdminLogsClient logs={(logs ?? []) as any} />;
}
