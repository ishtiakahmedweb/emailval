import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function PATCH(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: admin } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { id } = body;

  if (!id) return NextResponse.json({ error: 'Missing plan id' }, { status: 400 });

  const adminClient = createSupabaseAdminClient();
  const updateData: Record<string, unknown> = {};

  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.monthly_credits !== undefined) updateData.monthly_credits = body.monthly_credits;
  if (body.price_monthly !== undefined) updateData.price_monthly = body.price_monthly;
  if (body.price_yearly !== undefined) updateData.price_yearly = body.price_yearly;
  if (body.features !== undefined) updateData.features = body.features;
  if (body.active !== undefined) updateData.active = body.active;
  if (body.stripe_price_id_monthly !== undefined) updateData.stripe_price_id_monthly = body.stripe_price_id_monthly;
  if (body.stripe_price_id_yearly !== undefined) updateData.stripe_price_id_yearly = body.stripe_price_id_yearly;

  await adminClient.from('subscription_plans').update(updateData).eq('id', id);
  await adminClient.from('admin_audit_log').insert({
    admin_id: user.id,
    action: 'update_plan',
    target_type: 'subscription_plan',
    target_id: id,
    details: updateData,
  });

  return NextResponse.json({ success: true });
}
