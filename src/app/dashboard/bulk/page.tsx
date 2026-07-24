import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { BulkUploadClient } from './bulk-client';

export const metadata: Metadata = { title: 'Bulk Verification' };

export default async function BulkPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('credits_remaining, subscription_tier')
    .eq('id', user.id)
    .single();

  const { data: recentJobs } = await supabase
    .from('bulk_jobs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <BulkUploadClient
      creditsRemaining={profile?.credits_remaining ?? 0}
      subscriptionTier={profile?.subscription_tier ?? 'free'}
      recentJobs={recentJobs ?? []}
    />
  );
}
