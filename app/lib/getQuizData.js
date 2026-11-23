import { promises as fs } from 'fs';
import path from 'path';
import { cache } from 'react';

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'));

export const getQuizData = cache(async () => {
  const quizDir = path.join(process.cwd(), 'app', 'data', 'quiz');
  const siteDataDir = path.join(process.cwd(), 'public', 'data');

  const [questions, profiles, browsers] = await Promise.all([
    readJson(path.join(quizDir, 'questions.json')),
    readJson(path.join(quizDir, 'browser-profiles.json')),
    readJson(path.join(siteDataDir, 'browsers.json')),
  ]);

  return { questions, profiles, browsers };
});
