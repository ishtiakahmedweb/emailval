import type { Metadata } from 'next';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { AdminOverviewClient } from './overview-client';

export const metadata: Metadata = { title: 'Admin Overview' };

export default async function AdminOverviewPage() {
  const supabase = createSupabaseAdminClient();

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    usersResult,
    verificationsTotal,
    verifications24h,
    verifications7d,
    revenueResult,
    subscriptionsResult,
    recentVerifications,
    stateDistResult,
    signups7d,
  ] = await Promise.all([
    supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
    supabase.from('verification_log').select('id', { count: 'exact', head: true }),
    supabase.from('verification_log').select('id', { count: 'exact', head: true }).gte('created_at', twentyFourHoursAgo),
    supabase.from('verification_log').select('id', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
    supabase.from('credit_transactions').select('amount').eq('type', 'topup_purchase'),
    supabase.from('user_profiles').select('id', { count: 'exact', head: true }).eq('subscription_status', 'active').not('subscription_tier', 'eq', 'free'),
    supabase.from('verification_log').select('email, state, latency_ms, source, created_at, user_id').order('created_at', { ascending: false }).limit(20),
    supabase.from('verification_log').select('state').then(r => {
      if (!r.data) return null;
      const counts: Record<string, number> = {};
      for (const row of r.data) {
        counts[row.state] = (counts[row.state] ?? 0) + 1;
      }
      return counts;
    }),
    supabase.from('user_profiles').select('created_at').gte('created_at', sevenDaysAgo).then(r => {
      if (!r.data) return [];
      const byDay: Record<string, number> = {};
      for (const row of r.data) {
        const day = new Date(row.created_at).toISOString().slice(0, 10);
        byDay[day] = (byDay[day] ?? 0) + 1;
      }
      return Object.entries(byDay).map(([date, count]) => ({ date, count }));
    }),
  ]);

  const totalRevenue = (revenueResult.data ?? []).reduce((sum, tx) => sum + (tx.amount ?? 0), 0);

  return (
    <AdminOverviewClient
      totalUsers={usersResult.count ?? 0}
      totalVerifications={verificationsTotal.count ?? 0}
      verifications24h={verifications24h.count ?? 0}
      verifications7d={verifications7d.count ?? 0}
      totalRevenue={totalRevenue}
      activeSubscriptions={subscriptionsResult.count ?? 0}
      recentVerifications={(recentVerifications.data ?? []) as any}
      stateDistribution={stateDistResult as Record<string, number> | null}
      signups7d={signups7d as { date: string; count: number }[]}
    />
  );
}
