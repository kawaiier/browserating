import { getBrowserSlug } from './getBrowserSlug.js';
import { getComparisonObservation } from './comparisonViewModel.js';
import { platformNames } from './platformDefinitions.js';

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
