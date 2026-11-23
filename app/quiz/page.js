import DarkModeProvider from '../components/DarkModeProvider';
import ErrorBoundary from '../components/ErrorBoundary';
import Footer from '../components/Footer';
import QuizContainer from '../components/Quiz/QuizContainer';
import QuizHeader from '../components/Quiz/QuizHeader';
import { getQuizData } from '../lib/getQuizData.js';
import { getQuizProfileSummaries } from '../lib/quizProfileData.js';

export async function generateMetadata() {
  const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://browserating.com').replace(
    /\/$/,
    ''
  );
  const ogImageBase = `${BASE_URL}/images/card-image.png`;
  const { questions } = await getQuizData();

  return {
    title: 'Browser Quiz — Find Your Perfect Browser | BrowseRating',
    description: `Answer ${questions.length} quick questions and discover which browser is the best match for your needs. Personalized recommendations based on privacy, speed, features, and more.`,
    openGraph: {
      title: 'Find Your Perfect Browser — BrowseRating Quiz',
      description: 'Take our 2-minute quiz to find the browser that fits you best.',
      url: `${BASE_URL}/quiz`,
      images: [{ url: ogImageBase, width: 1200, height: 630, alt: 'BrowseRating Browser Quiz' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImageBase],
    },
  };
}

export default async function QuizPage() {
  const { profiles, questions, browsers } = await getQuizData();
  const browserProfiles = getQuizProfileSummaries(profiles, browsers);

  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <div
          className="min-h-screen transition-colors duration-200 flex flex-col"
          style={{ backgroundColor: 'var(--surface-default)' }}
        >
          <QuizHeader />
          <main className="flex-1 pt-14">
            <QuizContainer browserProfiles={browserProfiles} questions={questions} />
          </main>
          <Footer />
        </div>
      </DarkModeProvider>
    </ErrorBoundary>
  );
}
