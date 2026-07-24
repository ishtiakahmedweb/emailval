'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './server';

export async function signup(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirm = formData.get('confirm') as string;

  if (!email || !password) return { error: 'Email and password are required' };
  if (password.length < 6) return { error: 'Password must be at least 6 characters' };
  if (password !== confirm) return { error: 'Passwords do not match' };

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
  });

  if (error) return { error: error.message };

  try {
    const { sendWelcomeEmail } = await import('@/lib/email');
    await sendWelcomeEmail(email, email.split('@')[0], 100);
  } catch {
    // email send is non-blocking
  }

  revalidatePath('/', 'layout');
  return { success: true, message: 'Account created! Check your email for the confirmation link.' };
}

export async function login(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  revalidatePath('/', 'layout');
  return { success: true, message: '' };
}

export async function magicLink(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get('email') as string;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
  });

  if (error) return { error: error.message };
  return { success: true, message: 'Magic link sent! Check your email.' };
}

export async function resetPassword(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
  });

  if (error) return { error: error.message };
  return { success: true, message: 'Password reset link sent. Check your email.' };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: error.message };
  return { success: true, message: 'Password updated successfully.' };
}

export async function updateProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const displayName = formData.get('name') as string;
  const { error } = await supabase
    .from('user_profiles')
    .update({ display_name: displayName || null, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/dashboard/settings');
  return { success: true, message: 'Profile updated' };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/auth/login');
}
