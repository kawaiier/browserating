import { getBrowserSlug } from './getBrowserSlug.js';
import { platformNames } from './platformDefinitions.js';

const optionalMetrics = {
  speedometer3: (value) => value > 0,
  ram: (value) => value > 0,
  adblock: (value) => value >= 0 && value <= 100,
};

function isCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
}

export function validateBenchmarkData(catalog, platformData) {
  const errors = [];
  const warnings = [];
  let versionRecords = 0;
  const observationIds = new Set();
  const error = (path, message) => errors.push(`${path}: ${message}`);
  const warning = (path, message) => warnings.push(`${path}: ${message}`);

  if (!Array.isArray(catalog) || catalog.length === 0) {
    error('catalog', 'expected a non-empty array');
    catalog = [];
  }
  if (!platformData || typeof platformData !== 'object' || Array.isArray(platformData)) {
    error('platforms', 'expected an object keyed by supported platform');
    platformData = {};
  }

  const names = new Set();
  const slugs = new Map();
  catalog.forEach((browser, index) => {
    const path = `catalog[${index}]`;
    if (!browser || typeof browser !== 'object' || Array.isArray(browser)) {
      error(path, 'expected a browser object');
      return;
    }
    if (typeof browser.name !== 'string' || !browser.name.trim()) {
      error(`${path}.name`, 'expected a non-empty string');
      return;
    }
    if (names.has(browser.name)) error(`${path}.name`, `duplicate catalog name "${browser.name}"`);
    names.add(browser.name);

    const slug = getBrowserSlug(browser.name);
    if (!slug || slug.includes('-vs-')) {
      error(`${path}.name`, `does not produce a valid browser slug ("${slug}")`);
    } else if (slugs.has(slug)) {
      error(`${path}.name`, `slug "${slug}" collides with catalog name "${slugs.get(slug)}"`);
    } else {
      slugs.set(slug, browser.name);
    }
  });

  const supportedPlatforms = new Set(Object.keys(platformNames));
  for (const platform of Object.keys(platformData)) {
    if (!supportedPlatforms.has(platform))
      error(`platforms.${platform}`, 'unsupported platform key');
  }

  for (const platform of supportedPlatforms) {
    const records = platformData[platform];
    if (!Array.isArray(records) || records.length === 0) {
      error(`platforms.${platform}`, 'expected a non-empty array');
      continue;
    }

    const engineRecords = new Set();
    records.forEach((record, recordIndex) => {
      const path = `platforms.${platform}[${recordIndex}]`;
      if (!record || typeof record !== 'object' || Array.isArray(record)) {
        error(path, 'expected a browser/platform record object');
        return;
      }

      if (typeof record.name !== 'string' || !record.name.trim()) {
        error(`${path}.name`, 'expected a non-empty string');
      } else if (!names.has(record.name)) {
        error(`${path}.name`, `"${record.name}" does not match a catalog browser`);
      }
      if (typeof record.engine !== 'string' || !record.engine.trim()) {
        error(`${path}.engine`, 'expected a non-empty string');
      } else if (typeof record.name === 'string') {
        const key = JSON.stringify([record.name, record.engine]);
        if (engineRecords.has(key)) {
          error(
            path,
            `duplicate browser/platform/engine record for "${record.name}" / "${record.engine}"`
          );
        }
        engineRecords.add(key);
      }

      if (!Array.isArray(record.versions) || record.versions.length === 0) {
        error(`${path}.versions`, 'expected a non-empty array');
        return;
      }

      const datedVersions = [];
      record.versions.forEach((version, versionIndex) => {
        versionRecords += 1;
        const versionPath = `${path}.versions[${versionIndex}]`;
        if (!version || typeof version !== 'object' || Array.isArray(version)) {
          error(versionPath, 'expected a version record object');
          return;
        }
        if (typeof version.version !== 'string' || !version.version.trim()) {
          error(`${versionPath}.version`, 'expected a non-empty version string');
        }
        if (typeof version.observationId !== 'string' || !version.observationId.trim()) {
          error(`${versionPath}.observationId`, 'expected a stable non-empty observation ID');
        } else if (observationIds.has(version.observationId)) {
          error(
            `${versionPath}.observationId`,
            `duplicate observation ID "${version.observationId}"`
          );
        } else {
          observationIds.add(version.observationId);
        }
        if (
          !version.scores ||
          typeof version.scores !== 'object' ||
          Array.isArray(version.scores)
        ) {
          error(`${versionPath}.scores`, 'expected a scores object');
        } else {
          for (const [metric, isValid] of Object.entries(optionalMetrics)) {
            const value = version.scores[metric];
            if (value == null) continue;
            if (typeof value !== 'number' || !Number.isFinite(value) || !isValid(value)) {
              const rule =
                metric === 'adblock' ? 'a finite number from 0 to 100' : 'a finite positive number';
              error(`${versionPath}.scores.${metric}`, `expected ${rule} or null/absent`);
            }
          }
        }

        if (version.date == null) {
          warning(
            `${versionPath}.date`,
            'date is unknown; newest-first ordering cannot include this record'
          );
        } else if (!isCalendarDate(version.date)) {
          error(`${versionPath}.date`, 'expected a valid YYYY-MM-DD calendar date');
        } else {
          datedVersions.push({ index: versionIndex, date: version.date });
        }
      });

      for (let index = 1; index < datedVersions.length; index += 1) {
        const previous = datedVersions[index - 1];
        const current = datedVersions[index];
        if (previous.date === current.date) {
          warning(
            `${path}.versions[${current.index}].date`,
            `same date as version at index ${previous.index}; their order is ambiguous`
          );
        } else if (previous.date < current.date) {
          error(
            `${path}.versions[${current.index}].date`,
            `not newest-first; ${current.date} follows newer date ${previous.date}`
          );
        }
      }
    });
  }

  for (const platform of supportedPlatforms) {
    if (!Object.hasOwn(platformData, platform)) {
      error(`platforms.${platform}`, 'missing supported platform dataset');
    }
  }

  return { errors, warnings, versionRecords };
}
