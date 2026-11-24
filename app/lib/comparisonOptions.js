import { getBrowserSlug } from './getBrowserSlug.js';
import { getComparisonObservation } from './comparisonViewModel.js';
import { platformNames } from './platformDefinitions.js';

// Chooser coverage follows the selected engine (or each browser's primary engine).
export function comparisonOptions(catalog, engines = {}) {
  return catalog
    .map((browser) => {
      const slug = getBrowserSlug(browser.name);
      return {
        slug,
        name: browser.name,
        platforms: Object.keys(platformNames).filter(
          (id) => getComparisonObservation(browser, id, engines[slug]?.[id]).state === 'available'
        ),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Browsers that share at least one measured platform with `slug`, most shared platforms
 * first. Both browsers of the current pair are excluded. `options` comes from
 * comparisonOptions, so coverage reflects the selected engines.
 */
export function suggestPartners(options, slug, exclude = [], limit = 4) {
  const self = options.find((option) => option.slug === slug);
  if (!self || self.platforms.length === 0) return [];
  const skip = new Set([slug, ...exclude]);
  return options
    .filter((option) => !skip.has(option.slug))
    .map((option) => ({
      slug: option.slug,
      name: option.name,
      shared: option.platforms.filter((id) => self.platforms.includes(id)).length,
    }))
    .filter((option) => option.shared > 0)
    .sort((a, b) => b.shared - a.shared || a.name.localeCompare(b.name))
    .slice(0, limit);
}
