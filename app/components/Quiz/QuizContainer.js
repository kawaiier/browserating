'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import QuizIntro from './QuizIntro';
import QuizProgress from './QuizProgress';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import { computeResults } from './quizEngine';

const STEP_INTRO = 0;
const COMPUTING_DELAY = 1200;
const LS_KEY = 'brating_quiz_last_result';

export default function QuizContainer({ browserProfiles, questions, sharedResultId }) {
  const normalizedSharedResultId = sharedResultId?.toLowerCase() ?? null;
  const sharedProfile = normalizedSharedResultId
    ? browserProfiles.find((b) => b.id === normalizedSharedResultId)
    : null;
  const [step, setStep] = useState(sharedProfile ? questions.length : STEP_INTRO);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(() => {
    if (sharedProfile) {
      return {
        topResults: [{ ...sharedProfile, matchPercentage: null }],
        userTraits: null,
        rankedBrowsers: [],
        isShared: true,
      };
    }
    return null;
  });
  const [direction, setDirection] = useState('forward');
  const [computing, setComputing] = useState(false);
  const computingTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (computingTimer.current) clearTimeout(computingTimer.current);
    };
  }, []);

  const handleStart = useCallback(() => {
    setDirection('forward');
    setStep(1);
  }, []);

  const completeQuiz = useCallback(
    (finalAnswers) => {
      setComputing(true);
      computingTimer.current = setTimeout(() => {
        const computed = computeResults(finalAnswers, questions, browserProfiles);
        try {
          localStorage.setItem(LS_KEY, JSON.stringify(computed));
        } catch {}
        setResults(computed);
        setComputing(false);
        setDirection('forward');
        setStep(questions.length);
      }, COMPUTING_DELAY);
    },
    [questions, browserProfiles]
  );

  const advanceFrom = useCallback(
    (currentStep, nextAnswers) => {
      const nextStep = currentStep + 1;
      if (nextStep > questions.length) {
        completeQuiz(nextAnswers);
      } else {
        setDirection('forward');
        setTimeout(() => setStep(nextStep), 500);
      }
    },
    [questions.length, completeQuiz]
  );

  const handleAnswer = useCallback(
    (optionId) => {
      const currentQuestionIndex = step - 1;
      const currentQuestion = questions[currentQuestionIndex];
      const newAnswers = [...answers];

      if (currentQuestion.selectionMode === 'multiple') {
        const selectedOptions = Array.isArray(newAnswers[currentQuestionIndex])
          ? newAnswers[currentQuestionIndex]
          : [];
        newAnswers[currentQuestionIndex] = selectedOptions.includes(optionId)
          ? selectedOptions.filter((selectedId) => selectedId !== optionId)
          : [...selectedOptions, optionId];
        setAnswers(newAnswers);
        return;
      }

      newAnswers[currentQuestionIndex] = optionId;
      setAnswers(newAnswers);
      advanceFrom(step, newAnswers);
    },
    [step, answers, questions, advanceFrom]
  );

  const handleContinue = useCallback(() => {
    if (!Array.isArray(answers[step - 1]) || answers[step - 1].length === 0) return;
    advanceFrom(step, answers);
  }, [step, answers, advanceFrom]);

  const handleBack = useCallback(() => {
    if (step <= 1) return;
    setDirection('back');
    setStep((s) => s - 1);
  }, [step]);

  const handleRetake = useCallback(() => {
    setAnswers([]);
    setResults(null);
    setDirection('forward');
    setStep(STEP_INTRO);
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}
  }, []);

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

  if (step === questions.length && results) {
    return (
      <QuizResults
        results={results}
        userTraits={results.userTraits}
        onRetake={handleRetake}
        isShared={results.isShared}
      />
    );
  }

  const currentQuestion = questions[step - 1];
  const selectedAnswer =
    answers[step - 1] ?? (currentQuestion?.selectionMode === 'multiple' ? [] : null);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <QuizProgress currentStep={step} totalSteps={questions.length} />
      <QuizQuestion
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onAnswer={handleAnswer}
        onContinue={handleContinue}
        canContinue={Array.isArray(selectedAnswer) && selectedAnswer.length > 0}
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
