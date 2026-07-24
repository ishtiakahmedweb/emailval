import type { Metadata } from 'next';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { AdminPlansClient } from './plans-client';

export const metadata: Metadata = { title: 'Subscription Plans' };

export default async function AdminPlansPage() {
  const supabase = createSupabaseAdminClient();
  const { data: plans } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('price_monthly');

  return <AdminPlansClient plans={(plans ?? []) as any} />;
}
