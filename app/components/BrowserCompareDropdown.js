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
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-default)' }}>
        Compare {currentName} With Another Browser
      </h2>
      <div
        className="rounded-lg p-4"
        style={{
          backgroundColor: 'var(--surface-raised)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-raised)',
        }}
      >
        <label
          htmlFor="compare-select"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-default)' }}
        >
          Select a browser to compare against:
        </label>
        <select
          id="compare-select"
          value={selected}
          onChange={handleChange}
          className="w-full rounded-md px-3 py-2 text-sm"
          style={{
            backgroundColor: 'var(--surface-sunken)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-default)',
          }}
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
