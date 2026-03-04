'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BrowserCompareDropdown({ currentSlug, currentName, browsers }) {
  const router = useRouter();
  const [selected, setSelected] = useState('');

  const handleChange = (e) => {
    const selectedSlug = e.target.value;
    setSelected(selectedSlug);
    if (selectedSlug) {
      router.push(`/compare/${currentSlug}-vs-${selectedSlug}`);
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Compare {currentName} With Another Browser
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <label
          htmlFor="compare-select"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Select a browser to compare against:
        </label>
        <select
          id="compare-select"
          value={selected}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="" disabled>
            Choose a browser...
          </option>
          {browsers.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
