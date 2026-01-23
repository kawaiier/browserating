import { promises as fs } from "fs";
import path from "path";

export async function getBrowsers() {
  const isServer = typeof window === "undefined";

  let browsers,
    androidData,
    macosIntelData,
    macosArmData,
    windowsData,
    ipadData;

  if (isServer) {
    const dataDir = path.join(process.cwd(), "public", "data");
    const readFile = async (filename) => {
      const filePath = path.join(dataDir, filename);
      const content = await fs.readFile(filePath, "utf8");
      return JSON.parse(content);
    };

    [
      browsers,
      androidData,
      macosIntelData,
      macosArmData,
      windowsData,
      ipadData,
    ] = await Promise.all([
      readFile("browsers.json"),
      readFile("android.json"),
      readFile("macos-intel.json"),
      readFile("macos-arm.json"),
      readFile("windows.json"),
      readFile("ipad.json"),
    ]);
  } else {
    const [
      browsersResponse,
      androidResponse,
      macosIntelResponse,
      macosArmResponse,
      windowsResponse,
      ipadResponse,
    ] = await Promise.all([
      fetch("/data/browsers.json"),
      fetch("/data/android.json"),
      fetch("/data/macos-intel.json"),
      fetch("/data/macos-arm.json"),
      fetch("/data/windows.json"),
      fetch("/data/ipad.json"),
    ]);

    if (
      !browsersResponse.ok ||
      !androidResponse.ok ||
      !macosIntelResponse.ok ||
      !macosArmResponse.ok ||
      !windowsResponse.ok ||
      !ipadResponse.ok
    ) {
      throw new Error("Failed to fetch browser data");
    }

    [
      browsers,
      androidData,
      macosIntelData,
      macosArmData,
      windowsData,
      ipadData,
    ] = await Promise.all([
      browsersResponse.json(),
      androidResponse.json(),
      macosIntelResponse.json(),
      macosArmResponse.json(),
      windowsResponse.json(),
      ipadResponse.json(),
    ]);
  }

  // Merge the data from all sources
  return browsers.map((browser) => {
    const androidBrowser = androidData.find((b) => b.name === browser.name);
    const macosIntelBrowser = macosIntelData.find(
      (b) => b.name === browser.name
    );
    const macosArmBrowser = macosArmData.find((b) => b.name === browser.name);
    const windowsBrowser = windowsData.find((b) => b.name === browser.name);
    const ipadBrowser = ipadData.find((b) => b.name === browser.name);

    return {
      ...browser,
      android: androidBrowser
        ? { versions: androidBrowser.versions, engine: androidBrowser.engine }
        : null,
      "macos-intel": macosIntelBrowser
        ? {
            versions: macosIntelBrowser.versions,
            engine: macosIntelBrowser.engine,
          }
        : null,
      "macos-arm": macosArmBrowser
        ? { versions: macosArmBrowser.versions, engine: macosArmBrowser.engine }
        : null,
      windows: windowsBrowser
        ? { versions: windowsBrowser.versions, engine: windowsBrowser.engine }
        : null,
      ipad: ipadBrowser
        ? { versions: ipadBrowser.versions, engine: ipadBrowser.engine }
        : null,
    };
  });
}
