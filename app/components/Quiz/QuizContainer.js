'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import QuizIntro from './QuizIntro';
import QuizProgress from './QuizProgress';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import { computeResults } from './quizEngine';

const STEP_INTRO = 0;
const STEP_RESULTS = 8;
const COMPUTING_DELAY = 1200;
const LS_KEY = 'brating_quiz_last_result';

export default function QuizContainer({ browserProfiles, questions, sharedResultId }) {
  const [step, setStep] = useState(sharedResultId ? STEP_RESULTS : STEP_INTRO);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [direction, setDirection] = useState('forward');
  const [computing, setComputing] = useState(false);
  const computingTimer = useRef(null);

  useEffect(() => {
    if (sharedResultId) {
      const profile = browserProfiles.find((b) => b.id === sharedResultId);
      if (profile) {
        setResults({ topResults: [profile], userTraits: null, rankedBrowsers: [], isShared: true });
      }
    } else {
      try {
        const saved = localStorage.getItem(LS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.topResults) {
            setResults(parsed);
          }
        }
      } catch {}
    }
  }, [sharedResultId, browserProfiles]);

  useEffect(() => {
    return () => {
      if (computingTimer.current) clearTimeout(computingTimer.current);
    };
  }, []);

  const handleStart = useCallback(() => {
    setDirection('forward');
    setStep(1);
  }, []);

  const handleAnswer = useCallback(
    (optionId) => {
      const currentQuestion = step - 1;
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = optionId;
      setAnswers(newAnswers);

      const nextStep = step + 1;

      if (nextStep > questions.length) {
        setComputing(true);
        computingTimer.current = setTimeout(() => {
          const computed = computeResults(newAnswers, questions, browserProfiles);
          try {
            localStorage.setItem(LS_KEY, JSON.stringify(computed));
          } catch {}
          setResults(computed);
          setComputing(false);
          setDirection('forward');
          setStep(STEP_RESULTS);
        }, COMPUTING_DELAY);
      } else {
        setDirection('forward');
        setTimeout(() => setStep(nextStep), 500);
      }
    },
    [step, answers, questions, browserProfiles]
  );

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
    return <QuizIntro browserProfiles={browserProfiles} onStart={handleStart} />;
  }

  if (computing) {
    return <ComputingScreen />;
  }

  if (step === STEP_RESULTS && results) {
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
  const selectedAnswer = answers[step - 1] ?? null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <QuizProgress currentStep={step} totalSteps={questions.length} />
      <QuizQuestion
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onAnswer={handleAnswer}
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
              className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Finding your perfect browser…
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Analyzing your preferences</p>
      </div>
    </div>
  );
}
