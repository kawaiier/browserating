'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { buildCompareUrl } from '@/app/lib/comparisonUrl';

export default function BrowserCompareDropdown({
  browsers,
  first,
  second = '',
  engines = {},
  platform,
}) {
  const router = useRouter();
  const [a, setA] = useState(first);
  const [b, setB] = useState(second);
  const [attempted, setAttempted] = useState(false);
  const [pending, startTransition] = useTransition();

  const invalid = !a || !b || a === b;
  const navigate = (left, right) => {
    startTransition(() =>
      router.push(buildCompareUrl({ first: left, second: right, engines, platform }))
    );
  };
  const options = (other) =>
    browsers.map((browser) => {
      const counterpart = browsers.find((item) => item.slug === other);
      const count = counterpart
        ? browser.platforms.filter((id) => counterpart.platforms.includes(id)).length
        : null;
      const coverage =
        browser.platforms.length === 0
          ? 'No benchmarks yet'
          : count === null
            ? `${browser.platforms.length} measured platforms`
            : `${count} shared measured platforms`;
      return (
        <option key={browser.slug} value={browser.slug}>
          {browser.name} — {coverage}
        </option>
      );
    });
  const selectStyle = {
    backgroundColor: 'var(--surface-sunken)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-default)',
  };
  const buttonStyle = { border: '1px solid var(--border-default)', color: 'var(--text-default)' };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-default)' }}>
        Compare browsers
      </h2>
      <form
        action="/compare"
        method="get"
        className="rounded-lg p-4"
        style={{
          backgroundColor: 'var(--surface-raised)',
          border: '1px solid var(--border-subtle)',
        }}
        onSubmit={(event) => {
          event.preventDefault();
          setAttempted(true);
          if (!invalid && !pending) navigate(a, b);
        }}
      >
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          {[
            ['a', 'First browser', a, setA, b],
            ['b', 'Second browser', b, setB, a],
          ].map(([name, label, value, setValue, other]) => (
            <label
              key={name}
              className="block min-w-0 text-sm font-medium"
              style={{ color: 'var(--text-default)' }}
            >
              {label}
              <select
                name={name}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                required
                aria-invalid={attempted && invalid ? 'true' : undefined}
                aria-describedby={attempted && invalid ? 'compare-error' : undefined}
                className="mt-2 min-h-11 w-full min-w-0 max-w-full rounded-md px-3 py-2"
                style={selectStyle}
              >
                <option value="">Choose a browser</option>
                {options(other)}
              </select>
            </label>
          ))}
        </div>
        {platform && <input type="hidden" name="platform" value={platform} />}
        {Object.entries(engines).flatMap(([slug, platforms]) =>
          Object.entries(platforms).map(([id, engine]) => (
            <input
              key={`${slug}.${id}`}
              type="hidden"
              name={`engine.${slug}.${id}`}
              value={engine}
            />
          ))
        )}
        {attempted && invalid && (
          <p
            id="compare-error"
            role="alert"
            className="mt-3"
            style={{ color: 'var(--text-default)' }}
          >
            Choose two different browsers to compare.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={pending}
            className="min-h-11 rounded-md px-4 py-2 font-semibold disabled:opacity-50"
            style={buttonStyle}
          >
            Compare browsers
          </button>
          {second && (
            <button
              type="button"
              disabled={pending}
              onClick={() => navigate(second, first)}
              className="min-h-11 rounded-md px-4 py-2 disabled:opacity-50"
              style={buttonStyle}
            >
              Swap browsers
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setA(first);
              setB(second);
              setAttempted(false);
            }}
            className="min-h-11 rounded-md px-4 py-2"
            style={buttonStyle}
          >
            Reset selection
          </button>
        </div>
        <p role="status" className="mt-2 text-sm" style={{ color: 'var(--text-subtle)' }}>
          {pending
            ? 'Loading comparison…'
            : 'Measurements indicate benchmark coverage, not platform support.'}
        </p>
      </form>
    </section>
  );
}
