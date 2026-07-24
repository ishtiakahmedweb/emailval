'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';

const STATE_COLORS: Record<string, string> = {
  deliverable: '#22c55e',
  risky: '#eab308',
  undeliverable: '#ef4444',
  unknown: '#6b7280',
};

interface RecentVerification {
  email: string;
  state: string;
  latency_ms: number;
  source: string;
  created_at: string;
  user_id: string;
}

interface Props {
  totalUsers: number;
  totalVerifications: number;
  verifications24h: number;
  verifications7d: number;
  totalRevenue: number;
  activeSubscriptions: number;
  recentVerifications: RecentVerification[];
  stateDistribution: Record<string, number> | null;
  signups7d: { date: string; count: number }[];
}

export function AdminOverviewClient({
  totalUsers,
  totalVerifications,
  verifications24h,
  verifications7d,
  totalRevenue,
  activeSubscriptions,
  recentVerifications,
  stateDistribution,
  signups7d,
}: Props) {
  const pieData = stateDistribution
    ? Object.entries(stateDistribution).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">System-wide statistics and monitoring</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={totalUsers.toLocaleString()} />
        <StatCard label="All Verifications" value={totalVerifications.toLocaleString()} />
        <StatCard label="Last 24h" value={verifications24h.toLocaleString()} />
        <StatCard label="Last 7 Days" value={verifications7d.toLocaleString()} />
        <StatCard label="Active Subscriptions" value={activeSubscriptions.toLocaleString()} />
        <StatCard label="Total Revenue" value={`$${(totalRevenue / 100).toLocaleString()}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {pieData.length > 0 && (
          <div className="rounded-lg border border-border/50 bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold">State Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={STATE_COLORS[entry.name] ?? '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
              {pieData.map((entry) => (
                <span key={entry.name} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATE_COLORS[entry.name] ?? '#6b7280' }} />
                  {entry.name}: {entry.value}
                </span>
              ))}
            </div>
          </div>
        )}

        {signups7d.length > 0 && (
          <div className="rounded-lg border border-border/50 bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold">Signups (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={signups7d}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="oklch(0.67 0.16 210)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border/50 bg-card">
        <div className="border-b border-border/50 px-5 py-3">
          <h3 className="text-sm font-semibold">Recent Verifications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left text-xs text-muted-foreground">
                <th className="px-5 py-2 font-medium">Email</th>
                <th className="px-5 py-2 font-medium">State</th>
                <th className="px-5 py-2 font-medium">Latency</th>
                <th className="px-5 py-2 font-medium">Source</th>
                <th className="px-5 py-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentVerifications.slice(0, 10).map((v) => (
                <tr key={`${v.email}-${v.created_at}`} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-2 font-mono text-xs">{v.email}</td>
                  <td className="px-5 py-2">
                    <StateBadge state={v.state} />
                  </td>
                  <td className="px-5 py-2 text-muted-foreground">{v.latency_ms}ms</td>
                  <td className="px-5 py-2 text-muted-foreground">{v.source}</td>
                  <td className="px-5 py-2 text-muted-foreground">
                    {new Date(v.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {recentVerifications.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    No verifications yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function StateBadge({ state }: { state: string }) {
  const colors: Record<string, string> = {
    deliverable: 'bg-green-500/10 text-green-500',
    risky: 'bg-yellow-500/10 text-yellow-500',
    undeliverable: 'bg-red-500/10 text-red-500',
    unknown: 'bg-gray-500/10 text-gray-400',
  };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${colors[state] ?? colors.unknown}`}>
      {state}
    </span>
  );
}
