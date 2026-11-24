import assert from 'node:assert/strict';
import test from 'node:test';

import { getSpeedometerTrend, isFiniteMetric } from './benchmarkMetrics.js';

test('optional metric values are only available when finite numbers', () => {
  for (const value of [undefined, null, NaN, Infinity, '10']) {
    assert.equal(isFiniteMetric(value), false);
  }
  assert.equal(isFiniteMetric(0), true);
});

test('missing Speedometer observations do not break or skew trend calculation', () => {
  assert.deepEqual(getSpeedometerTrend([{ scores: {} }, { scores: null }]), {
    trend: 'stable',
    change: 0,
  });
  assert.deepEqual(
    getSpeedometerTrend([
      { scores: { speedometer3: 10 } },
      { scores: { speedometer3: 10 } },
      { scores: { speedometer3: 10 } },
      { scores: { speedometer3: 12 } },
      { scores: {} },
      { scores: { speedometer3: 12 } },
    ]),
    { trend: 'improving', change: 20 }
  );
});
