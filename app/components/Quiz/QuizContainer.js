'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import QuizIntro from './QuizIntro';
import QuizProgress from './QuizProgress';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import { computeResults } from './quizEngine';
import {
  createEmptyAnswers,
  createQuizFlowState,
  parseQuizUrlState,
  quizFlowReducer,
  serializeQuizAnswers,
  SKIP_ANSWER,
} from './quizState';
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
      ? 0
      : (initialQuizState?.step ?? 0);

  const [flow, dispatch] = useReducer(
    quizFlowReducer,
    createQuizFlowState(initialStep, questions, initialAnswers)
  );
  const previousPhaseRef = useRef(flow.phase);
  const resultHeadingRef = useRef(null);
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
  const advanceTimer = useRef(null);
  const computingTimer = useRef(null);

  useEffect(() => {
    if (previousPhaseRef.current !== flow.phase && flow.phase === 'results') {
      resultHeadingRef.current?.focus();
    }
    previousPhaseRef.current = flow.phase;
  }, [flow.phase]);

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

    const restoredState = parseQuizUrlState(new URLSearchParams(window.location.search), questions);
    const restoredAnswers = restoredState.answers;
    setAnswers(restoredAnswers);

    if (restoredState.sharedResultId) {
      const profile = browserProfiles.find(
        (browser) => browser.id === restoredState.sharedResultId.toLowerCase()
      );
      if (profile) {
        setResults(
          createSharedResults(
            profile,
            restoredAnswers,
            questions,
            browserProfiles,
            restoredState.hasSharedAnswers
          )
        );
        dispatch({ type: 'results' });
      } else {
        setResults(null);
        dispatch({ type: 'intro' });
      }
      return;
    }

    setResults(
      restoredState.step === questions.length + 1
        ? {
            ...computeResults(restoredAnswers, questions, browserProfiles),
            isShared: false,
            hasSharedAnswers: false,
          }
        : null
    );
    dispatch({
      type: 'restore',
      state: createQuizFlowState(restoredState.step, questions, restoredAnswers, 'back'),
    });
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
    dispatch({ type: 'start' });
    writeQuizUrl(1, freshAnswers, { previousStep: 0 });
  }, [clearAdvanceTimer, clearComputingTimer, questions]);

  const completeQuiz = useCallback(
    (finalAnswers) => {
      clearAdvanceTimer();
      clearComputingTimer();
      dispatch({ type: 'computing' });
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
        dispatch({ type: 'results' });
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
        dispatch({
          type: 'question',
          index: nextStep - 1,
          reviewing: hasAnswer(nextAnswers[nextStep - 1]),
          direction: 'forward',
        });
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
      if (flow.phase !== 'question') return;
      const currentQuestionIndex = flow.index;
      const currentStep = currentQuestionIndex + 1;
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
        writeQuizUrl(currentStep, newAnswers, { replace: true });
        return;
      }

      newAnswers[currentQuestionIndex] = optionId;
      setAnswers(newAnswers);
      writeQuizUrl(currentStep, newAnswers, { replace: true });
      if (!flow.reviewing) advanceFrom(currentStep, newAnswers, AUTO_ADVANCE_DELAY);
    },
    [advanceFrom, answers, clearAdvanceTimer, flow.index, flow.phase, flow.reviewing, questions]
  );

  const handleSkip = useCallback(() => {
    if (flow.phase !== 'question') return;
    const currentQuestionIndex = flow.index;
    const currentStep = currentQuestionIndex + 1;
    if (!questions[currentQuestionIndex]) return;

    clearAdvanceTimer();
    const skippedAnswers = [...answers];
    skippedAnswers[currentQuestionIndex] = SKIP_ANSWER;
    setAnswers(skippedAnswers);
    writeQuizUrl(currentStep, skippedAnswers, { replace: true });
    advanceFrom(currentStep, skippedAnswers);
  }, [advanceFrom, answers, clearAdvanceTimer, flow.index, flow.phase, questions]);

  const handleContinue = useCallback(() => {
    if (flow.phase !== 'question') return;
    const currentStep = flow.index + 1;
    const currentQuestion = questions[flow.index];
    const answer = answers[flow.index];
    if (!currentQuestion) return;

    const canContinue =
      currentQuestion.selectionMode === 'multiple'
        ? Array.isArray(answer) && answer.length > 0
        : typeof answer === 'string' && answer !== SKIP_ANSWER;
    if (canContinue) advanceFrom(currentStep, answers);
  }, [advanceFrom, answers, flow.index, flow.phase, questions]);

  const handleBack = useCallback(() => {
    if (flow.phase !== 'question') return;
    const currentStep = flow.index + 1;
    if (currentStep <= 1) return;
    clearAdvanceTimer();
    clearComputingTimer();

    const currentQuizState = window.history.state?.quizState;
    if (
      currentQuizState?.step === currentStep &&
      currentQuizState.previousStep === currentStep - 1
    ) {
      window.history.back();
      return;
    }

    const previousStep = currentStep - 1;
    setResults(null);
    dispatch({
      type: 'question',
      index: previousStep - 1,
      reviewing: hasAnswer(answers[previousStep - 1]),
      direction: 'back',
    });
    writeQuizUrl(previousStep, answers, { replace: true });
  }, [answers, clearAdvanceTimer, clearComputingTimer, flow.index, flow.phase]);

  const handleChangeAnswers = useCallback(() => {
    if (flow.phase !== 'results') return;
    clearAdvanceTimer();
    clearComputingTimer();

    const lastQuestionStep = questions.length;
    const resultStep = questions.length + 1;
    const currentQuizState = window.history.state?.quizState;
    if (
      currentQuizState?.step === resultStep &&
      currentQuizState.previousStep === lastQuestionStep
    ) {
      window.history.back();
      return;
    }

    setResults(null);
    dispatch({
      type: 'question',
      index: lastQuestionStep - 1,
      reviewing: hasAnswer(answers[lastQuestionStep - 1]),
      direction: 'back',
    });
    writeQuizUrl(lastQuestionStep, answers, { replace: true });
  }, [answers, clearAdvanceTimer, clearComputingTimer, flow.phase, questions.length]);

  const handleRetake = useCallback(() => {
    clearAdvanceTimer();
    clearComputingTimer();
    const freshAnswers = createEmptyAnswers(questions);
    setAnswers(freshAnswers);
    setResults(null);
    dispatch({ type: 'intro' });
    clearQuizUrl();
  }, [clearAdvanceTimer, clearComputingTimer, questions]);

  if (flow.phase === 'intro') {
    return (
      <QuizIntro
        browserProfiles={browserProfiles}
        questionCount={questions.length}
        onStart={handleStart}
      />
    );
  }

  if (flow.phase === 'computing') {
    return <ComputingScreen />;
  }

  if (flow.phase === 'results' && results) {
    return (
      <QuizResults
        results={results}
        userTraits={results.userTraits}
        answers={answers}
        questions={questions}
        onChangeAnswers={handleChangeAnswers}
        onRetake={handleRetake}
        isShared={results.isShared}
        resultHeadingRef={resultHeadingRef}
      />
    );
  }

  const currentQuestion = questions[flow.index];
  if (!currentQuestion) return null;

  const currentStep = flow.index + 1;
  const storedAnswer = answers[flow.index];
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
      <QuizProgress currentStep={currentStep} totalSteps={questions.length} />
      <QuizQuestion
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onAnswer={handleAnswer}
        onContinue={handleContinue}
        onSkip={handleSkip}
        canContinue={canContinue}
        isReviewing={flow.reviewing}
        onBack={handleBack}
        showBack={flow.index > 0}
        direction={flow.direction}
        stepKey={currentStep}
      />
    </div>
  );
}

function ComputingScreen() {
  return (
    <div
      className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full animate-bounce motion-reduce:animate-none"
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
