'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const EVENTS = ['verification.completed', 'bulk.completed', 'verification.failed'];

function WebhookSecret({ secret }: { secret: string | null }) {
  const [copied, setCopied] = useState(false);
  if (!secret) return <span className="text-muted-foreground text-sm italic">Auto-generated</span>;
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? 'Copied!' : <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> {secret.slice(0, 16)}…</span>}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    delivered: { label: 'Delivered', variant: 'default' },
    retrying: { label: 'Retrying', variant: 'secondary' },
    failed: { label: 'Failed', variant: 'destructive' },
  };
  const m = map[status] ?? { label: status, variant: 'outline' as const };
  return <Badge variant={m.variant}>{m.label}</Badge>;
}

export function WebhooksClient({
  configs: initialConfigs,
  logs: initialLogs,
}: {
  configs: any[];
  logs: any[];
}) {
  const [configs, setConfigs] = useState(initialConfigs);
  const [logs, setLogs] = useState(initialLogs);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState<string[]>(['verification.completed']);
  const [creating, setCreating] = useState(false);

  async function createWebhook() {
    if (!url) return;
    setCreating(true);
    try {
      const res = await fetch('/api/v1/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, events }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error ?? 'Failed'); }
      const data = await res.json();
      setConfigs((prev) => [data.webhook, ...prev]);
      setUrl('');
      setEvents(['verification.completed']);
      setOpen(false);
      toast.success('Webhook created');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setCreating(false);
    }
  }

  async function deleteWebhook(id: string) {
    try {
      const res = await fetch('/api/v1/webhooks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      setConfigs((prev) => prev.filter((c) => c.id !== id));
      setLogs((prev) => prev.filter((l) => l.webhook_config_id !== id));
      toast.success('Webhook deleted');
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Endpoints</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button size="sm"><Plus className="w-4 h-4 mr-1.5" /> Add Webhook</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Webhook Endpoint</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" placeholder="https://api.example.com/hooks" value={url} onChange={(e) => setUrl(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Events</Label>
                <div className="flex flex-wrap gap-2">
                  {EVENTS.map((ev) => (
                    <button
                      key={ev}
                      onClick={() => setEvents((p) => p.includes(ev) ? p.filter((e) => e !== ev) : [...p, ev])}
className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
                         events.includes(ev)
                           ? 'bg-primary text-primary-foreground border-primary'
                           : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                       }`}
                    >
                      {ev}
                    </button>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={createWebhook} disabled={creating}>
                {creating ? 'Creating…' : 'Create Webhook'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {configs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ExternalLink className="w-10 h-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No webhook endpoints configured yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Create one to receive real-time verification results.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {configs.map((cfg) => (
            <Card key={cfg.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium truncate max-w-md">{cfg.url}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={cfg.active ? 'default' : 'secondary'}>{cfg.active ? 'Active' : 'Paused'}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteWebhook(cfg.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span><strong>Secret:</strong> <WebhookSecret secret={cfg.secret} /></span>
                  <span><strong>Events:</strong> {(cfg.events ?? []).join(', ')}</span>
                  {cfg.last_delivery_at && (
                    <span><strong>Last delivery:</strong> {new Date(cfg.last_delivery_at).toLocaleString()}</span>
                  )}
                  <span><strong>Created:</strong> {new Date(cfg.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {logs.length > 0 && (
        <div className="pt-6">
          <h2 className="text-lg font-medium mb-4">Recent Deliveries</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Event</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Attempt</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Code</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-xs">{log.event}</td>
                    <td className="p-3"><StatusBadge status={log.status} /></td>
                    <td className="p-3 text-muted-foreground">{log.attempt}/{log.max_attempts}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{log.status_code ?? '-'}</td>
                    <td className="p-3 text-muted-foreground text-xs">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
