'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface RecentJob {
  id: string;
  filename: string;
  total_rows: number;
  processed_rows: number;
  deliverable_count: number;
  risky_count: number;
  undeliverable_count: number;
  unknown_count: number;
  status: string;
  error_message: string | null;
  credits_consumed: number;
  results_storage_path: string | null;
  created_at: string;
  completed_at: string | null;
}

interface Props {
  creditsRemaining: number;
  subscriptionTier: string;
  recentJobs: RecentJob[];
}

function statePill(count: number, state: string) {
  const colors: Record<string, string> = {
    deliverable: 'bg-signal-green/15] text-signal-green',
    risky: 'bg-signal-amber/15] text-signal-amber',
    undeliverable: 'bg-signal-red/15] text-signal-red',
    unknown: 'bg-muted text-muted-foreground',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[state] ?? colors.unknown}`}>
      {count} {state}
    </span>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-sidebar-accent">
        <div
          className="h-2 rounded-full bg-signal-cyan] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="min-w-[4rem] text-right text-xs text-muted-foreground">{current}/{total}</span>
    </div>
  );
}

export function BulkUploadClient({ creditsRemaining, subscriptionTier, recentJobs }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsed, setParsed] = useState<{ jobId: string; headers: string[]; previewRows: string[][]; totalRows: number; filename: string } | null>(null);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [processing, setProcessing] = useState(false);
  const [activeJob, setActiveJob] = useState<RecentJob | null>(null);
  const [jobs, setJobs] = useState<RecentJob[]>(recentJobs);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const startPolling = useCallback((jobId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/bulk/status?jobId=${jobId}`);
        const data = await res.json();
        if (res.ok) {
          setActiveJob(data);
          setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, ...data } : j));
          if (data.status === 'completed' || data.status === 'failed') {
            if (pollRef.current) clearInterval(pollRef.current);
            if (data.status === 'completed') toast.success('Bulk verification completed');
            else toast.error(data.errorMessage ?? 'Bulk verification failed');
          }
        }
      } catch { /* ignore */ }
    }, 1500);
  }, []);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/v1/bulk/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) {
        setParsed(data);
        toast.success(`${data.totalRows} rows found`);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleProcess() {
    if (!parsed || !selectedColumn) return;
    setProcessing(true);
    try {
      const res = await fetch('/api/v1/bulk/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: parsed.jobId, column: selectedColumn }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Processing started');
        startPolling(parsed.jobId);
        setJobs((prev) => [{ id: parsed.jobId, filename: parsed.filename, total_rows: parsed.totalRows, status: 'processing', processed_rows: 0, deliverable_count: 0, risky_count: 0, undeliverable_count: 0, unknown_count: 0, credits_consumed: 0, results_storage_path: null, error_message: null, created_at: new Date().toISOString(), completed_at: null }, ...prev]);
        setActiveJob({
          id: parsed.jobId,
          filename: parsed.filename,
          total_rows: parsed.totalRows,
          processed_rows: 0,
          deliverable_count: 0,
          risky_count: 0,
          undeliverable_count: 0,
          unknown_count: 0,
          status: 'processing',
          credits_consumed: 0,
          results_storage_path: null,
          error_message: null,
          created_at: new Date().toISOString(),
          completed_at: null,
        });
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error('Processing request failed');
    } finally {
      setProcessing(false);
    }
  }

  async function handleDownload(jobId: string) {
    window.open(`/api/v1/bulk/download?jobId=${jobId}`, '_blank');
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith('.csv') || f.name.endsWith('.tsv'))) {
      setFile(f);
      setParsed(null);
      setSelectedColumn('');
    } else {
      toast.error('Please drop a CSV or TSV file');
    }
  }

  function handleReset() {
    setFile(null);
    setParsed(null);
    setSelectedColumn('');
    setActiveJob(null);
    if (pollRef.current) clearInterval(pollRef.current);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bulk Verification</h1>
          <p className="text-sm text-muted-foreground">
            Upload a CSV or TSV file to verify emails in bulk · {creditsRemaining.toLocaleString()} credits available
          </p>
        </div>
      </div>

      {!activeJob || activeJob.status === 'completed' || activeJob.status === 'failed' ? (
        <>
          {!parsed ? (
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
                    isDragging ? 'border-signal-cyan bg-signal-cyan/5' : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="mb-4 text-3xl text-muted-foreground">{isDragging ? '⬇' : '📁'}</div>
                  <p className="mb-1 text-sm font-medium text-foreground">
                    {isDragging ? 'Drop your file here' : 'Drag & drop your CSV or TSV file'}
                  </p>
                  <p className="mb-4 text-xs text-muted-foreground">or click to browse</p>
                  <input ref={inputRef} type="file" accept=".csv,.tsv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setParsed(null); setSelectedColumn(''); } }} />
                  {file && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); handleUpload(); }} disabled={uploading}>
                        {uploading ? 'Reading...' : 'Upload'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">{parsed.filename}</CardTitle>
                <CardDescription>{parsed.totalRows} rows detected. Select the column containing email addresses.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {parsed.headers.map((h) => (
                    <button
                      key={h}
                      onClick={() => setSelectedColumn(h)}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                        selectedColumn === h
                          ? 'border-signal-cyan bg-signal-cyan/10] text-foreground'
                          : 'border-border text-muted-foreground hover:border-muted-foreground'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
                {selectedColumn && (
                  <div className="rounded-lg bg-sidebar-accent p-3 text-xs text-muted-foreground">
                    Preview: {parsed.previewRows.map((r, i) => (
                      <span key={i} className="block">{r[parsed.headers.indexOf(selectedColumn)] ?? '(empty)'}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleProcess} disabled={!selectedColumn || processing}>
                    {processing ? 'Starting...' : `Verify ${parsed.totalRows.toLocaleString()} emails`}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}

      {activeJob && (activeJob.status === 'processing' || activeJob.status === 'pending') && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="h-2 w-2 animate-pulse rounded-full bg-signal-cyan]" />
              Verifying {activeJob.filename}
            </CardTitle>
            <CardDescription>{activeJob.total_rows.toLocaleString()} emails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar current={activeJob.processed_rows} total={activeJob.total_rows} />
            <div className="flex gap-2">
              {statePill(activeJob.deliverable_count, 'deliverable')}
              {statePill(activeJob.risky_count, 'risky')}
              {statePill(activeJob.undeliverable_count, 'undeliverable')}
              {statePill(activeJob.unknown_count, 'unknown')}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeJob.credits_consumed.toLocaleString()} credits consumed
            </p>
          </CardContent>
        </Card>
      )}

      {activeJob?.status === 'completed' && (
        <Card className="border-signal-green/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-signal-green">
              ✓ Complete
            </CardTitle>
            <CardDescription>{activeJob.filename}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {statePill(activeJob.deliverable_count, 'deliverable')}
              {statePill(activeJob.risky_count, 'risky')}
              {statePill(activeJob.undeliverable_count, 'undeliverable')}
              {statePill(activeJob.unknown_count, 'unknown')}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleDownload(activeJob.id)}>Download results</Button>
              <Button variant="outline" onClick={handleReset}>Verify another file</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeJob?.status === 'failed' && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Failed</CardTitle>
            <CardDescription>{activeJob.error_message}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleReset}>Try again</Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {jobs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No bulk jobs yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Breakdown</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((j) => (
                  <TableRow key={j.id}>
                    <TableCell className="max-w-[160px] truncate text-sm font-medium">{j.filename}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{j.total_rows}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                        j.status === 'completed' ? 'text-signal-green' :
                        j.status === 'failed' ? 'text-destructive' :
                        j.status === 'processing' ? 'text-signal-cyan' :
                        'text-muted-foreground'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full bg-current ${j.status === 'processing' ? 'animate-pulse' : ''}`} />
                        {j.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {j.status === 'completed' ? (
                        <div className="flex gap-1">
                          {statePill(j.deliverable_count, 'deliverable')}
                          {statePill(j.risky_count, 'risky')}
                          {statePill(j.undeliverable_count, 'undeliverable')}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{j.credits_consumed}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(j.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {j.status === 'completed' && j.results_storage_path && (
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleDownload(j.id)}>Download</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
