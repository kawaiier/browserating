import assert from 'node:assert/strict';
import test from 'node:test';

import { createQuizShareUrl, copyTextToClipboard } from './quizShare.js';

test('share URLs use the current origin and preserve shared answers', () => {
  const answers = [['windows', 'android'], 'q1b'];
  const url = new URL(createQuizShareUrl('brave', answers, 'https://preview.example'));

  assert.equal(url.origin, 'https://preview.example');
  assert.equal(url.pathname, '/quiz');
  assert.equal(url.searchParams.get('r'), 'brave');
  assert.deepEqual(JSON.parse(url.searchParams.get('a')), answers);
});

test('copy uses the Clipboard API when it succeeds', async () => {
  let copiedText;

  await copyTextToClipboard('https://example.test', {
    clipboard: {
      writeText: async (text) => {
        copiedText = text;
      },
    },
  });

  assert.equal(copiedText, 'https://example.test');
});

function makeFallbackDocument(copyResult) {
  let appended = false;
  let removed = false;
  const textarea = {
    style: {},
    setAttribute() {},
    select() {},
    remove() {
      removed = true;
    },
  };
  const document = {
    createElement(tag) {
      assert.equal(tag, 'textarea');
      return textarea;
    },
    body: {
      appendChild(element) {
        assert.equal(element, textarea);
        appended = true;
      },
    },
    execCommand(command) {
      assert.equal(command, 'copy');
      assert.equal(textarea.value, 'https://example.test');
      return copyResult;
    },
  };

  return { document, wasAppended: () => appended, wasRemoved: () => removed };
}

test('clipboard fallback confirms success and always removes its textarea', async () => {
  const fallback = makeFallbackDocument(true);

  await copyTextToClipboard('https://example.test', {
    clipboard: { writeText: async () => Promise.reject(new Error('permission denied')) },
    document: fallback.document,
  });

  assert.equal(fallback.wasAppended(), true);
  assert.equal(fallback.wasRemoved(), true);
});

test('copy rejects when the fallback reports failure and still removes its textarea', async () => {
  const fallback = makeFallbackDocument(false);

  await assert.rejects(
    copyTextToClipboard('https://example.test', {
      clipboard: { writeText: async () => Promise.reject(new Error('permission denied')) },
      document: fallback.document,
    }),
    /Copy command failed/
  );

  assert.equal(fallback.wasRemoved(), true);
});
