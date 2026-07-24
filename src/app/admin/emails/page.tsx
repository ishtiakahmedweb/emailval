import type { Metadata } from 'next';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { AdminEmailsClient } from './emails-client';

export const metadata: Metadata = { title: 'Email Templates' };

export default async function AdminEmailsPage() {
  const supabase = createSupabaseAdminClient();
  const { data: templates } = await supabase.from('email_templates').select('*').order('key');

  return <AdminEmailsClient templates={(templates ?? []) as any} />;
}
