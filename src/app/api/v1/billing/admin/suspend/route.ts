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

  const { userId } = await request.json();
  if (!userId) return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });

  const adminClient = createSupabaseAdminClient();
  await adminClient.from('user_profiles').update({ subscription_status: 'canceled' }).eq('id', userId);
  await adminClient.from('admin_audit_log').insert({
    admin_id: user.id,
    action: 'suspend_user',
    target_type: 'user',
    target_id: userId,
    details: {},
  });

  return NextResponse.json({ success: true, suspended: true });
}
