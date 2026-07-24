'use client';

interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: unknown;
  created_at: string;
}

interface Props {
  logs: AuditLog[];
}

export function AdminAuditClient({ logs }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-sm text-muted-foreground">Track all admin actions</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/50 bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Target Type</th>
              <th className="px-4 py-3 font-medium">Target ID</th>
              <th className="px-4 py-3 font-medium">Details</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
                <td className="px-4 py-2.5">
                  <span className="rounded-full bg-[oklch(0.67_0.16_210)/0.1] px-2 py-0.5 text-[11px] font-medium text-[oklch(0.67_0.16_210)]">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{log.target_type ?? '-'}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                  {log.target_id ? `${log.target_id.slice(0, 8)}...` : '-'}
                </td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">
                  {log.details ? JSON.stringify(log.details).slice(0, 60) : '-'}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No audit log entries yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
