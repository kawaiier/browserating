import Link from 'next/link';

export default function ComparisonNotFound() {
  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{ backgroundColor: 'var(--surface-default)', color: 'var(--text-default)' }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Comparison not found</h1>
        <p className="mb-6">Choose two different browsers from the catalog to compare.</p>
        <Link href="/#rankings" className="underline">
          Browse rankings
        </Link>
      </div>
    </main>
  );
}
