/**
 * Merges base browser metadata with platform-specific benchmark data.
 * Shared between client-side (getBrowsers.js) and server-side (getBrowsersServer.js) fetchers.
 *
 * @param {Array} browsers - Base browser objects from browsers.json
 * @param {Object} platformDataMap - Map of platform key to array of platform-specific browser data
 * @returns {Array} Merged browser objects with platform data attached
 */
export function mergeBrowserData(browsers, platformDataMap) {
  return browsers.map((browser) => {
    const merged = { ...browser };

    for (const [platform, data] of Object.entries(platformDataMap)) {
      const matches = data.filter((b) => b.name === browser.name);
      const engineVariants = matches.map((match) => ({
        engine: match.engine,
        versions: match.versions,
      }));
      const primary = engineVariants[0];

      merged[platform] = primary
        ? {
            versions: primary.versions,
            engine: primary.engine,
            engineVariants,
          }
        : null;
    }

    return merged;
  });
}
