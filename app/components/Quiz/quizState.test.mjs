import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createEmptyAnswers,
  createQuizFlowState,
  parseQuizAnswers,
  parseQuizUrlState,
  serializeQuizAnswers,
  quizFlowReducer,
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

test('quiz URL steps map to discriminated intro, question, and results phases', () => {
  const answers = [null, 'q1a', null];

  assert.deepEqual(createQuizFlowState(0, questions, answers), { phase: 'intro' });
  assert.deepEqual(createQuizFlowState(2, questions, answers), {
    phase: 'question',
    index: 1,
    direction: 'forward',
    reviewing: true,
  });
  assert.deepEqual(createQuizFlowState(questions.length + 1, questions, answers), {
    phase: 'results',
  });
});

test('quiz flow reducer transitions through question, computing, and results phases', () => {
  const firstQuestion = quizFlowReducer({ phase: 'intro' }, { type: 'start' });
  assert.deepEqual(firstQuestion, {
    phase: 'question',
    index: 0,
    direction: 'forward',
    reviewing: false,
  });

  const reviewedQuestion = quizFlowReducer(firstQuestion, {
    type: 'question',
    index: 1,
    direction: 'back',
    reviewing: true,
  });
  assert.deepEqual(reviewedQuestion, {
    phase: 'question',
    index: 1,
    direction: 'back',
    reviewing: true,
  });
  assert.deepEqual(quizFlowReducer(reviewedQuestion, { type: 'computing' }), {
    phase: 'computing',
  });
  assert.deepEqual(quizFlowReducer({ phase: 'computing' }, { type: 'results' }), {
    phase: 'results',
  });
});

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

test('static shared-result routes use the path ID when the query has no r value', () => {
  const answers = [['windows'], 'q1b', 'q2a'];
  const state = parseQuizUrlState(
    new URLSearchParams({ a: serializeQuizAnswers(answers) }),
    questions,
    'brave'
  );

  assert.equal(state.sharedResultId, 'brave');
  assert.equal(state.step, questions.length + 1);
  assert.equal(state.hasSharedAnswers, true);
  assert.deepEqual(state.answers, answers);
});

test('shared results fall back to the path browser for incomplete or invalid answers', () => {
  const invalidAnswers = [
    '[]',
    JSON.stringify([['windows'], 'q1b', null]),
    JSON.stringify([[], 'q1b', 'q2a']),
    JSON.stringify([['windows', 'unknown'], 'q1b', 'q2a']),
  ];

  for (const encodedAnswers of invalidAnswers) {
    const state = parseQuizUrlState(
      new URLSearchParams({ a: encodedAnswers }),
      questions,
      'brave'
    );
    assert.equal(state.sharedResultId, 'brave');
    assert.equal(state.hasSharedAnswers, false);
    assert.deepEqual(state.answers, createEmptyAnswers(questions));
  }
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
