import { promises as fs } from 'fs';
import path from 'path';

import DarkModeProvider from '../components/DarkModeProvider';
import ErrorBoundary from '../components/ErrorBoundary';
import Footer from '../components/Footer';
import QuizContainer from '../components/Quiz/QuizContainer';
import QuizHeader from '../components/Quiz/QuizHeader';

export const metadata = {
  title: 'Browser Quiz — Find Your Perfect Browser | BrowseRating',
  description:
    'Answer 7 quick questions and discover which browser is the best match for your needs. Personalized recommendations based on privacy, speed, features, and more.',
  openGraph: {
    title: 'Find Your Perfect Browser — BrowseRating Quiz',
    description: 'Take our 2-minute quiz to find the browser that fits you best.',
    url: 'https://browserating.com/quiz',
  },
};

export default async function QuizPage({ searchParams }) {
  const dataDir = path.join(process.cwd(), 'public', 'data');

  const [profilesRaw, questionsRaw, browsersRaw] = await Promise.all([
    fs.readFile(path.join(dataDir, 'quiz', 'browser-profiles.json'), 'utf8'),
    fs.readFile(path.join(dataDir, 'quiz', 'questions.json'), 'utf8'),
    fs.readFile(path.join(dataDir, 'browsers.json'), 'utf8'),
  ]);

  const profiles = JSON.parse(profilesRaw);
  const questions = JSON.parse(questionsRaw);
  const browsers = JSON.parse(browsersRaw);

  const browsersMap = new Map(browsers.map((b) => [b.name.toLowerCase(), b]));

  const browserProfiles = profiles.map((profile) => {
    const match = browsersMap.get(profile.name.toLowerCase());
    return {
      ...profile,
      logo: match?.logo ?? null,
      website: match?.website ?? null,
    };
  });

  const params = await searchParams;
  const sharedResultId = params?.r ?? null;

  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 flex flex-col">
          <QuizHeader />
          <main className="flex-1 pt-14">
            <QuizContainer
              browserProfiles={browserProfiles}
              questions={questions}
              sharedResultId={sharedResultId}
            />
          </main>
          <Footer />
        </div>
      </DarkModeProvider>
    </ErrorBoundary>
  );
}
