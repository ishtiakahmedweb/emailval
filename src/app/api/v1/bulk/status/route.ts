import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobId = request.nextUrl.searchParams.get('jobId');
  if (!jobId) {
    return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
  }

  const { data: job, error } = await supabase
    .from('bulk_jobs')
    .select('*')
    .eq('id', jobId)
    .eq('user_id', user.id)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json({
    jobId: job.id,
    filename: job.filename,
    totalRows: job.total_rows,
    processedRows: job.processed_rows,
    deliverableCount: job.deliverable_count,
    riskyCount: job.risky_count,
    undeliverableCount: job.undeliverable_count,
    unknownCount: job.unknown_count,
    status: job.status,
    errorMessage: job.error_message,
    creditsConsumed: job.credits_consumed,
    hasResults: !!job.results_storage_path,
    createdAt: job.created_at,
    completedAt: job.completed_at,
  });
}
