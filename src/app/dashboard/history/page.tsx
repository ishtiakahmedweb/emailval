import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { HistoryClient } from './history-client';

export const metadata: Metadata = { title: 'History' };

export default async function HistoryPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: logs } = await supabase
    .from('verification_log')
    .select('email, state, latency_ms, source, credits_consumed, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  return <HistoryClient logs={logs ?? []} />;
}
