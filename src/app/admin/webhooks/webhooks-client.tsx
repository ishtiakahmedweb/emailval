'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface WebhookConfig {
  id: string;
  user_id: string;
  url: string;
  active: boolean;
  events: string[];
  last_delivery_at: string | null;
  created_at: string;
}

interface WebhookLog {
  id: string;
  webhook_config_id: string;
  event: string;
  status: string;
  status_code: number | null;
  attempt: number;
  max_attempts: number;
  response_body: string | null;
  created_at: string;
}

interface Props {
  configs: WebhookConfig[];
  logs: WebhookLog[];
}

export function AdminWebhooksClient({ configs, logs }: Props) {
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);

  const handleResend = async (logId: string) => {
    const res = await fetch('/api/v1/admin/webhooks/resend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logId }),
    });
    if (res.ok) {
      toast.success('Webhook re-sent');
    } else {
      toast.error('Failed to re-send webhook');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Webhook Debug Console</h1>
        <p className="text-sm text-muted-foreground">{configs.length} endpoints across all users</p>
      </div>

      <div className="rounded-lg border border-border/50 bg-card">
        <div className="border-b border-border/50 px-5 py-3">
          <h3 className="text-sm font-semibold">All Endpoints</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">URL</th>
                <th className="px-4 py-2.5 font-medium">User</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Events</th>
                <th className="px-4 py-2.5 font-medium">Last Delivery</th>
              </tr>
            </thead>
            <tbody>
              {configs.map((c) => (
                <tr key={c.id} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 font-mono text-xs">{c.url}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{c.user_id.slice(0, 8)}...</td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${c.active ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'}`}>
                      {c.active ? 'Active' : 'Paused'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{(c.events ?? []).join(', ')}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {c.last_delivery_at ? new Date(c.last_delivery_at).toLocaleString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-border/50 bg-card">
        <div className="border-b border-border/50 px-5 py-3">
          <h3 className="text-sm font-semibold">Recent Deliveries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Event</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Attempt</th>
                <th className="px-4 py-2.5 font-medium">Code</th>
                <th className="px-4 py-2.5 font-medium">Time</th>
                <th className="px-4 py-2.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-2.5 text-muted-foreground">{log.event}</td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      log.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                      log.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>{log.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{log.attempt}/{log.max_attempts}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{log.status_code ?? '-'}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => setSelectedLog(log)} className="mr-2 text-xs text-[oklch(0.67_0.16_210)] hover:underline">View</button>
                    {log.status !== 'delivered' && (
                      <button onClick={() => handleResend(log.id)} className="text-xs text-[oklch(0.62_0.19_160)] hover:underline">Resend</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedLog(null)}>
          <div className="w-full max-w-lg rounded-xl border border-border/50 bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold">Webhook Delivery Details</h3>
            <pre className="mt-3 max-h-80 overflow-auto rounded bg-muted p-3 text-[11px] text-muted-foreground">
              {JSON.stringify(selectedLog, null, 2)}
            </pre>
            <button onClick={() => setSelectedLog(null)} className="mt-3 w-full rounded-md bg-muted px-3 py-2 text-sm font-medium hover:bg-muted/80">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
