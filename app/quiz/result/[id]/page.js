import { notFound } from 'next/navigation';
import DarkModeProvider from '../../../components/DarkModeProvider';
import ErrorBoundary from '../../../components/ErrorBoundary';
import Footer from '../../../components/Footer';
import QuizContainer from '../../../components/Quiz/QuizContainer';
import QuizHeader from '../../../components/Quiz/QuizHeader';
import { getQuizData } from '../../../lib/getQuizData.js';
import { decorateQuizProfiles, getQuizProfileSummary } from '../../../lib/quizProfileData.js';

export const dynamicParams = false;

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://browserating.com').replace(/\/$/, '');
}

export async function generateStaticParams() {
  const { profiles } = await getQuizData();
  return profiles.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { profiles } = await getQuizData();
  const profile = profiles.find((candidate) => candidate.id === id.toLowerCase());

  if (!profile) return { title: 'Browser Quiz — BrowseRating' };

  const baseUrl = getSiteUrl();
  const sharePath = `/quiz/result/${encodeURIComponent(profile.id)}`;
  const ogImageUrl = `${baseUrl}/api/og/quiz?r=${encodeURIComponent(profile.id)}`;
  const title = `Someone matched with ${profile.name} — what's yours?`;
  const description = `Someone matched with ${profile.name} in the BrowseRating browser quiz. Take the quiz to find your own browser match.`;

  return {
    title: `${title} | BrowseRating`,
    description,
    alternates: { canonical: `${baseUrl}${sharePath}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${sharePath}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function QuizResultPage({ params }) {
  const { id } = await params;
  const { profiles, questions, browsers } = await getQuizData();
  const decoratedProfiles = decorateQuizProfiles(profiles, browsers);
  const sharedProfile = decoratedProfiles.find((profile) => profile.id === id.toLowerCase());

  if (!sharedProfile) notFound();

  const browserProfiles = decoratedProfiles.map(getQuizProfileSummary);

  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <div
          className="min-h-screen transition-colors duration-200 flex flex-col"
          style={{ backgroundColor: 'var(--surface-default)' }}
        >
          <QuizHeader />
          <main className="flex-1 pt-14">
            <QuizContainer
              browserProfiles={browserProfiles}
              questions={questions}
              sharedResultId={sharedProfile.id}
              sharedProfile={sharedProfile}
            />
          </main>
          <Footer />
        </div>
      </DarkModeProvider>
    </ErrorBoundary>
  );
}
