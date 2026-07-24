'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LogEntry {
  email: string;
  state: string;
  latency_ms: number;
  source: string;
  credits_consumed: number;
  created_at: string;
}

interface Props {
  logs: LogEntry[];
}

function stateBadge(state: string) {
  const map: Record<string, { color: string; label: string }> = {
    deliverable: { color: 'text-signal-green', label: 'Deliverable' },
    risky: { color: 'text-signal-amber', label: 'Risky' },
    undeliverable: { color: 'text-signal-red', label: 'Undeliverable' },
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

export function HistoryClient({ logs }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Verification History</h1>
        <p className="text-sm text-muted-foreground">Last 50 verifications</p>
      </div>
      <Card className="border-border/50">
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No verifications yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log, i) => (
                  <TableRow key={i}>
                    <TableCell className="max-w-[240px] truncate font-mono text-xs">{log.email}</TableCell>
                    <TableCell>{stateBadge(log.state)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.latency_ms}ms</TableCell>
                    <TableCell className="text-xs capitalize text-muted-foreground">{log.source}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.credits_consumed}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
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
