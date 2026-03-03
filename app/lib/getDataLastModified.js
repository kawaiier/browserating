import { promises as fs } from 'fs';
import path from 'path';

export async function getDataLastModified() {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  const dataFiles = [
    'macos-arm.json',
    'macos-intel.json',
    'windows.json',
    'android.json',
    'ipad.json',
    'browsers.json',
  ];

  const mtimes = await Promise.all(
    dataFiles.map(async (file) => {
      const stat = await fs.stat(path.join(dataDir, file));
      return stat.mtimeMs;
    })
  );

  const latestMs = Math.max(...mtimes);
  return new Date(latestMs).toISOString().split('T')[0];
}
