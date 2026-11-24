export default function LoadingCompareHub() {
  return (
    <div role="status" className="container mx-auto max-w-4xl px-4 py-8">
      <span className="sr-only">Loading browser comparison</span>
      <div aria-hidden="true" className="animate-pulse">
        <div
          className="h-10 w-3/4 rounded mb-4"
          style={{ backgroundColor: 'var(--surface-sunken)' }}
        />
        <div
          className="h-6 w-1/2 rounded mb-8"
          style={{ backgroundColor: 'var(--surface-sunken)' }}
        />
        <div className="h-64 rounded mb-8" style={{ backgroundColor: 'var(--surface-sunken)' }} />
        <div className="h-48 rounded" style={{ backgroundColor: 'var(--surface-sunken)' }} />
      </div>
    </div>
  );
}
