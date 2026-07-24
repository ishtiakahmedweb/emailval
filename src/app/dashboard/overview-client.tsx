'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

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
  created_at: string;
  source: string;
}

interface Props {
  creditsRemaining: number;
  totalProcessed: number;
  subscriptionTier: string;
  totalCount: number;
  recentVerifications: RecentVerification[];
  dailyUsage: { date: string; count: number }[];
  stateBreakdown: Record<string, number>;
}

function stateBadge(state: string) {
  const map: Record<string, { color: string; label: string }> = {
    deliverable: { color: 'text-green-500', label: 'Deliverable' },
    risky: { color: 'text-yellow-500', label: 'Risky' },
    undeliverable: { color: 'text-red-500', label: 'Undeliverable' },
    unknown: { color: 'text-muted-foreground', label: 'Unknown' },
  };
  const m = map[state] ?? { color: 'text-muted-foreground', label: state };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${m.color}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
}

export function OverviewClient({
  creditsRemaining,
  totalProcessed,
  subscriptionTier,
  totalCount,
  recentVerifications,
  dailyUsage,
  stateBreakdown,
}: Props) {
  const [email, setEmail] = useState('');
  const [verifying, setVerifying] = useState(false);

  async function handleVerify() {
    if (!email) return;
    setVerifying(true);
    try {
      const res = await fetch('/api/v1/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`${data.email} \u2192 ${data.state} (${data.latencyMs}ms)`);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(data.error ?? 'Verification failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setVerifying(false);
    }
  }

  const tierLabel = subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1);
  const pieData = Object.entries(stateBreakdown).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">
          {tierLabel} plan &middot; {totalCount.toLocaleString()} total verifications
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Credits Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditsRemaining.toLocaleString()}</div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-sidebar-accent">
              <div
                className="h-1.5 rounded-full bg-green-500 transition-all"
                style={{ width: `${Math.min((creditsRemaining / 100) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProcessed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{tierLabel}</div>
            <p className="text-xs text-muted-foreground">
              {creditsRemaining === 0 ? 'Out of credits' : `${creditsRemaining} remaining this cycle`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {dailyUsage.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Usage (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailyUsage}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="oklch(0.67 0.16 210)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {pieData.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium">State Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
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
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Quick Verify</CardTitle>
          <CardDescription>Test a single email address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
            <Button onClick={handleVerify} disabled={verifying || !email}>
              {verifying ? 'Checking...' : 'Verify'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <CardDescription>Last {recentVerifications.length} verifications</CardDescription>
        </CardHeader>
        <CardContent>
          {recentVerifications.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No verifications yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentVerifications.map((v, i) => (
                  <TableRow key={i}>
                    <TableCell className="max-w-[200px] truncate font-mono text-xs">{v.email}</TableCell>
                    <TableCell>{stateBadge(v.state)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{v.latency_ms}ms</TableCell>
                    <TableCell className="text-xs capitalize text-muted-foreground">{v.source}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(v.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
