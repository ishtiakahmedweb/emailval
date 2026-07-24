import type { Metadata } from 'next';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { AdminAnalyticsClient } from './analytics-client';

export const metadata: Metadata = { title: 'Admin Analytics' };

export default async function AdminAnalyticsPage() {
  const supabase = createSupabaseAdminClient();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [dailyVolume, topDomains, latencyData] = await Promise.all([
    supabase.from('verification_log').select('created_at').gte('created_at', thirtyDaysAgo).then(r => {
      if (!r.data) return [];
      const byDay: Record<string, number> = {};
      for (const row of r.data) {
        const day = new Date(row.created_at).toISOString().slice(0, 10);
        byDay[day] = (byDay[day] ?? 0) + 1;
      }
      return Object.entries(byDay).map(([date, count]) => ({ date, count }));
    }),
    supabase.from('verification_log').select('email').gte('created_at', thirtyDaysAgo).then(r => {
      if (!r.data) return [];
      const counts: Record<string, number> = {};
      for (const row of r.data) {
        const domain = row.email.split('@')[1] ?? 'unknown';
        counts[domain] = (counts[domain] ?? 0) + 1;
      }
      return Object.entries(counts)
        .map(([domain, count]) => ({ domain, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);
    }),
    supabase.from('verification_log').select('latency_ms, created_at').gte('created_at', thirtyDaysAgo).then(r => {
      if (!r.data) return [];
      const byDay: Record<string, { total: number; count: number }> = {};
      for (const row of r.data) {
        const day = new Date(row.created_at).toISOString().slice(0, 10);
        if (!byDay[day]) byDay[day] = { total: 0, count: 0 };
        byDay[day].total += row.latency_ms;
        byDay[day].count += 1;
      }
      return Object.entries(byDay).map(([date, { total, count }]) => ({
        date,
        avgLatency: Math.round(total / count),
      }));
    }),
  ]);

  return (
    <AdminAnalyticsClient
      dailyVolume={dailyVolume as { date: string; count: number }[]}
      topDomains={topDomains as { domain: string; count: number }[]}
      latencyData={latencyData as { date: string; avgLatency: number }[]}
    />
  );
}
