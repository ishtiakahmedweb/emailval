import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { verify } from '@/lib/engine';
import { deliverWebhook } from '@/lib/webhook';

const LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const BATCH_SIZE = 50;

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { jobId, column } = await request.json();
    if (!jobId || !column) {
      return NextResponse.json({ error: 'jobId and column are required' }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();

    // Atomic lock: only claim if pending and not locked
    const lockUntil = new Date(Date.now() + LOCK_TIMEOUT_MS).toISOString();
    const { data: job } = await adminClient
      .from('bulk_jobs')
      .update({
        status: 'processing',
        locked_until: lockUntil,
        column_mapping: { email_column: column },
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .eq('status', 'pending')
      .select()
      .single();

    if (!job) {
      const { data: existing } = await adminClient
        .from('bulk_jobs')
        .select('status')
        .eq('id', jobId)
        .single();
      const msg = existing?.status === 'processing' ? 'Job is already being processed' : 'Job not found or already completed';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from('csv_uploads')
      .download(job.storage_path);

    if (downloadError || !fileData) {
      await adminClient.from('bulk_jobs').update({ status: 'failed', error_message: 'Failed to read uploaded file' }).eq('id', jobId);
      return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
    }

    const text = await fileData.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    const emails: string[] = [];

    for (const row of parsed.data as Record<string, string>[]) {
      const email = (row[column] ?? '').trim();
      if (email) emails.push(email);
    }

    if (emails.length === 0) {
      await adminClient.from('bulk_jobs').update({ status: 'completed', completed_at: new Date().toISOString(), locked_until: null }).eq('id', jobId);
      return NextResponse.json({ message: 'No emails found', jobId });
    }

    let deliverable = 0;
    let risky = 0;
    let undeliverable = 0;
    let unknown = 0;
    let processed = 0;
    let totalCredits = 0;

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(batch.map((email) => verify(email)));

      for (const result of results) {
        if (result.status === 'fulfilled') {
          const v = result.value;
          if (v.state === 'deliverable') deliverable++;
          else if (v.state === 'risky') risky++;
          else if (v.state === 'undeliverable') undeliverable++;
          else unknown++;
          totalCredits++;
        }
      }

      processed += batch.length;

      await adminClient
        .from('bulk_jobs')
        .update({
          processed_rows: processed,
          deliverable_count: deliverable,
          risky_count: risky,
          undeliverable_count: undeliverable,
          unknown_count: unknown,
          credits_consumed: totalCredits,
          locked_until: new Date(Date.now() + LOCK_TIMEOUT_MS).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', jobId);
    }

    const headers = ['Email,State,QualityScore,LatencyMs,DidYouMean'];
    const rows = [];

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(batch.map((email) => verify(email)));
      for (const result of results) {
        if (result.status === 'fulfilled') {
          const v = result.value;
          rows.push(`"${v.email}",${v.state},${v.qualityScore},${v.latencyMs},${v.didYouMean ?? ''}`);
        }
      }
    }

    const csv = headers.join('\n') + '\n' + rows.join('\n');
    const resultsBlob = new Blob([csv], { type: 'text/csv' });
    const resultsPath = `results/${jobId}.csv`;

    await supabase.storage.from('csv_uploads').upload(resultsPath, resultsBlob, { upsert: true });

    const profileResult = await supabase
      .from('user_profiles')
      .select('credits_remaining')
      .eq('id', user.id)
      .single();

    if (profileResult.data) {
      const newCredits = Math.max(0, profileResult.data.credits_remaining - totalCredits);
      await supabase.from('user_profiles').update({ credits_remaining: newCredits, total_processed: processed }).eq('id', user.id);
    }

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(batch.map((email) => verify(email)));
      const logEntries = [];
      for (const result of results) {
        if (result.status === 'fulfilled') {
          const v = result.value;
          logEntries.push({
            user_id: user.id,
            email: v.email,
            state: v.state,
            stages: v.stages as unknown as Record<string, unknown>,
            latency_ms: v.latencyMs,
            source: 'bulk',
            credits_consumed: 1,
            quality_score: v.qualityScore,
          });
        }
      }
      if (logEntries.length > 0) {
        await supabase.from('verification_log').insert(logEntries as any);
      }
    }

    await adminClient
      .from('bulk_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        results_storage_path: resultsPath,
        locked_until: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId);

    // Fire webhook
    try {
      await deliverWebhook(user.id, 'bulk.completed', {
        jobId,
        filename: job.filename,
        total: emails.length,
        deliverable,
        risky,
        undeliverable,
        unknown,
        creditsConsumed: totalCredits,
      });
    } catch {
      // webhook delivery is non-blocking
    }

    // Send email notification
    try {
      const { sendBulkCompleteEmail } = await import('@/lib/email');
      await sendBulkCompleteEmail(user.email ?? '', user.email?.split('@')[0] ?? 'User', {
        filename: job.filename,
        deliverable,
        undeliverable,
        total: emails.length,
      });
    } catch {
      // email send is non-blocking
    }

    return NextResponse.json({
      jobId,
      status: 'completed',
      total: emails.length,
      deliverable,
      risky,
      undeliverable,
      unknown,
      creditsConsumed: totalCredits,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
