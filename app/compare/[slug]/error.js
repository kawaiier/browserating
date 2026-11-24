'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ComparisonError({ error, reset }) {
  useEffect(() => {
    console.error('Comparison failed:', error);
  }, [error]);

  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{ backgroundColor: 'var(--surface-default)', color: 'var(--text-default)' }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Comparison unavailable</h1>
        <p className="mb-6">
          The comparison could not be loaded. Your selected comparison is still in the address bar;
          try again or choose another browser from the rankings.
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          <button
            type="button"
            onClick={reset}
            className="min-h-[44px] rounded px-4 py-2"
            style={{ backgroundColor: 'var(--color-brand)', color: 'var(--text-inverse)' }}
          >
            Try again
          </button>
          <Link href="/#rankings" className="underline">
            Browse rankings
          </Link>
        </div>
      </div>
    </main>
  );
}
