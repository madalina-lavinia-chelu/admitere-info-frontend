import {
  QuestionFlowQuestion,
  Progress as QuestionProgress,
  SessionStats,
  SubmitAnswerResult,
} from "@/requests/question-flow.requests";

export interface QuestionFlowState {
  currentQuestion: QuestionFlowQuestion | null;
  progress: QuestionProgress | null;
  sessionStats: SessionStats | null;
  loading: boolean;
  submitting: boolean;
  selectedAnswers: number[];
  submitResult: SubmitAnswerResult | null;
  hintUsed: boolean;
  startTime: number;
  cycleCompleted: boolean;
  newCycleAvailable: boolean;
  freeLimitReached: boolean;
}

export interface QuestionFlowHandlers {
  handleAnswerSelection: (answerId: number) => void;
  handleSubmitAnswer: () => Promise<void>;
  handleNextQuestion: () => Promise<void>;
  handleSkipQuestion: () => Promise<void>;
  handleUseHint: () => Promise<void>;
  handleStartNewCycle: () => Promise<void>;
}
