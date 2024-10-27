export async function getBrowsers() {
  const [browsersResponse, androidResponse, macosIntelResponse, macosArmResponse, windowsResponse] =
    await Promise.all([
      fetch("/data/browsers.json"),
      fetch("/data/android.json"),
      fetch("/data/macos-intel.json"),
      fetch("/data/macos-arm.json"),
      fetch("/data/windows.json"),
    ]);

  if (
    !browsersResponse.ok ||
    !androidResponse.ok ||
    !macosIntelResponse.ok ||
    !macosArmResponse.ok ||
    !windowsResponse.ok
  ) {
    throw new Error("Failed to fetch browser data");
  }

  const [browsers, androidData, macosIntelData, macosArmData, windowsData] = await Promise.all([
    browsersResponse.json(),
    androidResponse.json(),
    macosIntelResponse.json(),
    macosArmResponse.json(),
    windowsResponse.json(),
  ]);

  // Merge the data from all sources
  return browsers.map((browser) => {
    const androidBrowser = androidData.find((b) => b.name === browser.name);
    const macosIntelBrowser = macosIntelData.find((b) => b.name === browser.name);
    const macosArmBrowser = macosArmData.find((b) => b.name === browser.name); 
    const windowsBrowser = windowsData.find((b) => b.name === browser.name);

    return {
      ...browser,
      android: androidBrowser ? androidBrowser.versions : [],
      macos: [
        ...(macosIntelBrowser ? macosIntelBrowser.versions : []), 
        ...(macosArmBrowser ? macosArmBrowser.versions : [])
      ],
      windows: windowsBrowser ? windowsBrowser.versions : [],
      engine:
        androidBrowser?.engine ||
        macosIntelBrowser?.engine ||
        macosArmBrowser?.engine ||
        windowsBrowser?.engine ||
        "Unknown",
    };
  });
}
