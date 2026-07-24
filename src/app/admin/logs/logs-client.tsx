'use client';

import { useState } from 'react';

interface LogEntry {
  id: string;
  email: string;
  state: string;
  latency_ms: number;
  source: string;
  quality_score: number | null;
  credits_consumed: number;
  created_at: string;
  stages: unknown;
  user_id: string;
}

interface Props {
  logs: LogEntry[];
}

export function AdminLogsClient({ logs }: Props) {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = logs.filter((l) => {
    if (search && !l.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (stateFilter && l.state !== stateFilter) return false;
    return true;
  });

  const downloadCsv = () => {
    const headers = ['Email,State,Score,Latency,Source,Credits,Date'];
    const rows = filtered.map((l) =>
      `"${l.email}",${l.state},${l.quality_score ?? ''},${l.latency_ms},${l.source},${l.credits_consumed},${l.created_at}`
    );
    const blob = new Blob([headers.join('\n') + '\n' + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'verification-logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Verification Logs</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} logs displayed</p>
        </div>
        <button onClick={downloadCsv} className="rounded-md bg-[oklch(0.67_0.16_210)/0.1] px-3 py-1.5 text-xs font-medium text-[oklch(0.67_0.16_210)] hover:bg-[oklch(0.67_0.16_210)/0.2]">
          Export CSV
        </button>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-border/50 bg-card px-4 py-2 text-sm outline-none focus:border-[oklch(0.67_0.16_210)]"
        />
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="rounded-lg border border-border/50 bg-card px-3 py-2 text-sm outline-none"
        >
          <option value="">All states</option>
          <option value="deliverable">Deliverable</option>
          <option value="risky">Risky</option>
          <option value="undeliverable">Undeliverable</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/50 bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">State</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Latency</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Credits</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <>
                <tr key={log.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-2.5 font-mono text-xs">{log.email}</td>
                  <td className="px-4 py-2.5">
                    <StateBadge state={log.state} />
                  </td>
                  <td className="px-4 py-2.5">{log.quality_score ?? '-'}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{log.latency_ms}ms</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{log.source}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{log.credits_consumed}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                      className="text-xs text-[oklch(0.67_0.16_210)] hover:underline"
                    >
                      {expandedId === log.id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
                {expandedId === log.id && (
                  <tr key={`${log.id}-stages`}>
                    <td colSpan={8} className="px-4 py-3">
                      <pre className="max-h-48 overflow-auto rounded bg-muted p-3 text-[11px] text-muted-foreground">
                        {JSON.stringify(log.stages, null, 2)}
                      </pre>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
