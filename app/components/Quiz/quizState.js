export const SKIP_ANSWER = '__quiz_no_preference__';

export function createEmptyAnswers(questions) {
  return questions.map(() => null);
}

export function createQuizFlowState(step, questions, answers, direction = 'forward') {
  if (step === 0) return { phase: 'intro' };
  if (step === questions.length + 1) return { phase: 'results' };

  const answer = answers[step - 1];
  return {
    phase: 'question',
    index: step - 1,
    direction,
    reviewing: answer !== null && answer !== undefined,
  };
}

export function quizFlowReducer(state, action) {
  switch (action.type) {
    case 'start':
      return { phase: 'question', index: 0, direction: 'forward', reviewing: false };
    case 'question':
      return {
        phase: 'question',
        index: action.index,
        direction: action.direction,
        reviewing: action.reviewing,
      };
    case 'computing':
      return { phase: 'computing' };
    case 'results':
      return { phase: 'results' };
    case 'intro':
      return { phase: 'intro' };
    case 'restore':
      return action.state;
    default:
      return state;
  }
}

export function serializeQuizAnswers(answers) {
  return JSON.stringify(Array.isArray(answers) ? answers : []);
}

export function parseQuizAnswers(serializedAnswers, questions, requireComplete = false) {
  if (typeof serializedAnswers !== 'string') return null;

  let parsedAnswers;
  try {
    parsedAnswers = JSON.parse(serializedAnswers);
  } catch {
    return null;
  }
  if (!Array.isArray(parsedAnswers)) return null;

  const answers = createEmptyAnswers(questions);
  let complete = parsedAnswers.length === questions.length;

  questions.forEach((question, index) => {
    const answer = parsedAnswers[index];
    if (answer === SKIP_ANSWER) {
      answers[index] = SKIP_ANSWER;
      return;
    }
    if (answer === null || answer === undefined) {
      complete = false;
      return;
    }

    const optionIds = new Set(question.options.map((option) => option.id));
    if (question.selectionMode === 'multiple') {
      if (Array.isArray(answer)) {
        const validAnswers = answer.filter((id) => typeof id === 'string' && optionIds.has(id));
        if (validAnswers.length === 0 || validAnswers.length !== answer.length) complete = false;
        answers[index] = [...new Set(validAnswers)];
      } else {
        complete = false;
      }
      return;
    }

    if (typeof answer === 'string' && optionIds.has(answer)) {
      answers[index] = answer;
    } else {
      complete = false;
    }
  });

  return requireComplete && !complete ? null : answers;
}

function getSearchParam(searchParams, key) {
  if (typeof searchParams?.get === 'function') {
    return searchParams.get(key);
  }

  const value = searchParams?.[key];
  return Array.isArray(value)
    ? value[0] == null
      ? null
      : String(value[0])
    : value == null
      ? null
      : String(value);
}

export function parseQuizUrlState(searchParams, questions, fallbackSharedResultId = null) {
  const sharedResultId = getSearchParam(searchParams, 'r') ?? fallbackSharedResultId;
  const encodedAnswers = getSearchParam(searchParams, 'a');
  const parsedAnswers = parseQuizAnswers(encodedAnswers, questions, Boolean(sharedResultId));

  if (sharedResultId) {
    return {
      sharedResultId,
      step: questions.length + 1,
      answers: parsedAnswers ?? createEmptyAnswers(questions),
      hasSharedAnswers: parsedAnswers !== null,
      hasQuizState: false,
    };
  }

  const rawStep = getSearchParam(searchParams, 'step');
  const step = rawStep === null ? NaN : Number(rawStep);
  if (!Number.isInteger(step) || step < 1 || step > questions.length + 1) {
    return {
      sharedResultId: null,
      step: 0,
      answers: createEmptyAnswers(questions),
      hasSharedAnswers: false,
      hasQuizState: false,
    };
  }

  return {
    sharedResultId: null,
    step,
    answers: parsedAnswers ?? createEmptyAnswers(questions),
    hasSharedAnswers: false,
    hasQuizState: true,
  };
}
