import { ApiResponseType } from "@/types/types";
import { ApiResponse } from "@/utils/api.utils";
import axiosInstance from "@/utils/axios";

// Filter types for question flow
export interface QuestionFlowFilters {
  chapter_ids?: number[];
  difficulty_ids?: number[];
  source_ids?: number[];
  type?: "single" | "multiple";
}

// History-related types
export interface HistorySearchPayload {
  page?: number;
  per_page?: number;
  search?: string | null;
  difficulty_id?: number | null;
  chapter_id?: number | null;
  type?: "single" | "multiple" | null;
  status?: "correct" | "incorrect" | "skipped" | null;
}

export interface UserQuestionHistory {
  id: number;
  question_id: number;
  user_id: number;
  selected_answer_ids: number[];
  is_correct: boolean;
  is_skipped: boolean;
  time_spent: number;
  hints_used: number;
  cycle: number;
  created_at: string;
  updated_at: string;
  question: {
    id: number;
    question_text: string;
    type: "single" | "multiple";
    hint: string;
    explanation: string;
    difficulty: {
      id: number;
      name: string;
    };
    source: {
      id: number;
      name: string;
    } | null;
    chapters: Array<{
      id: number;
      name: string;
      parent_id: number | null;
      order: number;
    }>;
    answers: Array<{
      id: number;
      answer_text: string;
      is_correct: boolean;
    }>;
  };
}

export interface HistoryResponse {
  current_page: number;
  data: UserQuestionHistory[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Actual nested response format from backend
export interface HistoryApiResponse {
  history: UserQuestionHistory[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

// Response types based on backend controller
export interface QuestionFlowAnswer {
  id: number;
  answer_text: string;
}

export interface QuestionFlowQuestion {
  id: number;
  question_text: string;
  type: "single" | "multiple";
  hint: string;
  answers: QuestionFlowAnswer[];
  chapters: Array<{
    id: number;
    name: string;
    parent_id: number | null;
    order: number;
  }>;
  difficulty: {
    id: number;
    name: string;
  };
  source: {
    id: number;
    name: string;
  } | null;
  queue_position: number;
}

export interface QueueInfo {
  total_questions: number;
  current_position: number;
  cycle: number;
}

export interface Progress {
  answered: number;
  skipped: number;
  total: number;
  cycle: number;
  completion_percentage: number;
}

export interface SessionStats {
  correct_answers: number;
  incorrect_answers: number;
  skipped_questions: number;
  total_answered: number;
  accuracy_percentage: number;
  average_time_per_question: number;
  hints_used: number;
}

export interface SubmitAnswerResult {
  is_correct: boolean;
  selected_answers: number[];
  correct_answers: number[];
  explanation: string;
  time_spent: number | null;
}

// Analytics types
export interface OverallStats {
  total_questions_attempted: number;
  total_correct: number;
  total_incorrect: number;
  total_skipped: number;
  overall_accuracy: number;
  total_time_spent: number;
  total_hints_used: number;
}

export interface AnalyticsResponse {
  overall_stats: OverallStats;
  difficulty_breakdown: Record<string, any>;
  chapter_breakdown: Record<string, any>;
  recent_activity: Array<any>;
}

// API Request Functions

/**
 * Get the current question for the authenticated user
 */
export const getCurrentQuestionRequest = async (
  filters?: QuestionFlowFilters
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/question-flow/get-current-question",
      filters || {}
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Submit an answer for the current question
 */
export const submitAnswerRequest = async (
  payload: {
    question_id: number;
    selected_answer_ids: number[];
    time_spent?: number;
  },
  filters?: QuestionFlowFilters
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question-flow/submit-answer", {
      ...payload,
      ...filters,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Move to the next question
 */
export const nextQuestionRequest = async (
  filters?: QuestionFlowFilters
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/question-flow/next-question",
      filters || {}
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Skip the current question
 */
export const skipQuestionRequest = async (
  payload: {
    question_id: number;
  },
  filters?: QuestionFlowFilters
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question-flow/skip-question", {
      ...payload,
      ...filters,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Apply new filters and get the first question
 */
export const applyFiltersRequest = async (
  filters: QuestionFlowFilters
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question-flow/apply-filters", {
      ...filters,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Start a new cycle when current one is complete
 */
export const startNewCycleRequest = async (
  filters?: QuestionFlowFilters
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/question-flow/start-new-cycle",
      filters || {}
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Move to the previous question (though not used in forward-only flow)
 */
export const previousQuestionRequest = async (
  filters: QuestionFlowFilters = {}
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/question-flow/previous-question",
      {
        ...filters,
      }
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Get progress information for current filter context
 */
export const getProgressRequest = async (
  filters: QuestionFlowFilters = {}
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question-flow/get-progress", {
      ...filters,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Use hint for current question
 */
export const sendUseHintRequest = async (
  payload: {
    question_id: number;
  },
  filters?: QuestionFlowFilters
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question-flow/use-hint", {
      ...payload,
      ...filters,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Get user's performance analytics
 */
export const getAnalyticsRequest = async (): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/question-flow/get-analytics",
      {}
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Get user's detailed analytics including overall stats and breakdowns
 */
export const getDetailedAnalyticsRequest =
  async (): Promise<ApiResponseType> => {
    try {
      const response = await axiosInstance.post(
        "/question-flow/get-detailed-analytics"
      );
      return ApiResponse.success(response.data);
    } catch (error) {
      return ApiResponse.error(error);
    }
  };

/**
 * Get user's question answering history with pagination
 */
export const getHistoryRequest = async (
  payload: HistorySearchPayload = {}
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question-flow/get-history", {
      ...payload,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};
