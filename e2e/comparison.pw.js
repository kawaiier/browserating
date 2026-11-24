import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const measured = '/compare/crest-vs-firefox?platform=macos-arm';

async function audit(page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
}

test('HTTP normalization, invalid routes, metadata and rendered evidence agree', async ({
  request,
}) => {
  const redirect = await request.get('/compare/firefox-vs-crest?junk=1', { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location).toContain('/compare/crest-vs-firefox?order=reverse');
  expect(redirect.headers().location).not.toContain('junk');
  for (const path of ['firefox-vs-firefox', 'unknown-vs-firefox', 'firefox-vs-crest-vs-brave']) {
    expect((await request.get(`/compare/${path}`)).status()).toBe(404);
  }
  const response = await request.get(`${measured}&engine.crest.macos-arm=WebKit`, {
    headers: { 'user-agent': 'Googlebot' },
  });
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain('Crest vs Firefox');
  expect(html).toContain('36.77');
  expect(html).toContain('https://browserating.com/compare/crest-vs-firefox');
  expect(html).toContain('Speedometer 3.1');
});

test('engine, platform, reload, history and swaps preserve the committed view', async ({
  page,
}) => {
  await page.goto(measured);
  const result = page.getByRole('region', { name: 'Selected result for macOS ARM' });
  await expect(result).toContainText('44.88');
  await page.getByLabel('Crest engine').selectOption('WebKit');
  await page.getByRole('button', { name: 'Show engine' }).click();
  await expect(result).toContainText('36.77');
  await page.reload();
  await expect(result).toContainText('36.77');
  await page.getByLabel('Platform', { exact: true }).selectOption('windows');
  await page.getByRole('button', { name: 'Show platform' }).click();
  await expect(page).toHaveURL(/platform=windows/);
  await page.goBack();
  await expect(result).toContainText('36.77');
  await page.goForward();
  await expect(page).toHaveURL(/platform=windows/);
  await page.getByRole('button', { name: 'Swap browsers' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Firefox vs Crest');
  await page.getByRole('button', { name: 'Swap browsers' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Crest vs Firefox');
  await expect(page).toHaveURL(/engine\.crest\.macos-arm=WebKit/);
});

test('keyboard form validation and submission', async ({ page }) => {
  await page.goto(measured);
  const first = page.getByLabel('First browser');
  const second = page.getByLabel('Second browser');
  await second.selectOption('crest');
  await page.getByRole('button', { name: 'Compare browsers', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#compare-error')).toContainText('Choose two different browsers');
  await first.selectOption('firefox');
  await page.getByRole('button', { name: 'Compare browsers', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Firefox vs Crest');
});

test('empty and one-sided pairs remain useful', async ({ page }) => {
  await page.goto('/compare/deta-surf-vs-web');
  await expect(page.getByRole('heading', { name: 'No benchmarks recorded yet' })).toBeVisible();
  await expect(page.getByRole('table')).toHaveCount(0);
  await page.goto('/compare/firefox-beta-vs-floorp');
  await expect(page.getByText(/no shared platform measurements/)).toBeVisible();
});

for (const colorScheme of ['light', 'dark']) {
  for (const [name, path] of [
    ['measured', measured],
    ['empty', '/compare/deta-surf-vs-web'],
  ]) {
    test(`accessibility: ${name}, ${colorScheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(path);
      await audit(page);
    });
  }
  test(`accessibility: invalid input, ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto(measured);
    await page.getByLabel('Second browser').selectOption('crest');
    await page.getByRole('button', { name: 'Compare browsers', exact: true }).click();
    await expect(page.locator('#compare-error')).toBeVisible();
    await audit(page);
  });
}

test('small viewport reflows without page-level horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(measured);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole('region', { name: 'All-platform comparison table' })).toBeVisible();
});

test('comparison hub offers measured examples and all catalog browsers', async ({ page }) => {
  await page.goto('/compare');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Compare browser performance');
  await expect(page.getByLabel('First browser').locator('option[value="deta-surf"]')).toContainText(
    'No benchmarks yet'
  );
  await expect(
    page.getByLabel('First browser').locator('option[value="firefox-beta"]')
  ).toContainText('Firefox Beta');
  await expect(
    page.getByRole('heading', { name: 'Comparisons with shared measurements' })
  ).toBeVisible();
  await page.getByLabel('First browser').selectOption('firefox');
  await page.getByLabel('Second browser').selectOption('google-chrome');
  await page.getByRole('button', { name: 'Compare browsers', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Firefox vs Google Chrome');
});

test('hub validates GET submissions and redirects valid pairs', async ({ request }) => {
  const invalid = await request.get('/compare?a=firefox&b=firefox');
  expect(invalid.status()).toBe(400);
  expect(await invalid.text()).toContain('Choose two different browsers');
  const valid = await request.get('/compare?a=firefox&b=google-chrome', { maxRedirects: 0 });
  expect(valid.status()).toBe(307);
  expect(valid.headers().location).toContain('/compare/firefox-vs-google-chrome');
});
