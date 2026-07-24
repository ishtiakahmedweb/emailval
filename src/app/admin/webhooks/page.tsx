import type { Metadata } from 'next';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { AdminWebhooksClient } from './webhooks-client';

export const metadata: Metadata = { title: 'Webhook Debug' };

export default async function AdminWebhooksPage() {
  const supabase = createSupabaseAdminClient();

  const [configsResult, logsResult] = await Promise.all([
    supabase.from('webhook_configs').select('*').order('created_at', { ascending: false }),
    supabase.from('webhook_logs').select('*').order('created_at', { ascending: false }).limit(100),
  ]);

  return (
    <AdminWebhooksClient
      configs={(configsResult.data ?? []) as any}
      logs={(logsResult.data ?? []) as any}
    />
  );
}
