import { serializeQuizAnswers } from './quizState.js';

export function createQuizShareUrl(browserId, answers, origin) {
  const url = new URL(`/quiz/result/${encodeURIComponent(browserId)}`, origin);
  if (Array.isArray(answers)) url.searchParams.set('a', serializeQuizAnswers(answers));
  return url.toString();
}

export async function copyTextToClipboard(
  text,
  { clipboard = globalThis.navigator?.clipboard, document = globalThis.document } = {}
) {
  if (typeof clipboard?.writeText === 'function') {
    try {
      await clipboard.writeText(text);
      return;
    } catch {}
  }

  if (!document) throw new Error('Clipboard is unavailable');

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';

  try {
    document.body.appendChild(textarea);
    textarea.select();
    if (!document.execCommand('copy')) throw new Error('Copy command failed');
  } finally {
    textarea.remove();
  }
}
