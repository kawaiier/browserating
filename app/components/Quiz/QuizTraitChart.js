'use client';

import {
  BROWSER_DATASET_STYLE,
  RADAR_CHART_OPTIONS,
  TRAIT_ORDER,
  TRAIT_META,
  USER_DATASET_STYLE,
} from '../../lib/quiz-constants';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(...registerables);

function normalizeToScale(traits) {
  const total = Object.values(traits).reduce((s, v) => s + v, 0);
  if (total === 0) return Object.fromEntries(Object.keys(traits).map((k) => [k, 0]));
  const normalized = Object.fromEntries(Object.entries(traits).map(([k, v]) => [k, v / total]));
  const maxVal = Math.max(...Object.values(normalized));
  if (maxVal === 0) return normalized;
  return Object.fromEntries(Object.entries(normalized).map(([k, v]) => [k, (v / maxVal) * 10]));
}

export default function QuizTraitChart({ userTraits, browserProfile }) {
  const labels = TRAIT_ORDER.map((key) => TRAIT_META[key]?.label ?? key);

  const userScaled = normalizeToScale(userTraits);
  const userData = TRAIT_ORDER.map((key) => userScaled[key] ?? 0);
  const browserData = TRAIT_ORDER.map((key) => browserProfile.traits?.[key] ?? 0);

  const data = {
    labels,
    datasets: [
      { ...USER_DATASET_STYLE, data: userData },
      { ...BROWSER_DATASET_STYLE, label: browserProfile.name, data: browserData },
    ],
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 text-center mb-4 uppercase tracking-wider">
        Your Priorities vs {browserProfile.name}
      </h3>
      <div className="max-w-sm mx-auto">
        <Radar data={data} options={RADAR_CHART_OPTIONS} />
      </div>
    </div>
  );
}
