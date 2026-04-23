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
    'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 border border-blue-500/30 dark:border-blue-500/40',
  Gecko:
    'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/20 dark:hover:bg-green-500/30 border border-green-500/30 dark:border-green-500/40',
  WebKit:
    'bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 dark:hover:bg-orange-500/30 border border-orange-500/30 dark:border-orange-500/40',
  All: 'bg-gray-500/10 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20 dark:hover:bg-gray-500/30 border border-gray-500/30 dark:border-gray-500/40',
};

export const getEngineColor = (engine) => {
  return (
    engineColors[engine] ||
    'bg-gray-500/10 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20 dark:hover:bg-gray-500/30 border border-gray-500/30 dark:border-gray-500/40'
  );
};
