'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import QuizIntro from './QuizIntro';
import QuizProgress from './QuizProgress';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import { computeResults } from './quizEngine';
import {
  createEmptyAnswers,
  parseQuizUrlState,
  serializeQuizAnswers,
  SKIP_ANSWER,
} from './quizState';

const STEP_INTRO = 0;
const AUTO_ADVANCE_DELAY = 500;
const COMPUTING_DELAY = 400;

function createSharedResults(profile, answers, questions, browserProfiles, hasSharedAnswers) {
  if (hasSharedAnswers) {
    return {
      ...computeResults(answers, questions, browserProfiles),
      isShared: true,
      hasSharedAnswers: true,
    };
  }

  return {
    topResults: profile.discontinued ? [] : [{ ...profile, matchPercentage: null }],
    discontinuedResults: profile.discontinued ? [profile] : [],
    userTraits: null,
    rankedBrowsers: [],
    selectedPlatforms: [],
    dealbreakers: {},
    isShared: true,
    hasSharedAnswers: false,
  };
}

function writeQuizUrl(step, answers, { replace = false, previousStep = null } = {}) {
  const url = new URL(window.location.href);
  url.searchParams.delete('r');
  url.searchParams.set('step', String(step));
  url.searchParams.set('a', serializeQuizAnswers(answers));

  const currentState =
    window.history.state && typeof window.history.state === 'object' ? window.history.state : {};
  const currentQuizState = currentState.quizState;
  const storedPreviousStep =
    replace && currentQuizState?.step === step ? currentQuizState.previousStep : previousStep;
  const nextState = {
    ...currentState,
    quizState: { step, answers, previousStep: storedPreviousStep },
  };
  const method = replace ? 'replaceState' : 'pushState';
  window.history[method](nextState, '', `${url.pathname}${url.search}${url.hash}`);
}

function clearQuizUrl({ replace = false } = {}) {
  const url = new URL(window.location.href);
  url.searchParams.delete('r');
  url.searchParams.delete('step');
  url.searchParams.delete('a');

  const currentState =
    window.history.state && typeof window.history.state === 'object' ? window.history.state : {};
  const nextState = { ...currentState };
  delete nextState.quizState;
  const method = replace ? 'replaceState' : 'pushState';
  window.history[method](nextState, '', `${url.pathname}${url.search}${url.hash}`);
}

function hasAnswer(answer) {
  return answer !== null && answer !== undefined;
}

function createInitialResults(
  sharedProfile,
  initialQuizState,
  initialAnswers,
  questions,
  browserProfiles
) {
  if (sharedProfile) {
    return createSharedResults(
      sharedProfile,
      initialAnswers,
      questions,
      browserProfiles,
      initialQuizState?.hasSharedAnswers ?? false
    );
  }

  if (initialQuizState?.step === questions.length + 1) {
    return {
      ...computeResults(initialAnswers, questions, browserProfiles),
      isShared: false,
      hasSharedAnswers: false,
    };
  }

  return null;
}

