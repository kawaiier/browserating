export const benchmarkSources = ['curated', 'community'];

// Unmarked historical records are from the repository's curated benchmark dataset.
export function getObservationSourceLabel(record) {
  if (record?.source === 'community') {
    return `Community-reported${record.cohortId ? ` · cohort ${record.cohortId}` : ''}`;
  }
  return 'Curated benchmark dataset';
}
