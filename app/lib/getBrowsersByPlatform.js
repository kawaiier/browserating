import { getBrowsersServer } from './getBrowsersServer';
import { platformNames, platformTitles } from './platformDefinitions';

export async function getBrowsersByPlatform(platform) {
  const browsers = await getBrowsersServer();

  if (!Object.hasOwn(platformNames, platform)) {
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
  return platformTitles[platform] || platform;
}
