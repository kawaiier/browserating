import assert from 'node:assert/strict';
import test from 'node:test';

import { GET } from './route.js';

test('profile endpoint returns full data for at most three requested profiles', async () => {
  const request = new Request(
    'http://localhost/api/quiz/profiles?id=brave&id=chrome&id=firefox&id=safari'
  );
  const response = await GET(request);
  const profiles = await response.json();

  assert.equal(profiles.length, 3);
  assert.deepEqual(profiles.map((profile) => profile.id).sort(), ['brave', 'chrome', 'firefox']);
  assert.ok(profiles.every((profile) => profile.traitRationales && profile.highlights));
  assert.ok(profiles.every((profile) => profile.slug && profile.website));
});

test('profile endpoint ignores unknown ids', async () => {
  const response = await GET(new Request('http://localhost/api/quiz/profiles?id=not-a-browser'));

  assert.deepEqual(await response.json(), []);
});
