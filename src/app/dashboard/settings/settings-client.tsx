'use client';

import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateProfile } from '@/lib/supabase/actions';

interface Props {
  email: string;
  displayName: string;
  subscriptionTier: string;
}

export function SettingsClient({ email, displayName, subscriptionTier }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Profile updated');
      formRef.current?.reset();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings</p>
      </div>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" name="name" defaultValue={displayName} placeholder="Your name" />
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Plan</CardTitle>
          <CardDescription>You are on the {subscriptionTier} plan</CardDescription>
        </CardHeader>
        <CardContent>
          <a href="/dashboard/billing" className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
            Manage billing
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
