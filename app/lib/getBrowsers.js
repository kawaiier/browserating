export async function getBrowsers() {
  const [browsersResponse, androidResponse, macosResponse, windowsResponse] =
    await Promise.all([
      fetch("/data/browsers.json"),
      fetch("/data/android.json"),
      fetch("/data/macos.json"),
      fetch("/data/windows.json"),
    ]);

  if (
    !browsersResponse.ok ||
    !androidResponse.ok ||
    !macosResponse.ok ||
    !windowsResponse.ok
  ) {
    throw new Error("Failed to fetch browser data");
  }

  const [browsers, androidData, macosData, windowsData] = await Promise.all([
    browsersResponse.json(),
    androidResponse.json(),
    macosResponse.json(),
    windowsResponse.json(),
  ]);

  // Merge the data from all sources
  return browsers.map((browser) => {
    const androidBrowser = androidData.find((b) => b.name === browser.name);
    const macosBrowser = macosData.find((b) => b.name === browser.name);
    const windowsBrowser = windowsData.find((b) => b.name === browser.name);

    return {
      ...browser,
      android: androidBrowser ? androidBrowser.versions : [],
      macos: macosBrowser ? macosBrowser.versions : [],
      windows: windowsBrowser ? windowsBrowser.versions : [],
      engine:
        androidBrowser?.engine ||
        macosBrowser?.engine ||
        windowsBrowser?.engine ||
        "Unknown",
    };
  });
}
