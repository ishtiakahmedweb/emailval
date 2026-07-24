import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { WebhooksClient } from './webhooks-client';

export const metadata = {
  title: 'Webhooks — Veriflow',
};

export default async function WebhooksPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/auth/login');

  const { data: configs } = await supabase
    .from('webhook_configs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: logs } = await supabase
    .from('webhook_logs')
    .select('*')
    .in('webhook_config_id', configs?.map((c) => c.id) ?? [])
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Webhooks</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Receive real-time verification results via HTTP callbacks.
        </p>
      </div>
      <WebhooksClient configs={configs ?? []} logs={logs ?? []} />
    </div>
  );
}
