'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signup } from '@/lib/supabase/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const password = form.get('password') as string;
    const confirm = form.get('confirm') as string;
    if (password !== confirm) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await signup(form);
    setLoading(false);

    if ('error' in result) {
      toast.error(result.error);
    } else if ('success' in result) {
      toast.success(result.message);
      router.push('/auth/login');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-border/50">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 inline-flex items-center justify-center">
            <span className="text-2xl font-bold text-foreground">
              Veri<span className="text-accent-light">flow</span>
            </span>
          </Link>
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Start verifying emails in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" name="confirm" type="password" placeholder="••••••••" required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-foreground underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
