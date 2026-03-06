'use client';

export default function QuizProgress({ currentStep, totalSteps }) {
  return (
    <div className="px-4 sm:px-6 pt-6 pb-2 max-w-2xl mx-auto w-full">
      <div
        className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 text-center"
        aria-live="polite"
        aria-atomic="true"
      >
        Question {currentStep} of {totalSteps}
      </div>
      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
      >
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < currentStep
                ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
