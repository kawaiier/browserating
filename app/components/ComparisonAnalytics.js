'use client';

import { useEffect, useRef } from 'react';
import { track } from '@vercel/analytics/react';
import { comparisonSourceFromReferrer, takeComparisonSource } from '@/app/lib/comparisonAnalytics';
import { canonicalPair } from '@/app/lib/comparisonUrl';

export default function ComparisonAnalytics({ first, second, noSharedData }) {
  const { first: browserA, second: browserB } = canonicalPair(first, second);
  const started = useRef(new Set());
  const noShared = useRef(new Set());

  useEffect(() => {
    const pair = canonicalPair(browserA, browserB).slug;
    if (started.current.has(pair)) return;
    started.current.add(pair);
    const source =
      takeComparisonSource(window.location.pathname) ||
      comparisonSourceFromReferrer(document.referrer, window.location.origin);
    track('comparison_started', { browser_a: browserA, browser_b: browserB, source });
  }, [browserA, browserB]);

  useEffect(() => {
    const pair = canonicalPair(browserA, browserB).slug;
    if (!noSharedData || noShared.current.has(pair)) return;
    noShared.current.add(pair);
    track('comparison_no_shared_data', { browser_a: browserA, browser_b: browserB });
  }, [browserA, browserB, noSharedData]);

  return null;
}
