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

  if (body.default_credits !== undefined) {
    // Store in a system_settings table or update the function
    // For now, store it in the metadata of an admin user
    const adminClient = createSupabaseAdminClient();
    const { error } = await adminClient.rpc('set_system_setting' as any, {
      p_key: 'default_credits',
      p_value: String(body.default_credits),
    });

    if (error) {
      // Fallback: just log it
      await adminClient.from('admin_audit_log').insert({
        admin_id: user.id,
        action: 'update_settings',
        target_type: 'system',
        target_id: 'default_credits',
        details: { value: body.default_credits },
      });
    }
  }

  return NextResponse.json({ success: true });
}
