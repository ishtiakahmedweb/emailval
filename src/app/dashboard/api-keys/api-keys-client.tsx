'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  active: boolean;
  last_used_at: string | null;
  created_at: string;
}

interface Props {
  keys: ApiKey[];
}

export function ApiKeysClient({ keys }: Props) {
  const [open, setOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  async function handleCreate() {
    if (!keyName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/v1/keys', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: keyName }) });
      const data = await res.json();
      if (res.ok) {
        setNewKey(data.key);
        toast.success('API key created');
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error('Failed to create key');
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm('Revoke this API key? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/v1/keys?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Key revoked');
        window.location.reload();
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch {
      toast.error('Failed to revoke key');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">API Keys</h1>
          <p className="text-sm text-muted-foreground">Manage API keys for programmatic access</p>
        </div>
        <Dialog open={open && !newKey} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Create key</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API key</DialogTitle>
              <DialogDescription>Name your key for easy identification</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="key-name">Key name</Label>
              <Input id="key-name" placeholder="Production" value={keyName} onChange={(e) => setKeyName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={creating || !keyName.trim()}>
                {creating ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {newKey && (
        <Card className="border-signal-green/30">
          <CardHeader>
            <CardTitle className="text-base text-signal-green">Key created</CardTitle>
            <CardDescription>Copy this key now — you won't be able to see it again</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={newKey} readOnly className="font-mono text-xs" />
              <Button variant="outline" onClick={() => { navigator.clipboard.writeText(newKey); toast.success('Copied'); }}>Copy</Button>
              <Button onClick={() => { setNewKey(null); setOpen(false); setKeyName(''); window.location.reload(); }}>Done</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50">
        <CardContent className="p-0">
          {keys.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No API keys yet. Create one to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last used</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{k.key_prefix}...</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${k.active ? 'text-signal-green' : 'text-muted-foreground'}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {k.active ? 'Active' : 'Revoked'}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(k.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {k.active && (
                        <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={() => handleRevoke(k.id)}>
                          Revoke
                        </Button>
                      )}
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
