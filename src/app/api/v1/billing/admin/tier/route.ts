import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const VALID_TIERS = ['free', 'starter', 'growth', 'enterprise'];

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

  const { userId, tier } = await request.json();
  if (!userId || !tier || !VALID_TIERS.includes(tier)) {
    return NextResponse.json({ error: 'Invalid userId or tier' }, { status: 400 });
  }

  const adminClient = createSupabaseAdminClient();
  await adminClient.from('user_profiles').update({ subscription_tier: tier }).eq('id', userId);
  await adminClient.from('admin_audit_log').insert({
    admin_id: user.id,
    action: 'change_tier',
    target_type: 'user',
    target_id: userId,
    details: { new_tier: tier },
  });

  return NextResponse.json({ success: true, tier });
}
