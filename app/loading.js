export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--surface-default)' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--color-brand)', borderTopColor: 'transparent' }}
        ></div>
        <p className="font-medium animate-pulse" style={{ color: 'var(--text-subtle)' }}>
          Loading Browserating...
        </p>
      </div>
    </div>
  );
}
