import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const measured = '/compare/crest-vs-firefox?platform=macos-arm';

async function comparisonEvents(page) {
  return page.evaluate(() => JSON.parse(sessionStorage.getItem('comparison-test-events') || '[]'));
}

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

test('comparison analytics record committed actions and distinguish empty coverage', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.va = (...event) => {
      const events = JSON.parse(sessionStorage.getItem('comparison-test-events') || '[]');
      events.push(event);
      sessionStorage.setItem('comparison-test-events', JSON.stringify(events));
    };
  });
  await page.goto('/compare');
  await page.getByLabel('First browser').selectOption('firefox');
  await page.getByLabel('Second browser').selectOption('google-chrome');
  expect((await comparisonEvents(page)).filter((event) => event[0] === 'event')).toHaveLength(0);
  await page.getByRole('button', { name: 'Compare browsers', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Firefox vs Google Chrome');
  await expect
    .poll(
      async () =>
        (await comparisonEvents(page)).filter((event) => event[1]?.name === 'comparison_started')
          .length
    )
    .toBe(1);
  let events = await comparisonEvents(page);
  expect(events.find((event) => event[1]?.name === 'comparison_started')[1].data.source).toBe(
    'hub'
  );
  expect(events.filter((event) => event[1]?.name === 'comparison_applied')).toHaveLength(1);

  await page.goto(measured);
  await page.getByLabel('Crest engine').selectOption('WebKit');
  await page.getByRole('button', { name: 'Show engine' }).click();
  await expect
    .poll(async () =>
      (await comparisonEvents(page)).some((event) => event[1]?.name === 'comparison_engine_changed')
    )
    .toBe(true);
  await page.getByLabel('Platform', { exact: true }).selectOption('windows');
  await page.getByRole('button', { name: 'Show platform' }).click();
  await expect
    .poll(async () =>
      (await comparisonEvents(page)).some(
        (event) => event[1]?.name === 'comparison_platform_changed'
      )
    )
    .toBe(true);
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });
  await page.getByRole('button', { name: 'Copy link' }).click();
  await expect
    .poll(async () =>
      (await comparisonEvents(page)).some(
        (event) =>
          event[1]?.name === 'comparison_share_succeeded' && event[1].data.channel === 'copy'
      )
    )
    .toBe(true);

  await page.goto('/compare/firefox-beta-vs-floorp');
  await expect(page.getByText(/no shared platform measurements/)).toBeVisible();
  await expect
    .poll(async () =>
      (await comparisonEvents(page)).some((event) => event[1]?.name === 'comparison_no_shared_data')
    )
    .toBe(true);
  await page.goto('/compare/meteor-vs-web');
  await expect(page.getByRole('heading', { name: 'No benchmarks recorded yet' })).toBeVisible();
  events = await comparisonEvents(page);
  expect(events.some((event) => event[1]?.name === 'comparison_load_failed')).toBe(false);
  expect(
    events.some(
      (event) =>
        event[1]?.name === 'comparison_no_shared_data' &&
        event[1].data.browser_a === 'meteor' &&
        event[1].data.browser_b === 'web'
    )
  ).toBe(false);
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
  await page.goto('/compare/meteor-vs-web');
  await expect(page.getByRole('heading', { name: 'No benchmarks recorded yet' })).toBeVisible();
  await expect(page.getByRole('table')).toHaveCount(0);
  await page.goto('/compare/deta-surf-vs-web');
  await expect(page.getByText(/no shared platform measurements/)).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
  await page.goto('/compare/firefox-beta-vs-floorp');
  await expect(page.getByText(/no shared platform measurements/)).toBeVisible();
});

