'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [defaultCredits, setDefaultCredits] = useState(100);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/v1/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ default_credits: defaultCredits }),
    });
    if (res.ok) {
      toast.success('Settings saved');
    } else {
      toast.error('Failed to save settings');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-sm text-muted-foreground">Configure global application settings</p>
      </div>

      <div className="rounded-lg border border-border/50 bg-card p-5">
        <h3 className="text-sm font-semibold">Default Signup Credits</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Number of free credits new users receive when they sign up
        </p>
        <input
          type="number"
          value={defaultCredits}
          onChange={(e) => setDefaultCredits(parseInt(e.target.value) || 0)}
          className="mt-3 w-32 rounded-md border border-border/50 bg-background px-3 py-1.5 text-sm outline-none"
          min={0}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-3 rounded-md bg-[oklch(0.67_0.16_210)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="rounded-lg border border-border/50 bg-card p-5">
        <h3 className="text-sm font-semibold">Environment</h3>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Supabase URL</span>
            <span className="font-mono text-xs">{process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Site URL</span>
            <span className="font-mono text-xs">{process.env.NEXT_PUBLIC_SITE_URL ?? 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Resend</span>
            <span className="font-mono text-xs">{process.env.RESEND_API_KEY ? 'Configured' : 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Stripe</span>
            <span className="font-mono text-xs">{process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder' ? 'Configured' : 'Placeholder only'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
