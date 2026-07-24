'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Template {
  id: string;
  key: string;
  subject: string;
  body_html: string;
  description: string | null;
}

interface Props {
  templates: Template[];
}

export function AdminEmailsClient({ templates }: Props) {
  const router = useRouter();
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');

  const openEdit = (t: Template) => {
    setEditTemplate(t);
    setSubject(t.subject);
    setBodyHtml(t.body_html);
  };

  const handleSave = async () => {
    if (!editTemplate) return;
    const res = await fetch('/api/v1/admin/emails', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editTemplate.id, subject, body_html: bodyHtml }),
    });
    if (res.ok) {
      toast.success('Template saved');
      setEditTemplate(null);
      router.refresh();
    } else {
      toast.error('Failed to save template');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Email Templates</h1>
        <p className="text-sm text-muted-foreground">Manage transactional email content</p>
      </div>

      <div className="grid gap-4">
        {templates.map((t) => (
          <div key={t.id} className="rounded-lg border border-border/50 bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">{t.key}</h3>
                <p className="text-xs text-muted-foreground">{t.description ?? t.key}</p>
              </div>
              <button onClick={() => openEdit(t)} className="rounded-md bg-[oklch(0.67_0.16_210)/0.1] px-2.5 py-1 text-xs font-medium text-[oklch(0.67_0.16_210)] hover:bg-[oklch(0.67_0.16_210)/0.2]">
                Edit
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground"><strong>Subject:</strong> {t.subject}</p>
          </div>
        ))}
      </div>

      {editTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditTemplate(null)}>
          <div className="w-full max-w-2xl rounded-xl border border-border/50 bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold">Edit: {editTemplate.key}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-md border border-border/50 bg-background px-3 py-1.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">HTML Body</label>
                <textarea value={bodyHtml} onChange={(e) => setBodyHtml(e.target.value)} className="w-full rounded-md border border-border/50 bg-background px-3 py-1.5 text-sm outline-none font-mono" rows={15} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Preview</label>
                <div className="mt-1 rounded border border-border/50 bg-white p-4" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={handleSave} className="flex-1 rounded-md bg-[oklch(0.67_0.16_210)] px-3 py-2 text-sm font-medium text-white hover:opacity-90">Save</button>
              <button onClick={() => setEditTemplate(null)} className="flex-1 rounded-md bg-muted px-3 py-2 text-sm font-medium hover:bg-muted/80">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
