import { promises as fs } from 'fs';
import path from 'path';

import { mergeBrowserData } from './mergeBrowserData';

export async function getBrowsersServer() {
  const dataDir = path.join(process.cwd(), 'public', 'data');

  const readFile = async (filename) => {
    const filePath = path.join(dataDir, filename);
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
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
}
