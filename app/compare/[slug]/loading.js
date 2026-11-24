export default function LoadingComparison() {
  return (
    <div
      data-route-loading
      className="min-h-screen"
      style={{ backgroundColor: 'var(--surface-default)' }}
    >
      <div role="status" className="container mx-auto px-4 py-8">
        <span className="sr-only">Loading comparison</span>
        <div aria-hidden="true" className="max-w-4xl mx-auto animate-pulse">
          <div
            className="h-6 w-48 rounded mb-8"
            style={{ backgroundColor: 'var(--border-subtle)' }}
          />
          <div
            className="h-10 w-3/4 rounded mb-4"
            style={{ backgroundColor: 'var(--border-subtle)' }}
          />
          <div
            className="h-6 w-1/2 rounded mb-10"
            style={{ backgroundColor: 'var(--border-subtle)' }}
          />
          <div
            className="h-8 w-64 rounded mb-6"
            style={{ backgroundColor: 'var(--border-subtle)' }}
          />
          <div className="h-64 rounded mb-6" style={{ backgroundColor: 'var(--border-subtle)' }} />
          <div className="h-80 rounded" style={{ backgroundColor: 'var(--border-subtle)' }} />
        </div>
      </div>
    </div>
  );
}