for (const colorScheme of ['light', 'dark']) {
  for (const [name, path] of [
    ['measured', measured],
    ['empty', '/compare/meteor-vs-web'],
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
    '1 measured platform'
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

// Holds the comparison's RSC response so the streamed loading boundary stays on screen.
for (const colorScheme of ['light', 'dark']) {
  test(`loading state is a named status without fake data, ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    let release;
    const held = new Promise((resolve) => (release = resolve));
    await page.route(/\/compare\/[^/?]+-vs-[^/?]+/, async (route) => {
      const headers = route.request().headers();
      if (headers.rsc && !headers['next-router-prefetch']) await held;
      await route.continue();
    });
    await page.goto('/compare');
    // A click before hydration is a full document load, which never shows the boundary.
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: / vs / }).first().click();
    const status = page.getByRole('status').filter({ hasText: 'Loading comparison' });
    await expect(status).toBeVisible();
    await expect(status.locator('[aria-hidden="true"]')).toHaveCount(1);
    expect((await status.innerText()).trim()).toBe('Loading comparison');
    await audit(page);
    release();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(' vs ');
    await expect(status).toHaveCount(0);
  });
}

test('pair social card only for indexable pairs', async ({ request }) => {
  const indexable = await (await request.get('/compare/crest-vs-firefox')).text();
  expect(indexable).toContain('/api/og/compare?pair=crest-vs-firefox');
  expect(indexable).toContain('summary_large_image');
  const poor = await (await request.get('/compare/firefox-beta-vs-floorp')).text();
  expect(poor).not.toContain('/api/og/compare');
  expect(poor).toContain('noindex');
  for (const pair of ['crest-vs-firefox', 'firefox-beta-vs-floorp', 'nope']) {
    const image = await request.get(`/api/og/compare?pair=${pair}`);
    expect(image.status()).toBe(200);
    expect(image.headers()['content-type']).toBe('image/png');
  }
  expect(indexable).not.toContain('"@type":"Dataset"');
  expect(await (await request.get('/')).text()).toContain('"@type":"Dataset"');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('results, controls and the chooser still work', async ({ page }) => {
    await page.goto(measured);
    await expect(page.getByRole('region', { name: 'Selected result for macOS ARM' })).toContainText(
      '44.88'
    );
    await page.getByLabel('Crest engine').selectOption('WebKit');
    await page.getByRole('button', { name: 'Show engine' }).click();
    await expect(page.getByRole('region', { name: 'Selected result for macOS ARM' })).toContainText(
      '36.77'
    );
    await page.goto('/compare');
    await page.getByLabel('First browser').selectOption('firefox');
    await page.getByLabel('Second browser').selectOption('google-chrome');
    await page.getByRole('button', { name: 'Compare browsers', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Firefox vs Google Chrome');
  });
});

test('ranking selection carries its platform and engine through the detail chooser', async ({
  page,
}) => {
  await page.goto('/');
  const crest = page.getByRole('button', { name: 'Crest', exact: true });
  await crest.getByRole('button', { name: 'WebKit' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('link', { name: 'Compare Crest' }).click();
  await expect(page).toHaveURL(/platform=macos-arm.*engine=WebKit/);
  await page.getByLabel('Second browser').selectOption('firefox');
  await page.getByRole('button', { name: 'Compare browsers', exact: true }).click();
  await expect(page).toHaveURL(/engine\.crest\.macos-arm=WebKit/);
  await expect(page.getByRole('region', { name: 'Selected result for macOS ARM' })).toContainText(
    '36.77'
  );
});

test('share uses the committed view, handles failures, and prints evidence', async ({ page }) => {
  await page.goto(`${measured}&engine.crest.macos-arm=WebKit`);
  await page.getByLabel('Second browser').selectOption('google-chrome');
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.copiedComparison = text;
        },
      },
    });
  });
  await page.getByRole('button', { name: 'Copy link' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Comparison link copied' })
  ).toBeVisible();
  const copied = await page.evaluate(() => window.copiedComparison);
  expect(copied).toContain('crest-vs-firefox');
  expect(copied).toContain('platform=macos-arm');
  expect(copied).toContain('engine.crest.macos-arm=WebKit');
  expect(copied).not.toContain('google-chrome');
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('denied');
        },
      },
    });
  });
  await page.getByRole('button', { name: 'Copy link' }).click();
  await expect(page.getByLabel('Comparison URL')).toHaveValue(copied);
  await expect(page.getByRole('status').filter({ hasText: 'Could not copy' })).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  const print = page.locator('.comparison-print-result');
  await expect(print).toBeVisible();
  for (const evidence of [
    'Crest vs Firefox',
    'Speedometer 3.1',
    'macOS ARM',
    '36.77',
    'WebKit',
    'Version:',
    'Test date:',
    'Limitations:',
  ]) {
    await expect(print).toContainText(evidence);
  }
  await expect(page.locator('.comparison-print-meta')).toContainText('Source URL:');
  await expect(page.locator('.comparison-print-meta')).toContainText('Print date:');
  await expect(page.locator('.comparison-share')).toBeHidden();
  await expect(page.locator('.comparison-shell > header')).toBeHidden();
});
