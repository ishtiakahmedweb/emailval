import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
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

  const { userId, amount } = await request.json();
  if (!userId || !amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid userId or amount' }, { status: 400 });
  }

  const adminClient = createSupabaseAdminClient();

  const { data: profile } = await adminClient
    .from('user_profiles')
    .select('credits_remaining')
    .eq('id', userId)
    .single();

  if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const balanceBefore = profile.credits_remaining;
  const balanceAfter = balanceBefore + amount;

  await adminClient.from('user_profiles').update({ credits_remaining: balanceAfter }).eq('id', userId);
  await adminClient.from('credit_transactions').insert({
    user_id: userId,
    type: 'admin_grant',
    amount,
    balance_before: balanceBefore,
    balance_after: balanceAfter,
    description: `Admin grant by ${user.email}`,
    metadata: { admin_id: user.id },
  });
  await adminClient.from('admin_audit_log').insert({
    admin_id: user.id,
    action: 'grant_credits',
    target_type: 'user',
    target_id: userId,
    details: { amount, balance_before: balanceBefore, balance_after: balanceAfter },
  });

  return NextResponse.json({ success: true, balanceBefore, balanceAfter });
}
