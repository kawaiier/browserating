import { getBrowsersServer } from './getBrowsersServer';

export async function getBrowsersByPlatform(platform) {
  const browsers = await getBrowsersServer();

  const validPlatforms = ['macos-arm', 'macos-intel', 'windows', 'android', 'ipad'];

  if (!validPlatforms.includes(platform)) {
    return null;
  }

  const filtered = browsers.filter(
    (b) => b[platform] && b[platform].versions && b[platform].versions.length > 0
  );

  return filtered.sort((a, b) => {
    const aScore = a[platform].versions[0]?.scores?.speedometer3 || 0;
    const bScore = b[platform].versions[0]?.scores?.speedometer3 || 0;
    return bScore - aScore;
  });
}

export function getPlatformLabel(platform) {
  const labels = {
    'macos-arm': 'macOS (Apple Silicon)',
    'macos-intel': 'macOS (Intel)',
    windows: 'Windows',
    android: 'Android',
    ipad: 'iPad',
  };
  return labels[platform] || platform;
}
