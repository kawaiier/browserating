export default function Newsletter() {
  return (
    <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="sr-only">Stay Updated on Browser Performance</h2>

      <div className="bg-bg-surface-subtle dark:bg-neutral-700/20 rounded-xl p-4 sm:p-8 shadow-md border border-border-subtle dark:border-neutral-600">
        <div className="max-w-2xl mx-auto">
          <iframe
            src="https://embeds.beehiiv.com/276ea08f-2b4f-433b-82f9-6e3648ac6869"
            data-test-id="beehiiv-embed"
            width="100%"
            height="320"
            frameBorder="0"
            scrolling="no"
            className="rounded-lg border border-border-subtle dark:border-neutral-600 bg-bg-surface dark:bg-neutral-700 min-h-[320px]"
            style={{
              margin: 0,
            }}
          />

          <div className="mt-8 text-center">
            <div className="mb-4 p-3 sm:p-4 bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 dark:border-orange-500/40 rounded-lg">
              <p className="text-orange-600 dark:text-orange-400 text-xs sm:text-sm leading-relaxed">
                ⚠️{' '}
                <span className="block sm:inline mt-1 sm:mt-0">
                  Subscribed before Aug 24, 2025? Please re-subscribe due to technical issues. Sorry
                  for the inconvenience!
                </span>
              </p>
            </div>
            <p className="text-text-secondary dark:text-gray-400 text-sm mb-2">
              🔒 No spam, ever. Unsubscribe with one click.
            </p>
            <p className="text-text-muted dark:text-gray-500 text-xs">
              Free forever • Monthly updates • Browser insights
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
