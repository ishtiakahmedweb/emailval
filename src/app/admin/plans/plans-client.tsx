'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Plan {
  id: string;
  tier: string;
  name: string;
  description: string;
  monthly_credits: number;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  stripe_price_id_monthly: string | null;
  stripe_price_id_yearly: string | null;
  active: boolean;
}

interface Props {
  plans: Plan[];
}

export function AdminPlansClient({ plans }: Props) {
  const router = useRouter();
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState({ name: '', description: '', monthly_credits: 0, price_monthly: 0, price_yearly: 0, features: '' });

  const openEdit = (plan: Plan) => {
    setEditPlan(plan);
    setForm({
      name: plan.name,
      description: plan.description,
      monthly_credits: plan.monthly_credits,
      price_monthly: plan.price_monthly,
      price_yearly: plan.price_yearly,
      features: (plan.features ?? []).join('\n'),
    });
  };

  const handleSave = async () => {
    if (!editPlan) return;
    const res = await fetch('/api/v1/admin/plans', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editPlan.id,
        ...form,
        features: form.features.split('\n').filter(Boolean),
      }),
    });
    if (res.ok) {
      toast.success('Plan updated');
      setEditPlan(null);
      router.refresh();
    } else {
      toast.error('Failed to update plan');
    }
  };

  const handleToggle = async (plan: Plan) => {
    const res = await fetch('/api/v1/admin/plans', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: plan.id, active: !plan.active }),
    });
    if (res.ok) {
      toast.success(`${plan.name} ${plan.active ? 'deactivated' : 'activated'}`);
      router.refresh();
    } else {
      toast.error('Failed to toggle plan');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscription Plans</h1>
        <p className="text-sm text-muted-foreground">{plans.length} plans configured</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <div key={plan.id} className={`rounded-lg border p-5 ${plan.active ? 'border-border/50 bg-card' : 'border-dashed border-border/30 bg-card/50'}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">{plan.name}</h3>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${plan.active ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'}`}>
                {plan.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{plan.tier}</p>
            <p className="mt-2 text-lg font-bold">${plan.price_monthly}<span className="text-xs text-muted-foreground">/mo</span></p>
            <p className="text-xs text-muted-foreground">${plan.price_yearly}/yr</p>
            <p className="mt-1 text-xs text-muted-foreground">{plan.monthly_credits.toLocaleString()} credits/mo</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => openEdit(plan)} className="rounded-md bg-[oklch(0.67_0.16_210)/0.1] px-2.5 py-1 text-xs font-medium text-[oklch(0.67_0.16_210)] hover:bg-[oklch(0.67_0.16_210)/0.2]">Edit</button>
              <button onClick={() => handleToggle(plan)} className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium hover:bg-muted/80">{plan.active ? 'Deactivate' : 'Activate'}</button>
            </div>
          </div>
        ))}
      </div>

      {editPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditPlan(null)}>
          <div className="w-full max-w-lg rounded-xl border border-border/50 bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold">Edit {editPlan.name}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-border/50 bg-background px-3 py-1.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border border-border/50 bg-background px-3 py-1.5 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Monthly Credits</label>
                  <input type="number" value={form.monthly_credits} onChange={(e) => setForm({ ...form, monthly_credits: parseInt(e.target.value) || 0 })} className="w-full rounded-md border border-border/50 bg-background px-3 py-1.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Price Monthly ($)</label>
                  <input type="number" value={form.price_monthly} onChange={(e) => setForm({ ...form, price_monthly: parseInt(e.target.value) || 0 })} className="w-full rounded-md border border-border/50 bg-background px-3 py-1.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Price Yearly ($)</label>
                  <input type="number" value={form.price_yearly} onChange={(e) => setForm({ ...form, price_yearly: parseInt(e.target.value) || 0 })} className="w-full rounded-md border border-border/50 bg-background px-3 py-1.5 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Features (one per line)</label>
                <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full rounded-md border border-border/50 bg-background px-3 py-1.5 text-sm outline-none" rows={5} />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={handleSave} className="flex-1 rounded-md bg-[oklch(0.67_0.16_210)] px-3 py-2 text-sm font-medium text-white hover:opacity-90">Save</button>
              <button onClick={() => setEditPlan(null)} className="flex-1 rounded-md bg-muted px-3 py-2 text-sm font-medium hover:bg-muted/80">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
