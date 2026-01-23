'use client';

import { useEffect, useState } from 'react';

export default function Newsletter() {
  const [subscriberCount, setSubscriberCount] = useState(7); // Dynamic count

  // Simulate growing subscriber count
  useEffect(() => {
    const interval = setInterval(() => {
      setSubscriberCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      {/* Background pattern */}

      <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/30">
        <div className="max-w-2xl mx-auto">
          <iframe
            src="https://embeds.beehiiv.com/276ea08f-2b4f-433b-82f9-6e3648ac6869"
            data-test-id="beehiiv-embed"
            width="100%"
            height="320"
            frameBorder="0"
            scrolling="no"
            className="rounded-lg border-2 border-white/20 dark:border-gray-700/50 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm"
            style={{
              margin: 0,
            }}
          />

          <div className="mt-8 text-center">
            <div className="mb-4 p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-lg">
              <p className="text-orange-700 dark:text-orange-300 text-xs sm:text-sm leading-relaxed">
                ⚠️{' '}
                <span className="block sm:inline mt-1 sm:mt-0">
                  Subscribed before Aug 24, 2025? Please re-subscribe due to technical issues. Sorry
                  for the inconvenience!
                </span>
              </p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              🔒 No spam, ever. Unsubscribe with one click.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs">
              Free forever • Monthly updates • Browser insights
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
