import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { BillingClient } from './billing-client';

export const metadata: Metadata = { title: 'Billing' };

export default async function BillingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('credits_remaining, subscription_tier, subscription_status, stripe_customer_id')
    .eq('id', user.id)
    .single();

  const { data: plans } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('active', true)
    .order('price_monthly');

  const { data: transactions } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <BillingClient
      creditsRemaining={profile?.credits_remaining ?? 0}
      subscriptionTier={profile?.subscription_tier ?? 'free'}
      subscriptionStatus={profile?.subscription_status ?? null}
      stripeCustomerId={profile?.stripe_customer_id ?? null}
      plans={plans ?? []}
      transactions={transactions ?? []}
    />
  );
}
