'use client';

export default function RootError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="rounded bg-primary px-4 py-2 text-primary-foreground">
        Try again
      </button>
    </div>
  );
}
