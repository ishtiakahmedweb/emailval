'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  credits_remaining: number;
  total_processed: number;
  subscription_tier: string;
  subscription_status: string | null;
  role: string;
  is_onboarded: boolean;
  created_at: string;
  stripe_customer_id: string | null;
}

interface Props {
  profiles: Profile[];
  verificationCounts: Record<string, number>;
}

export function AdminUsersClient({ profiles, verificationCounts }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [creditAmount, setCreditAmount] = useState(0);
  const [newTier, setNewTier] = useState('');

  const filtered = profiles.filter(
    (p) =>
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.display_name?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleGrantCredits = async () => {
    if (!selectedUser || creditAmount <= 0) return;
    const res = await fetch('/api/v1/billing/admin/credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUser.id, amount: creditAmount }),
    });
    if (res.ok) {
      toast.success(`Granted ${creditAmount} credits to ${selectedUser.email}`);
      router.refresh();
    } else {
      toast.error('Failed to grant credits');
    }
  };

  const handleChangeTier = async () => {
    if (!selectedUser || !newTier) return;
    const res = await fetch('/api/v1/billing/admin/tier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUser.id, tier: newTier }),
    });
    if (res.ok) {
      toast.success(`Changed ${selectedUser.email} to ${newTier}`);
      router.refresh();
    } else {
      toast.error('Failed to change tier');
    }
  };

  const handleSuspend = async () => {
    if (!selectedUser) return;
    const res = await fetch('/api/v1/billing/admin/suspend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUser.id }),
    });
    if (res.ok) {
      toast.success(`Suspended ${selectedUser.email}`);
      router.refresh();
    } else {
      toast.error('Failed to suspend user');
    }
  };

  const handleUnsuspend = async () => {
    if (!selectedUser) return;
    const res = await fetch('/api/v1/billing/admin/unsuspend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUser.id }),
    });
    if (res.ok) {
      toast.success(`Unsuspended ${selectedUser.email}`);
      router.refresh();
    } else {
      toast.error('Failed to unsuspend user');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground">{profiles.length} total users</p>
      </div>

      <input
        type="text"
        placeholder="Search by email or name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md rounded-lg border border-border/50 bg-card px-4 py-2 text-sm outline-none focus:border-[oklch(0.67_0.16_210)]"
      />

      <div className="overflow-x-auto rounded-lg border border-border/50 bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Tier</th>
              <th className="px-4 py-3 font-medium">Credits</th>
              <th className="px-4 py-3 font-medium">Verifications</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((profile) => (
              <tr key={profile.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3 font-mono text-xs">{profile.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{profile.display_name ?? '-'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${profile.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-gray-500/10 text-gray-400'}`}>
                    {profile.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{profile.subscription_tier}</td>
                <td className="px-4 py-3">{profile.credits_remaining.toLocaleString()}</td>
                <td className="px-4 py-3">{verificationCounts[profile.id]?.toLocaleString() ?? 0}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(profile.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedUser(profile)}
                    className="rounded-md bg-[oklch(0.67_0.16_210)/0.1] px-2.5 py-1 text-xs font-medium text-[oklch(0.67_0.16_210)] hover:bg-[oklch(0.67_0.16_210)/0.2]"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedUser(null)}>
          <div className="w-full max-w-lg rounded-xl border border-border/50 bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold">{selectedUser.email}</h2>
            <p className="mt-1 text-xs text-muted-foreground">ID: {selectedUser.id}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Tier:</span> {selectedUser.subscription_tier}</div>
              <div><span className="text-muted-foreground">Status:</span> {selectedUser.subscription_status ?? 'none'}</div>
              <div><span className="text-muted-foreground">Credits:</span> {selectedUser.credits_remaining.toLocaleString()}</div>
              <div><span className="text-muted-foreground">Role:</span> {selectedUser.role}</div>
              <div><span className="text-muted-foreground">Onboarded:</span> {selectedUser.is_onboarded ? 'Yes' : 'No'}</div>
              <div><span className="text-muted-foreground">Stripe:</span> {selectedUser.stripe_customer_id ? 'Linked' : 'None'}</div>
            </div>

            <div className="mt-5 space-y-3 border-t border-border/50 pt-4">
              <h3 className="text-sm font-semibold">Actions</h3>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                  className="w-24 rounded-md border border-border/50 bg-background px-2 py-1.5 text-sm outline-none"
                  placeholder="Amount"
                  min={1}
                />
                <button onClick={handleGrantCredits} className="rounded-md bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-500 hover:bg-green-500/20">
                  Grant Credits
                </button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value)}
                  className="rounded-md border border-border/50 bg-background px-2 py-1.5 text-sm outline-none"
                >
                  <option value="">Select tier...</option>
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="growth">Growth</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                <button onClick={handleChangeTier} className="rounded-md bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-500/20">
                  Change Tier
                </button>
              </div>

              <div className="flex gap-2">
                {selectedUser.subscription_status === 'canceled' ? (
                  <button onClick={handleUnsuspend} className="rounded-md bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-500 hover:bg-emerald-500/20">
                    Unsuspend
                  </button>
                ) : (
                  <button onClick={handleSuspend} className="rounded-md bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/20">
                    Suspend Account
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 w-full rounded-md bg-muted px-3 py-2 text-sm font-medium hover:bg-muted/80"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
