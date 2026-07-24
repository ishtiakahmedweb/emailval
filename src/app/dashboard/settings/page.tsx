import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SettingsClient } from './settings-client';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name, email, subscription_tier')
    .eq('id', user.id)
    .single();

  return (
    <SettingsClient
      email={user.email ?? ''}
      displayName={profile?.display_name ?? ''}
      subscriptionTier={profile?.subscription_tier ?? 'free'}
    />
  );
}
