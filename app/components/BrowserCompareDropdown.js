'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { track } from '@vercel/analytics/react';
import { buildCompareUrl } from '@/app/lib/comparisonUrl';
import { rememberComparisonSource, takeComparisonSource } from '@/app/lib/comparisonAnalytics';

export default function BrowserCompareDropdown({
  browsers,
  first,
  second = '',
  engines = {},
  observations = {},
  platform,
  sharedOnly = false,
  metric,
  source = 'direct/unknown',
}) {
  const router = useRouter();
  const [a, setA] = useState(first);
  const [b, setB] = useState(second);
  const [attempted, setAttempted] = useState(false);
  const [pending, startTransition] = useTransition();

  const invalid = !a || !b || a === b;
  const navigate = (left, right) => {
    const destination = buildCompareUrl({
      first: left,
      second: right,
      engines,
      observations,
      platform,
      sharedOnly,
      metric,
    });
    const entrySource = takeComparisonSource(window.location.pathname) || source;
    rememberComparisonSource(entrySource, destination);
    if (
      browsers.some((browser) => browser.slug === left) &&
      browsers.some((browser) => browser.slug === right)
    ) {
      const [browserA, browserB] = [left, right].sort();
      track('comparison_applied', {
        browser_a: browserA,
        browser_b: browserB,
        source: entrySource,
      });
    }
    try {
      sessionStorage.setItem('comparison-focus', 'comparison-heading');
    } catch {
      // Navigation remains available when storage is blocked.
    }
    startTransition(() => router.push(destination));
  };
  const options = (other) =>
    browsers.map((browser) => {
      const counterpart = browsers.find((item) => item.slug === other);
      const count = counterpart
        ? browser.platforms.filter((id) => counterpart.platforms.includes(id)).length
        : null;
      const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
      const coverage =
        browser.platforms.length === 0
          ? 'No benchmarks yet'
          : count === null
            ? plural(browser.platforms.length, 'measured platform')
            : plural(count, 'shared measured platform');
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
  const buttonStyle = { border: '1px solid currentColor', color: 'var(--text-default)' };

  return (
    <section id="compare-browsers" className="mb-8 scroll-mt-4">
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
                className="mt-2 min-h-[44px] w-full min-w-0 max-w-full rounded-md px-3 py-2"
                style={selectStyle}
              >
                <option value="">Choose a browser</option>
                {options(other)}
              </select>
            </label>
          ))}
        </div>
        {platform && <input type="hidden" name="platform" value={platform} />}
        {sharedOnly && <input type="hidden" name="shared" value="1" />}
        {metric && metric !== 'speedometer3' && (
          <input type="hidden" name="metric" value={metric} />
        )}
        {Object.entries(observations).flatMap(([slug, platforms]) =>
          Object.entries(platforms).map(([id, observationId]) => (
            <input
              key={`${slug}.${id}`}
              type="hidden"
              name={`observation.${slug}.${id}`}
              value={observationId}
            />
          ))
        )}
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
            className="min-h-[44px] rounded-md px-4 py-2 font-semibold disabled:opacity-50"
            style={buttonStyle}
          >
            Compare browsers
          </button>
          {second && (
            <button
              type="button"
              disabled={pending}
              onClick={() => navigate(second, first)}
              className="min-h-[44px] rounded-md px-4 py-2 disabled:opacity-50"
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
            className="min-h-[44px] rounded-md px-4 py-2"
            style={buttonStyle}
          >
            Reset selection
          </button>
        </div>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-subtle)' }}>
          Measurements indicate benchmark coverage, not platform support.
        </p>
        <p role="status" className="text-sm">
          {pending ? 'Loading comparison…' : ''}
        </p>
      </form>
    </section>
  );
}
