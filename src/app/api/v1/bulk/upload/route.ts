import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('credits_remaining')
    .eq('id', user.id)
    .single();

  if (!profile || profile.credits_remaining < 1) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.tsv')) {
      return NextResponse.json({ error: 'Only CSV and TSV files are supported' }, { status: 400 });
    }

    const text = await file.text();
    const parsed = Papa.parse(text, { preview: 5, skipEmptyLines: true });

    if (!parsed.data || parsed.data.length === 0) {
      return NextResponse.json({ error: 'File is empty or unreadable' }, { status: 400 });
    }

    const headers = parsed.data[0] as string[];
    const previewRows = parsed.data.slice(1, 4) as string[][];

    const storagePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('csv_uploads')
      .upload(storagePath, new Blob([text], { type: 'text/csv' }), {
        contentType: 'text/csv',
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: 'Storage upload failed' }, { status: 500 });
    }

    const { data: job, error: jobError } = await supabase
      .from('bulk_jobs')
      .insert({
        user_id: user.id,
        filename: file.name,
        total_rows: parsed.data.length - 1,
        storage_path: storagePath,
        status: 'pending',
      })
      .select()
      .single();

    if (jobError) {
      return NextResponse.json({ error: jobError.message }, { status: 500 });
    }

    return NextResponse.json({
      jobId: job.id,
      filename: file.name,
      totalRows: parsed.data.length - 1,
      headers,
      previewRows,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 });
  }
}
