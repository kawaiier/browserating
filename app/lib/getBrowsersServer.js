import { promises as fs } from 'fs';
import path from 'path';
import { cache } from 'react';

import { mergeBrowserData } from './mergeBrowserData';

// cache() dedupes reads within one server request (metadata + page + helpers).
// Data ships with each deployment, so there is no cross-request cache to invalidate.
export const getBrowsersServer = cache(async function getBrowsersServer() {
  const dataDir = path.join(process.cwd(), 'public', 'data');

  const readFile = async (filename) => {
    const filePath = path.join(dataDir, filename);
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);
    const isCatalog = filename === 'browsers.json';
    if (
      !Array.isArray(data) ||
      data.length === 0 ||
      data.some(
        (entry) =>
          !entry ||
          typeof entry.name !== 'string' ||
          !entry.name.trim() ||
          (!isCatalog &&
            (typeof entry.engine !== 'string' ||
              !Array.isArray(entry.versions) ||
              entry.versions.some(
                (version) => !version || typeof version !== 'object' || Array.isArray(version)
              )))
      )
    ) {
      throw new Error(`Malformed benchmark dataset: ${filename}`);
    }
    return data;
  };

  const [browsers, androidData, macosIntelData, macosArmData, windowsData, ipadData] =
    await Promise.all([
      readFile('browsers.json'),
      readFile('android.json'),
      readFile('macos-intel.json'),
      readFile('macos-arm.json'),
      readFile('windows.json'),
      readFile('ipad.json'),
    ]);

  return mergeBrowserData(browsers, {
    android: androidData,
    'macos-intel': macosIntelData,
    'macos-arm': macosArmData,
    windows: windowsData,
    ipad: ipadData,
  });
});
