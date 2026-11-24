import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

// Runs against a second server whose BENCHMARK_DATA_DIR is a disposable copy (see config).
const dataFile = path.join(process.cwd(), 'e2e', '.failure-data', 'macos-arm.json');

test.describe.configure({ mode: 'serial' });

// Click Try again once the page is idle and wait for the segment refetch it triggers.
async function retry(page) {
  await page.waitForLoadState('networkidle');
  const refetch = page.waitForResponse((r) => r.request().headers().rsc === '1');
  await page.getByRole('button', { name: 'Try again' }).click();
  await refetch;
}

test('a broken dataset shows an operational error, and retry recovers', async ({ page }) => {
  const original = await fs.readFile(dataFile, 'utf8');
  try {
    await fs.writeFile(dataFile, '{ not json');
    await page.goto('/compare/crest-vs-firefox?platform=macos-arm');
    await expect(page.getByRole('heading', { name: 'Comparison unavailable' })).toBeVisible();
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/not found|does not exist|SyntaxError|\.json|\/Users\/|node_modules/i);
    await expect(page).toHaveURL(/crest-vs-firefox\?platform=macos-arm/);

    await fs.writeFile(dataFile, JSON.stringify([{ name: 'Broken' }]));
    await retry(page);
    await expect(page.getByRole('heading', { name: 'Comparison unavailable' })).toBeVisible();
  } finally {
    await fs.writeFile(dataFile, original);
  }
  await retry(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Crest vs Firefox');
  await expect(page.getByRole('region', { name: 'Selected result for macOS ARM' })).toContainText(
    '44.88'
  );
});
