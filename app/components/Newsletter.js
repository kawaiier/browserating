import { Lock, TriangleAlert } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="sr-only">Stay Updated on Browser Performance</h2>

      <div
        className="rounded-lg p-4 sm:p-8"
        style={{
          backgroundColor: 'var(--surface-raised)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="max-w-2xl mx-auto">
          <iframe
            src="https://embeds.beehiiv.com/276ea08f-2b4f-433b-82f9-6e3648ac6869"
            data-test-id="beehiiv-embed"
            width="100%"
            height="320"
            frameBorder="0"
            scrolling="no"
            className="rounded-lg min-h-[320px]"
            style={{
              margin: 0,
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--surface-sunken)',
            }}
          />

          <div className="mt-8 text-center">
            <div
              className="mb-4 p-3 sm:p-4 rounded-lg"
              style={{
                backgroundColor: 'var(--color-warning-subtle)',
                border: '1px solid var(--color-warning)',
              }}
            >
              <p
                className="text-xs sm:text-sm leading-relaxed flex items-start gap-2"
                style={{ color: 'var(--color-warning)' }}
              >
                <TriangleAlert className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="block sm:inline mt-1 sm:mt-0">
                  Subscribed before Aug 24, 2025? Please re-subscribe due to technical issues. Sorry
                  for the inconvenience!
                </span>
              </p>
            </div>
            <p
              className="text-sm mb-2 flex items-center justify-center gap-1.5"
              style={{ color: 'var(--text-subtle)' }}
            >
              <Lock className="w-3.5 h-3.5" aria-hidden="true" /> No spam, ever. Unsubscribe with one
              click.
            </p>
            <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
              Free forever • Monthly updates • Browser insights
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
