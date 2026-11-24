// Metric validity, direction, display precision and user-facing interpretation live here.
export const comparisonMetrics = {
  speedometer3: {
    id: 'speedometer3',
    name: 'Speedometer 3.1',
    direction: 'higher',
    unit: 'score',
    precision: 2,
    isValid: (value) => value > 0,
    method: 'Five runs; discard the highest and lowest, then average the remaining three.',
    interpretation: 'Higher recorded score is better.',
  },
  adblock: {
    id: 'adblock',
    name: 'Ad-blocking test',
    direction: 'higher',
    unit: '%',
    precision: 0,
    isValid: (value) => value >= 0 && value <= 100,
    method: 'AdBlock Tester; per-run scoring configuration and setup were not retained.',
    interpretation:
      'Higher recorded AdBlock Tester score is better; it is not a guarantee of protection. Per-run scoring and setup details are not recorded.',
  },
};

export const DEFAULT_COMPARISON_METRIC = 'speedometer3';
export const comparisonMetric = comparisonMetrics[DEFAULT_COMPARISON_METRIC];

export function getComparisonMetric(id) {
  return comparisonMetrics[id] || null;
}

export function formatMetricScore(score, metric) {
  const formatted = score.toFixed(metric.precision);
  return metric.unit === '%' ? `${formatted}%` : formatted;
}
