'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/supabase/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await resetPassword(form);
    setLoading(false);

    if ('error' in result) {
      toast.error(result.error);
    } else if ('success' in result) {
      toast.success(result.message);
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
          <CardTitle className="text-xl">Reset password</CardTitle>
          <CardDescription>Enter your email to receive a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/auth/login" className="text-foreground underline underline-offset-2">
              Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
