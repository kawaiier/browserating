import assert from 'node:assert/strict';
import test from 'node:test';

import { mergeQuizProfileDetails } from './quizProfileDetails.js';

test('quiz results merge details while retaining scores and profiles with missing details', () => {
  const results = {
    topResults: [
      { id: 'brave', name: 'Brave', matchScore: 8, traits: { privacy: 9 } },
      { id: 'unknown', name: 'Unknown', matchScore: 6 },
    ],
  };

  assert.deepEqual(
    mergeQuizProfileDetails(results, [
      {
        id: 'brave',
        name: 'Brave Browser',
        slug: 'brave',
        website: 'https://brave.com',
        highlights: ['Built-in tracking protection.'],
      },
    ]),
    {
      topResults: [
        {
          id: 'brave',
          name: 'Brave',
          matchScore: 8,
          traits: { privacy: 9 },
          slug: 'brave',
          website: 'https://brave.com',
          highlights: ['Built-in tracking protection.'],
        },
        { id: 'unknown', name: 'Unknown', matchScore: 6 },
      ],
      profileDetailsLoaded: true,
    }
  );
});
