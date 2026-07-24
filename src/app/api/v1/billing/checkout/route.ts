import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { stripe, getCreditPack } from '@/lib/billing/stripe';

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { mode, priceId, creditPackId } = await request.json();

    let stripeCustomerId: string | undefined;
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profile?.stripe_customer_id) {
      stripeCustomerId = profile.stripe_customer_id;
    }

    if (mode === 'payment' && creditPackId) {
      const pack = getCreditPack(creditPackId);
      if (!pack) {
        return NextResponse.json({ error: 'Invalid credit pack' }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        customer_email: stripeCustomerId ? undefined : user.email,
        mode: 'payment',
        payment_intent_data: {
          metadata: { creditPackId, userId: user.id },
        },
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: pack.label,
                description: `${pack.credits.toLocaleString()} email verification credits`,
              },
              unit_amount: pack.price,
            },
            quantity: 1,
          },
        ],
        metadata: {
          user_id: user.id,
          credit_pack_id: creditPackId,
          credits: String(pack.credits),
        },
        success_url: `${request.nextUrl.origin}/dashboard/billing?success=true`,
        cancel_url: `${request.nextUrl.origin}/dashboard/billing?canceled=true`,
      });

      return NextResponse.json({ url: session.url });
    }

    if (mode === 'subscription' && priceId) {
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } });
        stripeCustomerId = customer.id;
        await supabase.from('user_profiles').update({ stripe_customer_id: customer.id }).eq('id', user.id);
      }

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { user_id: user.id },
        subscription_data: {
          metadata: { user_id: user.id },
        },
        success_url: `${request.nextUrl.origin}/dashboard/billing?success=true`,
        cancel_url: `${request.nextUrl.origin}/dashboard/billing?canceled=true`,
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: 'Invalid request: provide mode and priceId or creditPackId' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Checkout failed' }, { status: 500 });
  }
}
