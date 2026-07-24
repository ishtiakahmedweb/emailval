'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

interface Props {
  dailyVolume: { date: string; count: number }[];
  topDomains: { domain: string; count: number }[];
  latencyData: { date: string; avgLatency: number }[];
}

export function AdminAnalyticsClient({ dailyVolume, topDomains, latencyData }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">30-day trends and performance metrics</p>
      </div>

      <div className="rounded-lg border border-border/50 bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Daily Verification Volume</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyVolume}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0 0)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="oklch(0.67 0.16 210)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border/50 bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Average Latency (ms)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0 0)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="avgLatency" stroke="oklch(0.62 0.19 160)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border/50 bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Top Domains</h3>
          <div className="space-y-2">
            {topDomains.slice(0, 10).map((d) => (
              <div key={d.domain} className="flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">{d.domain}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded-full bg-[oklch(0.67_0.16_210)/0.3]" style={{ width: `${Math.min(100, (d.count / topDomains[0]?.count) * 100)}px` }} />
                  <span className="text-xs text-muted-foreground">{d.count.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
