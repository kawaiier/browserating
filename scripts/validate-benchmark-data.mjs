import { readFile } from 'node:fs/promises';

import { comparisonOptions } from '../app/lib/comparisonOptions.js';
import { indexableComparisonSlugs } from '../app/lib/comparisonIndex.js';
import { mergeBrowserData } from '../app/lib/mergeBrowserData.js';
import { platformNames } from '../app/lib/platformDefinitions.js';
import { validateBenchmarkData } from '../app/lib/validateBenchmarkData.js';

const dataDirectory = new URL('../public/data/', import.meta.url);
const readData = async (filename) =>
  JSON.parse(await readFile(new URL(filename, dataDirectory), 'utf8'));

const [catalog, platformEntries] = await Promise.all([
  readData('browsers.json'),
  Promise.all(
    Object.keys(platformNames).map(async (platform) => [
      platform,
      await readData(`${platform}.json`),
    ])
  ),
]);
const platformData = Object.fromEntries(platformEntries);
const { errors, warnings, versionRecords } = validateBenchmarkData(catalog, platformData);

if (warnings.length) {
  console.warn(`Benchmark data warnings (${warnings.length}):`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}
console.log(
  `Historical provenance report: ${versionRecords} version records have stable observation IDs; source/cohort labels do not establish matching setup, and benchmark revision, hardware/setup, and method references remain undocumented.`
);

if (errors.length) {
  console.error(`Benchmark data validation failed (${errors.length} errors):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const platformRecordCount = Object.values(platformData).reduce(
    (count, records) => count + records.length,
    0
  );
  const browsers = mergeBrowserData(catalog, platformData);
  const candidates = indexableComparisonSlugs(browsers);
  const coveredBrowsers = comparisonOptions(browsers).filter(
    (option) => option.platforms.length > 0
  );
  console.log(
    `Benchmark data valid: ${catalog.length} catalog browsers, ${platformRecordCount} platform records, ${versionRecords} version records.`
  );
  console.log(
    `Shared-coverage release report: ${coveredBrowsers.length} browsers with a valid primary-engine measurement; ${candidates.length} canonical indexable pairs. First-listed engine records remain primary.`
  );
}
