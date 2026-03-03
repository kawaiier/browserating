import { mergeBrowserData } from './mergeBrowserData';

export async function getBrowsers() {
  const [browsers, androidData, macosIntelData, macosArmData, windowsData, ipadData] =
    await Promise.all([
      fetch('/data/browsers.json').then((r) => {
        if (!r.ok) throw new Error('Failed to fetch browsers.json');
        return r.json();
      }),
      fetch('/data/android.json').then((r) => {
        if (!r.ok) throw new Error('Failed to fetch android.json');
        return r.json();
      }),
      fetch('/data/macos-intel.json').then((r) => {
        if (!r.ok) throw new Error('Failed to fetch macos-intel.json');
        return r.json();
      }),
      fetch('/data/macos-arm.json').then((r) => {
        if (!r.ok) throw new Error('Failed to fetch macos-arm.json');
        return r.json();
      }),
      fetch('/data/windows.json').then((r) => {
        if (!r.ok) throw new Error('Failed to fetch windows.json');
        return r.json();
      }),
      fetch('/data/ipad.json').then((r) => {
        if (!r.ok) throw new Error('Failed to fetch ipad.json');
        return r.json();
      }),
    ]);

  return mergeBrowserData(browsers, {
    android: androidData,
    'macos-intel': macosIntelData,
    'macos-arm': macosArmData,
    windows: windowsData,
    ipad: ipadData,
  });
}
