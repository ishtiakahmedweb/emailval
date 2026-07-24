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

  const { logId } = await request.json();
  if (!logId) return NextResponse.json({ error: 'Missing logId' }, { status: 400 });

  const adminClient = createSupabaseAdminClient();
  const { data: log } = await adminClient.from('webhook_logs').select('*').eq('id', logId).single();
  if (!log) return NextResponse.json({ error: 'Log not found' }, { status: 404 });

  const { data: config } = await adminClient.from('webhook_configs').select('url').eq('id', log.webhook_config_id).single();
  if (!config) return NextResponse.json({ error: 'Webhook config not found' }, { status: 404 });

  try {
    const res = await fetch(config.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log.payload),
    });

    await adminClient.from('webhook_logs').insert({
      webhook_config_id: log.webhook_config_id,
      event: log.event,
      payload: log.payload,
      status: res.ok ? 'delivered' : 'failed',
      status_code: res.status,
      response_body: await res.text().catch(() => null),
      attempt: log.attempt + 1,
      max_attempts: log.max_attempts,
    });

    return NextResponse.json({ success: true, status: res.status });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send webhook' }, { status: 500 });
  }
}
