import type { Metadata } from 'next';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { AdminAuditClient } from './audit-client';

export const metadata: Metadata = { title: 'Admin Audit Log' };

export default async function AdminAuditPage() {
  const supabase = createSupabaseAdminClient();

  const { data: logs } = await supabase
    .from('admin_audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return <AdminAuditClient logs={(logs ?? []) as any} />;
}
