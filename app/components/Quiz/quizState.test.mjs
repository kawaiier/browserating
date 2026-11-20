import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createEmptyAnswers,
  parseQuizAnswers,
  parseQuizUrlState,
  serializeQuizAnswers,
  SKIP_ANSWER,
} from './quizState.js';

const questions = [
  {
    selectionMode: 'multiple',
    options: [{ id: 'windows' }, { id: 'mac' }],
  },
  {
    options: [{ id: 'q1a' }, { id: 'q1b' }],
  },
  {
    options: [{ id: 'q2a' }, { id: 'q2b' }],
  },
];

test('quiz answers serialize and restore multi-select choices and skipped questions', () => {
  const answers = [['windows', 'mac'], 'q1b', SKIP_ANSWER];

  assert.deepEqual(parseQuizAnswers(serializeQuizAnswers(answers), questions), answers);
});

test('quiz URL state restores the step and positional answers', () => {
  const answers = [['windows'], 'q1a', null];
  const searchParams = new URLSearchParams({
    step: '3',
    a: serializeQuizAnswers(answers),
  });

  assert.deepEqual(parseQuizUrlState(searchParams, questions), {
    sharedResultId: null,
    step: 3,
    answers,
    hasSharedAnswers: false,
    hasQuizState: true,
  });
});

test('shared result URLs can carry validated answers', () => {
  const answers = [['mac'], 'q1b', SKIP_ANSWER];
  const state = parseQuizUrlState(
    new URLSearchParams({ r: 'Brave', a: serializeQuizAnswers(answers) }),
    questions
  );

  assert.equal(state.sharedResultId, 'Brave');
  assert.equal(state.step, questions.length + 1);
  assert.equal(state.hasSharedAnswers, true);
  assert.deepEqual(state.answers, answers);
});

test('invalid answer IDs are discarded and malformed answer data is ignored', () => {
  assert.deepEqual(parseQuizAnswers(JSON.stringify([['windows', 'unknown'], 'bad']), questions), [
    ['windows'],
    null,
    null,
  ]);
  assert.equal(parseQuizAnswers('{', questions), null);
  assert.deepEqual(createEmptyAnswers(questions), [null, null, null]);
});
