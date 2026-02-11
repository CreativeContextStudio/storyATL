'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <h2 className="font-display text-fluid-2xl font-bold text-text-primary">
        Something went wrong
      </h2>
      <p className="max-w-md text-fluid-base text-text-secondary">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="rounded-brand border border-accent px-6 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-text-inverse"
      >
        Try again
      </button>
    </div>
  );
}
