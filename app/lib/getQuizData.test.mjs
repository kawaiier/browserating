import assert from 'node:assert/strict';
import test from 'node:test';

import { getQuizData } from './getQuizData.js';

test('server quiz loader reads questions, profiles, and browser records', async () => {
  const { questions, profiles, browsers } = await getQuizData();

  assert.ok(questions.length > 0);
  assert.ok(profiles.length > 0);
  assert.ok(browsers.some((browser) => browser.name === profiles[0].name));
});
