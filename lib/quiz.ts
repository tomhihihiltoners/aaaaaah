export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export interface Team {
  id: string;
  name: string;
  score: number;
}

export function createInitialTeams(): Team[] {
  return [
    { id: "team-1", name: "Team 1", score: 0 },
    { id: "team-2", name: "Team 2", score: 0 },
    { id: "team-3", name: "Team 3", score: 0 },
  ];
}

export function createTeam(teamNumber: number): Team {
  const randomSuffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;

  return {
    id: `team-${randomSuffix}`,
    name: `Team ${teamNumber}`,
    score: 0,
  };
}

export function normalizeTeamName(name: string, teamNumber: number) {
  const trimmedName = name.trim();
  return trimmedName.length > 0 ? trimmedName : `Team ${teamNumber}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseQuiz(input: unknown): QuizData {
  if (!isRecord(input)) {
    throw new Error("Quiz data must be a JSON object.");
  }

  const { title, questions } = input;

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error("Quiz title must be a non-empty string.");
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Quiz questions must be a non-empty array.");
  }

  const parsedQuestions: QuizQuestion[] = questions.map((rawQuestion, index) => {
    if (!isRecord(rawQuestion)) {
      throw new Error(`Question ${index + 1} must be an object.`);
    }

    const { question, options, correct } = rawQuestion;

    if (typeof question !== "string" || question.trim().length === 0) {
      throw new Error(`Question ${index + 1} must have a non-empty question.`);
    }

    if (
      !Array.isArray(options) ||
      options.length < 2 ||
      options.some((option) => typeof option !== "string" || option.trim().length === 0)
    ) {
      throw new Error(`Question ${index + 1} must have at least two non-empty options.`);
    }

    if (
      typeof correct !== "number" ||
      !Number.isInteger(correct) ||
      correct < 0 ||
      correct >= options.length
    ) {
      throw new Error(
        `Question ${index + 1} must have a correct index between 0 and ${options.length - 1}.`,
      );
    }

    return {
      question,
      options: options as string[],
      correct,
    };
  });

  return {
    title,
    questions: parsedQuestions,
  };
}
