import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ApiKeysClient } from './api-keys-client';

export const metadata: Metadata = { title: 'API Keys' };

export default async function ApiKeysPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: keys } = await supabase
    .from('api_keys')
    .select('id, name, key_prefix, active, last_used_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return <ApiKeysClient keys={keys ?? []} />;
}
