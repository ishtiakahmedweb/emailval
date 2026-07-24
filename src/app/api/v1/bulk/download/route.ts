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
    .select('results_storage_path, filename')
    .eq('id', jobId)
    .eq('user_id', user.id)
    .single();

  if (error || !job || !job.results_storage_path) {
    return NextResponse.json({ error: 'Results not found' }, { status: 404 });
  }

  const { data: fileData, error: downloadError } = await supabase.storage
    .from('csv_uploads')
    .download(job.results_storage_path);

  if (downloadError || !fileData) {
    return NextResponse.json({ error: 'Failed to read results' }, { status: 500 });
  }

  const text = await fileData.text();
  const cleanName = job.filename.replace(/\.(csv|tsv)$/i, '_verified.csv');

  return new NextResponse(text, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${cleanName}"`,
    },
  });
}
