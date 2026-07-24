import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { OverviewClient } from './overview-client';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: recentVerifications } = await supabase
    .from('verification_log')
    .select('email, state, latency_ms, created_at, source')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const { count: totalCount } = await supabase
    .from('verification_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { data: weeklyData } = await supabase
    .from('verification_log')
    .select('created_at')
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgo);

  const dailyCounts: Record<string, number> = {};
  for (const row of weeklyData ?? []) {
    const day = new Date(row.created_at).toISOString().slice(0, 10);
    dailyCounts[day] = (dailyCounts[day] ?? 0) + 1;
  }

  const stateBreakdown = await supabase
    .from('verification_log')
    .select('state')
    .eq('user_id', user.id)
    .then(r => {
      if (!r.data) return null;
      const counts: Record<string, number> = {};
      for (const row of r.data) counts[row.state] = (counts[row.state] ?? 0) + 1;
      return counts;
    });

  return (
    <OverviewClient
      creditsRemaining={profile?.credits_remaining ?? 0}
      totalProcessed={profile?.total_processed ?? 0}
      subscriptionTier={profile?.subscription_tier ?? 'free'}
      totalCount={totalCount ?? 0}
      recentVerifications={recentVerifications ?? []}
      dailyUsage={Object.entries(dailyCounts).map(([date, count]) => ({ date, count }))}
      stateBreakdown={stateBreakdown ?? {}}
    />
  );
}
