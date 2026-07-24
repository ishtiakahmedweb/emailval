'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { redirectToCheckout, openPortal } from '@/lib/billing/client';
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
}

interface CreditTx {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  stripe_payment_intent_id: string | null;
  description: string | null;
  created_at: string;
}

interface Props {
  creditsRemaining: number;
  subscriptionTier: string;
  subscriptionStatus: string | null;
  stripeCustomerId: string | null;
  plans: Plan[];
  transactions: CreditTx[];
}

const CREDIT_PACKS = [
  { id: 'credit_1k',  credits: 1_000,  price: 5,   label: '1,000 credits',  desc: 'Perfect for testing and small lists' },
  { id: 'credit_10k', credits: 10_000, price: 45,  label: '10,000 credits', desc: 'Ideal for growing teams' },
  { id: 'credit_50k', credits: 50_000, price: 199, label: '50,000 credits', desc: 'Best value for high-volume scrubbing' },
];

function typeBadge(type: string) {
  const map: Record<string, { color: string; label: string }> = {
    topup_purchase: { color: 'text-signal-green', label: 'Top-up' },
    subscription_grant: { color: 'text-signal-cyan', label: 'Allowance' },
    verification_usage: { color: 'text-signal-red', label: 'Usage' },
  };
  const m = map[type] ?? { color: 'text-muted-foreground', label: type };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${m.color}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
}

export function BillingClient({
  creditsRemaining,
  subscriptionTier,
  subscriptionStatus,
  stripeCustomerId,
  plans,
  transactions,
}: Props) {
  const [buying, setBuying] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  async function handleBuy(packId: string) {
    setBuying(packId);
    try {
      await redirectToCheckout({ mode: 'payment', creditPackId: packId });
    } catch {
      toast.error('Failed to open checkout');
      setBuying(null);
    }
  }

  async function handleUpgrade(priceId: string) {
    try {
      await redirectToCheckout({ mode: 'subscription', priceId });
    } catch {
      toast.error('Failed to open subscription checkout');
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      await openPortal();
    } catch {
      toast.error('Failed to open billing portal');
      setPortalLoading(false);
    }
  }

  const tierDisplay = subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1);
  const isLowBalance = creditsRemaining < 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground">Manage your credits, subscription, and billing history</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Credits</CardTitle>
              {isLowBalance && (
                <span className="inline-flex items-center gap-1 rounded-full bg-signal-amber/15] px-2 py-0.5 text-xs font-medium text-signal-amber">
                  Low balance
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{creditsRemaining.toLocaleString()}</div>
            <div className="mt-2 h-2 w-full rounded-full bg-sidebar-accent">
              <div
                className={`h-2 rounded-full transition-all ${isLowBalance ? 'bg-signal-amber]' : 'bg-signal-green]'}`}
                style={{ width: `${Math.min((creditsRemaining / 1000) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold capitalize">{tierDisplay}</div>
            {subscriptionStatus && (
              <p className="mt-1 text-xs text-muted-foreground capitalize">
                {subscriptionStatus === 'active' ? 'Active' : subscriptionStatus === 'past_due' ? 'Past due' : subscriptionStatus}
              </p>
            )}
          </CardContent>
          <CardFooter>
            {stripeCustomerId ? (
              <Button variant="outline" size="sm" className="w-full" onClick={handlePortal} disabled={portalLoading}>
                {portalLoading ? 'Loading...' : 'Manage in Stripe'}
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">No active subscription</p>
            )}
          </CardFooter>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{transactions.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">Transactions recorded</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Buy Credits</CardTitle>
          <CardDescription>Pre-paid credit packs never expire</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {CREDIT_PACKS.map((pack) => (
              <Card key={pack.id} className="border-border/50 transition-all hover:border-muted-foreground">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{pack.credits.toLocaleString()}</CardTitle>
                  <CardDescription>{pack.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${pack.price}</div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleBuy(pack.id)} disabled={buying === pack.id}>
                    {buying === pack.id ? 'Opening...' : 'Buy now'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Subscription Plans</CardTitle>
          <CardDescription>Compare plans and upgrade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => {
              const isCurrent = plan.tier === subscriptionTier;
              return (
                <Card key={plan.id} className={`border-border/50 transition-all ${isCurrent ? 'ring-1 ring-signal-cyan' : 'hover:border-border'}`}>
                  <CardHeader>
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3 text-2xl font-bold">
                      {plan.price_monthly === 0 ? 'Free' : `$${plan.price_monthly}/mo`}
                    </div>
                    {plan.monthly_credits > 0 && (
                      <p className="mb-3 text-sm text-muted-foreground">{plan.monthly_credits.toLocaleString()} credits/mo</p>
                    )}
                    <ul className="space-y-1">
                      {(plan.features as string[]).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="mt-0.5 text-signal-green">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {isCurrent ? (
                      <Button variant="outline" className="w-full" disabled>Current plan</Button>
                    ) : plan.price_monthly === 0 ? (
                      <Button variant="outline" className="w-full" onClick={handlePortal}>Downgrade</Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => plan.stripe_price_id_monthly && handleUpgrade(plan.stripe_price_id_monthly)}
                        disabled={!plan.stripe_price_id_monthly}
                      >
                        Upgrade
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Transaction History</CardTitle>
          <CardDescription>Last {transactions.length} credit movements</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No transactions yet. Buy credits or verify emails to see activity here.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{typeBadge(tx.type)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {tx.description ?? '—'}
                    </TableCell>
                    <TableCell className={`text-xs font-medium ${tx.amount > 0 ? 'text-signal-green' : 'text-destructive'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {tx.balance_after.toLocaleString()}
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
