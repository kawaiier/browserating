/**
 * Shared constants used across components.
 * Extracted to avoid duplication between BrowserRankingList, BrowserDetailsModal, etc.
 */

export const platformNames = {
  'macos-arm': 'macOS ARM',
  'macos-intel': 'macOS Intel',
  windows: 'Windows',
  android: 'Android',
  ipad: 'iPad OS',
};

export const platformIcons = {
  'macos-arm': '🍎',
  'macos-intel': '💻',
  windows: '🪟',
  android: '🤖',
  ipad: '📱',
};

export const engineColors = {
  Blink:
    'bg-blue-100 dark:bg-sky-900/50 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-sky-800 border border-blue-200 dark:border-sky-700',
  Gecko:
    'bg-green-100 dark:bg-emerald-900/50 text-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-emerald-800 border border-green-200 dark:border-emerald-700',
  WebKit:
    'bg-orange-100 dark:bg-amber-900/50 text-orange-800 dark:text-orange-100 hover:bg-orange-200 dark:hover:bg-amber-800 border border-orange-200 dark:border-amber-700',
  All: 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600',
};

export const getEngineColor = (engine) => {
  return (
    engineColors[engine] ||
    'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
  );
};
