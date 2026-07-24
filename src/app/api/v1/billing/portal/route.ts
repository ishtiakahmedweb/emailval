import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/billing/stripe';

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  let stripeCustomerId = profile?.stripe_customer_id;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } });
    stripeCustomerId = customer.id;
    await supabase.from('user_profiles').update({ stripe_customer_id: customer.id }).eq('id', user.id);
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${request.nextUrl.origin}/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Portal session failed' }, { status: 500 });
  }
}
