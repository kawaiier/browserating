import { formatScoreOutcome, getScoreOutcome } from './comparisonViewModel.js';
import { hasSharedMeasurement } from './comparisonIndex.js';

/**
 * Text for a pair's social card, using the page's default view: primary engines and the
 * first platform where both browsers have a score. Returns null for evidence-poor pairs,
 * which are noindex and get the generic site card instead.
 */
export function comparisonCard(data) {
  if (!data || !hasSharedMeasurement(data)) return null;
  const platform = data.platforms.find(
    (p) => p.a.state === 'available' && p.b.state === 'available'
  );
  const { browserA, browserB } = data;
  return {
    title: `${browserA.name} vs ${browserB.name}`,
    platform: `${platform.label} · Speedometer 3.1`,
    rows: [
      { name: browserA.name, score: platform.a.score.toFixed(2) },
      { name: browserB.name, score: platform.b.score.toFixed(2) },
    ],
    outcome: formatScoreOutcome(
      getScoreOutcome(platform.a, platform.b),
      browserA.name,
      browserB.name
    ),
  };
}