export default function QuizContainer({
  browserProfiles,
  questions,
  sharedResultId,
  initialQuizState,
}) {
  const normalizedSharedResultId =
    (initialQuizState?.sharedResultId ?? sharedResultId)?.toLowerCase() ?? null;
  const sharedProfile = normalizedSharedResultId
    ? browserProfiles.find((browser) => browser.id === normalizedSharedResultId)
    : null;
  const initialAnswers = initialQuizState?.answers ?? createEmptyAnswers(questions);
  const initialStep = sharedProfile
    ? questions.length + 1
    : initialQuizState?.sharedResultId
      ? STEP_INTRO
      : (initialQuizState?.step ?? STEP_INTRO);

  const [step, setStep] = useState(initialStep);
  const [answers, setAnswers] = useState(initialAnswers);
  const [results, setResults] = useState(() =>
    createInitialResults(
      sharedProfile,
      initialQuizState,
      initialAnswers,
      questions,
      browserProfiles
    )
  );
  const [direction, setDirection] = useState('forward');
  const [computing, setComputing] = useState(false);
  const [reviewing, setReviewing] = useState(
    () =>
      initialStep > STEP_INTRO &&
      initialStep <= questions.length &&
      hasAnswer(initialAnswers[initialStep - 1])
  );
  const advanceTimer = useRef(null);
  const computingTimer = useRef(null);

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  const clearComputingTimer = useCallback(() => {
    if (computingTimer.current) {
      clearTimeout(computingTimer.current);
      computingTimer.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearAdvanceTimer();
      clearComputingTimer();
    };
  }, [clearAdvanceTimer, clearComputingTimer]);

  const handleHistoryPop = useCallback(() => {
    clearAdvanceTimer();
    clearComputingTimer();
    setComputing(false);
    setDirection('back');

    const restoredState = parseQuizUrlState(new URLSearchParams(window.location.search), questions);
    const restoredAnswers = restoredState.answers;

    if (restoredState.sharedResultId) {
      const profile = browserProfiles.find(
        (browser) => browser.id === restoredState.sharedResultId.toLowerCase()
      );
      setAnswers(restoredAnswers);
      setReviewing(false);
      if (profile) {
        setStep(questions.length + 1);
        setResults(
          createSharedResults(
            profile,
            restoredAnswers,
            questions,
            browserProfiles,
            restoredState.hasSharedAnswers
          )
        );
      } else {
        setStep(STEP_INTRO);
        setResults(null);
      }
      return;
    }

    setAnswers(restoredAnswers);
    setStep(restoredState.step);
    setReviewing(
      restoredState.step > STEP_INTRO &&
        restoredState.step <= questions.length &&
        hasAnswer(restoredAnswers[restoredState.step - 1])
    );
    setResults(
      restoredState.step === questions.length + 1
        ? {
            ...computeResults(restoredAnswers, questions, browserProfiles),
            isShared: false,
            hasSharedAnswers: false,
          }
        : null
    );
  }, [browserProfiles, clearAdvanceTimer, clearComputingTimer, questions]);

  useEffect(() => {
    window.addEventListener('popstate', handleHistoryPop);
    return () => window.removeEventListener('popstate', handleHistoryPop);
  }, [handleHistoryPop]);

  const handleStart = useCallback(() => {
    clearAdvanceTimer();
    clearComputingTimer();
    const freshAnswers = createEmptyAnswers(questions);
    setAnswers(freshAnswers);
    setResults(null);
    setComputing(false);
    setReviewing(false);
    setDirection('forward');
    setStep(1);
    writeQuizUrl(1, freshAnswers, { previousStep: STEP_INTRO });
  }, [clearAdvanceTimer, clearComputingTimer, questions]);

  const completeQuiz = useCallback(
    (finalAnswers) => {
      clearAdvanceTimer();
      clearComputingTimer();
      setComputing(true);
      computingTimer.current = setTimeout(() => {
        computingTimer.current = null;
        const computed = {
          ...computeResults(finalAnswers, questions, browserProfiles),
          isShared: false,
          hasSharedAnswers: false,
        };
        writeQuizUrl(questions.length + 1, finalAnswers, {
          previousStep: questions.length,
        });
        setResults(computed);
        setComputing(false);
        setReviewing(false);
        setDirection('forward');
        setStep(questions.length + 1);
      }, COMPUTING_DELAY);
    },
    [browserProfiles, clearAdvanceTimer, clearComputingTimer, questions]
  );

  const advanceFrom = useCallback(
    (currentStep, nextAnswers, delay = 0) => {
      clearAdvanceTimer();
      const moveForward = () => {
        advanceTimer.current = null;
        const nextStep = currentStep + 1;
        if (nextStep > questions.length) {
          completeQuiz(nextAnswers);
          return;
        }

        writeQuizUrl(nextStep, nextAnswers, { previousStep: currentStep });
        setDirection('forward');
        setReviewing(hasAnswer(nextAnswers[nextStep - 1]));
        setStep(nextStep);
      };

      if (delay > 0) {
        advanceTimer.current = setTimeout(moveForward, delay);
      } else {
        moveForward();
      }
    },
    [clearAdvanceTimer, completeQuiz, questions.length]
  );

  const handleAnswer = useCallback(
    (optionId) => {
      const currentQuestionIndex = step - 1;
      const currentQuestion = questions[currentQuestionIndex];
      if (!currentQuestion) return;

      clearAdvanceTimer();
      const newAnswers = [...answers];

      if (currentQuestion.selectionMode === 'multiple') {
        const selectedOptions = Array.isArray(newAnswers[currentQuestionIndex])
          ? newAnswers[currentQuestionIndex]
          : [];
        newAnswers[currentQuestionIndex] = selectedOptions.includes(optionId)
          ? selectedOptions.filter((selectedId) => selectedId !== optionId)
          : [...selectedOptions, optionId];
        setAnswers(newAnswers);
        writeQuizUrl(step, newAnswers, { replace: true });
        return;
      }

      newAnswers[currentQuestionIndex] = optionId;
      setAnswers(newAnswers);
      writeQuizUrl(step, newAnswers, { replace: true });
      if (!reviewing) advanceFrom(step, newAnswers, AUTO_ADVANCE_DELAY);
    },
    [advanceFrom, answers, clearAdvanceTimer, questions, reviewing, step]
  );

  const handleSkip = useCallback(() => {
    const currentQuestionIndex = step - 1;
    if (!questions[currentQuestionIndex]) return;

    clearAdvanceTimer();
    const skippedAnswers = [...answers];
    skippedAnswers[currentQuestionIndex] = SKIP_ANSWER;
    setAnswers(skippedAnswers);
    writeQuizUrl(step, skippedAnswers, { replace: true });
    advanceFrom(step, skippedAnswers);
  }, [advanceFrom, answers, clearAdvanceTimer, questions, step]);

  const handleContinue = useCallback(() => {
    const currentQuestion = questions[step - 1];
    const answer = answers[step - 1];
    if (!currentQuestion) return;

    const canContinue =
      currentQuestion.selectionMode === 'multiple'
        ? Array.isArray(answer) && answer.length > 0
        : typeof answer === 'string' && answer !== SKIP_ANSWER;
    if (canContinue) advanceFrom(step, answers);
  }, [advanceFrom, answers, questions, step]);

  const handleBack = useCallback(() => {
    if (step <= 1) return;
    clearAdvanceTimer();
    clearComputingTimer();
    setComputing(false);
    setDirection('back');

    const currentQuizState = window.history.state?.quizState;
    if (currentQuizState?.step === step && currentQuizState.previousStep === step - 1) {
      window.history.back();
      return;
    }

    const previousStep = step - 1;
    setStep(previousStep);
    setResults(null);
    setReviewing(hasAnswer(answers[previousStep - 1]));
    writeQuizUrl(previousStep, answers, { replace: true });
  }, [answers, clearAdvanceTimer, clearComputingTimer, step]);

  const handleChangeAnswers = useCallback(() => {
    clearAdvanceTimer();
    clearComputingTimer();
    setComputing(false);
    setDirection('back');

    const lastQuestionStep = questions.length;
    const currentQuizState = window.history.state?.quizState;
    if (
      step === questions.length + 1 &&
      currentQuizState?.step === step &&
      currentQuizState.previousStep === lastQuestionStep
    ) {
      window.history.back();
      return;
    }

    setResults(null);
    setStep(lastQuestionStep);
    setReviewing(hasAnswer(answers[lastQuestionStep - 1]));
    writeQuizUrl(lastQuestionStep, answers, {
      replace: true,
    });
  }, [answers, clearAdvanceTimer, clearComputingTimer, questions.length, step]);

  const handleRetake = useCallback(() => {
    clearAdvanceTimer();
    clearComputingTimer();
    const freshAnswers = createEmptyAnswers(questions);
    setAnswers(freshAnswers);
    setResults(null);
    setComputing(false);
    setReviewing(false);
    setDirection('forward');
    setStep(STEP_INTRO);
    clearQuizUrl();
  }, [clearAdvanceTimer, clearComputingTimer, questions]);

  if (step === STEP_INTRO) {
    return (
      <QuizIntro
        browserProfiles={browserProfiles}
        questionCount={questions.length}
        onStart={handleStart}
      />
    );
  }

  if (computing) {
    return <ComputingScreen />;
  }

  if (step === questions.length + 1 && results) {
    return (
      <QuizResults
        results={results}
        userTraits={results.userTraits}
        answers={answers}
        questions={questions}
        onChangeAnswers={handleChangeAnswers}
        onRetake={handleRetake}
        isShared={results.isShared}
      />
    );
  }

  const currentQuestion = questions[step - 1];
  if (!currentQuestion) return null;

  const storedAnswer = answers[step - 1];
  const selectedAnswer =
    currentQuestion.selectionMode === 'multiple'
      ? Array.isArray(storedAnswer)
        ? storedAnswer
        : []
      : storedAnswer === SKIP_ANSWER
        ? null
        : storedAnswer;
  const canContinue =
    currentQuestion.selectionMode === 'multiple'
      ? selectedAnswer.length > 0
      : typeof selectedAnswer === 'string';

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <QuizProgress currentStep={step} totalSteps={questions.length} />
      <QuizQuestion
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onAnswer={handleAnswer}
        onContinue={handleContinue}
        onSkip={handleSkip}
        canContinue={canContinue}
        isReviewing={reviewing}
        onBack={handleBack}
        showBack={step > 1}
        direction={direction}
        stepKey={step}
      />
    </div>
  );
}

function ComputingScreen() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full animate-bounce"
              style={{
                backgroundColor: 'var(--color-brand)',
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>
        <p className="text-lg font-medium" style={{ color: 'var(--text-default)' }}>
          Finding your perfect browser…
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-subtle)' }}>
          Analyzing your preferences
        </p>
      </div>
    </div>
  );
}
