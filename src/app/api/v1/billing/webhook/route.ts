import type Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { stripe, CREDIT_PACKS } from '@/lib/billing/stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const creditPackId = session.metadata?.credit_pack_id;
      const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;

      if (userId && creditPackId && paymentIntentId) {
        const pack = CREDIT_PACKS.find((p) => p.id === creditPackId);
        if (!pack) break;

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('credits_remaining')
          .eq('id', userId)
          .single();

        if (profile) {
          const before = profile.credits_remaining;
          const after = before + pack.credits;

          const { error: txError } = await supabase.from('credit_transactions').insert({
            user_id: userId,
            type: 'topup_purchase',
            amount: pack.credits,
            balance_before: before,
            balance_after: after,
            stripe_payment_intent_id: paymentIntentId,
            description: `Purchased ${pack.label}`,
          });

          if (txError) {
            if (txError.message.includes('duplicate key')) break;
          } else {
            await supabase
              .from('user_profiles')
              .update({ credits_remaining: after })
              .eq('id', userId);

            // Send receipt email
            try {
              const { sendPaymentReceipt } = await import('@/lib/email');
              const amount = ((session.amount_total ?? 0) / 100).toFixed(2);
              const { data: userEmail } = await supabase.auth.admin.getUserById(userId);
              if (userEmail?.user?.email) {
                await sendPaymentReceipt(userEmail.user.email, userEmail.user.email.split('@')[0], Number(amount), pack.credits);
              }
            } catch {
              // non-blocking
            }
          }
        }
      }
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      const invoiceData = invoice as unknown as Record<string, unknown>;
      const subscriptionId = invoiceData.subscription as string | null;
      const customerId = invoiceData.customer as string;

      if (subscriptionId && customerId) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id, credits_remaining')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!profile) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const tier = subscription.metadata?.tier ?? 'starter';
        const { data: plan } = await supabase
          .from('subscription_plans')
          .select('monthly_credits')
          .eq('tier', tier)
          .single();

        const grantAmount = plan?.monthly_credits ?? 5000;
        const before = profile.credits_remaining;
        const after = before + grantAmount;

          const paymentIntentId = (invoiceData.payment_intent as string | null) ?? invoice.id;

          await supabase.from('credit_transactions').insert({
            user_id: profile.id,
            type: 'subscription_grant',
            amount: grantAmount,
            balance_before: before,
            balance_after: after,
            stripe_payment_intent_id: paymentIntentId,
            description: `Monthly ${tier} allowance`,
          });

        await supabase
          .from('user_profiles')
          .update({
            credits_remaining: after,
            subscription_status: 'active',
            stripe_subscription_id: subscriptionId,
          })
          .eq('id', profile.id);

        // Send receipt email
        try {
          const { sendPaymentReceipt } = await import('@/lib/email');
          const { data: userData } = await supabase.auth.admin.getUserById(profile.id);
          if (userData?.user?.email) {
            await sendPaymentReceipt(userData.user.email, userData.user.email.split('@')[0], Number(invoiceData.amount_paid ?? 0) / 100, grantAmount);
          }
        } catch {
          // non-blocking
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object;
      const custId = sub.customer as string;
      const status = sub.status;
      const items = sub.items.data;
      const priceId = items[0]?.price?.id;

      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('tier')
        .or(`stripe_price_id_monthly.eq.${priceId},stripe_price_id_yearly.eq.${priceId}`)
        .single();

      if (plan) {
        await supabase
          .from('user_profiles')
          .update({
            subscription_tier: plan.tier as 'free' | 'starter' | 'growth' | 'enterprise',
            subscription_status: status === 'active' ? 'active' : status === 'past_due' ? 'past_due' : status === 'canceled' ? 'canceled' : 'incomplete',
          })
          .eq('stripe_customer_id', custId);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const deletedSub = event.data.object;
      const deletedCustId = deletedSub.customer as string;
      await supabase
        .from('user_profiles')
        .update({ subscription_tier: 'free', subscription_status: 'canceled', stripe_subscription_id: null })
        .eq('stripe_customer_id', deletedCustId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
