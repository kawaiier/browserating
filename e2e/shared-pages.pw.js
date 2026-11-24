import { test, expect } from '@playwright/test';

// Regression checks for pages that share the header and theme with comparisons.
const pages = [
  ['home', '/'],
  ['browser detail', '/browsers/firefox'],
  ['platform ranking', '/platforms/macos-arm'],
  ['quiz', '/quiz'],
];

for (const [name, path] of pages) {
  test(`${name} page keeps one heading, site header and theme toggle`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    const response = await page.goto(path);
    expect(response.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'BrowseRating Home' }).first()).toBeVisible();

    const html = page.locator('html');
    await expect(html).not.toHaveClass(/\bdark\b/);
    await page.getByRole('button', { name: 'Switch to dark mode' }).first().click();
    await expect(html).toHaveClass(/\bdark\b/);
    await page.getByRole('button', { name: 'Switch to light mode' }).first().click();
    await expect(html).not.toHaveClass(/\bdark\b/);
  });
}

test('platform ranking keeps its descriptive platform title', async ({ page }) => {
  await page.goto('/platforms/macos-arm');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('macOS (Apple Silicon)');
});
