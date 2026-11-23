import assert from 'node:assert/strict';
import test from 'node:test';

import {
  decorateQuizProfiles,
  getQuizProfileSummaries,
  getQuizProfileSummary,
} from './quizProfileData.js';

const profiles = [
  {
    id: 'brave',
    name: 'Brave',
    traits: { privacy: 9 },
    platforms: ['windows'],
    discontinued: false,
    traitRationales: { privacy: 'Strong tracking protection.' },
    highlights: ['Blocks ads and trackers.'],
    lastVerified: '2026-01-01',
  },
];
const browsers = [
  {
    name: 'Brave',
    logo: '/images/browsers/brave.png',
    website: 'https://brave.com',
  },
];

test('quiz profile summaries keep scoring and intro fields but omit result copy', () => {
  assert.deepEqual(getQuizProfileSummaries(profiles, browsers), [
    {
      id: 'brave',
      name: 'Brave',
      logo: '/images/browsers/brave.png',
      traits: { privacy: 9 },
      platforms: ['windows'],
      discontinued: false,
    },
  ]);
});

test('full quiz profiles gain matching browser links and slugs', () => {
  assert.deepEqual(decorateQuizProfiles(profiles, browsers)[0], {
    ...profiles[0],
    logo: '/images/browsers/brave.png',
    website: 'https://brave.com',
    slug: 'brave',
  });
});

test('a profile with no site-browser match has no logo or outbound link', () => {
  assert.deepEqual(getQuizProfileSummary({ ...profiles[0], logo: null }), {
    id: 'brave',
    name: 'Brave',
    logo: null,
    traits: { privacy: 9 },
    platforms: ['windows'],
    discontinued: false,
  });
});
