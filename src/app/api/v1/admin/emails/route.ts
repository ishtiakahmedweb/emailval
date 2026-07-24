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

  const { id, subject, body_html } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const adminClient = createSupabaseAdminClient();
  await adminClient.from('email_templates').update({ subject, body_html, updated_at: new Date().toISOString() }).eq('id', id);
  await adminClient.from('admin_audit_log').insert({
    admin_id: user.id,
    action: 'update_email_template',
    target_type: 'email_template',
    target_id: id,
    details: { subject },
  });

  return NextResponse.json({ success: true });
}
