'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login, magicLink } from '@/lib/supabase/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const action = isMagicLink ? magicLink : login;
    const result = await action(form);
    setLoading(false);

    if ('error' in result) {
      toast.error(result.error);
    } else if ('success' in result) {
      if (isMagicLink && result.message) {
        toast.success(result.message);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
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
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            {isMagicLink ? 'Send a magic link to your email' : 'Sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            {!isMagicLink && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/reset-password" className="text-xs text-muted-foreground hover:text-foreground">
                    Forgot?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : isMagicLink ? 'Send Magic Link' : 'Sign in'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsMagicLink(!isMagicLink)}
              className="text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              {isMagicLink ? 'Sign in with password instead' : 'Sign in with magic link'}
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            No account?{' '}
            <Link href="/auth/signup" className="text-foreground underline underline-offset-2">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
