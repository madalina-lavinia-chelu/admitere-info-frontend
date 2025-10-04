export interface ApiResponseType {
  error: boolean;
  message: string;

  [key: string]: any;
}

export interface UserType {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface QuestionType {
  id: number;
  question_text: string;
  type: "single" | "multiple";
  explanation: string;
  hint: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  difficulty_id: number;
  source_id: number | null;
  difficulty?: {
    id: number;
    name: string;
  };
  source?: {
    id: number;
    name: string;
  } | null;
  answers: Array<{
    id: number;
    question_id: number;
    answer_text: string;
    is_correct: boolean;
    created_at: string;
    updated_at: string;
  }>;
  chapters: Array<{
    id: number;
    name: string;
    parent_id: number | null;
    order: number;
    created_at: string;
    updated_at: string;
    pivot: {
      question_id: number;
      chapter_id: number;
    };
  }>;
  user?: {
    id: number;
    email: string;
    role_id: number;
  };
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ApiPaginatedResponse<T> extends ApiResponseType {
  data: {
    current_page: number;
    data: T[];
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
  };
}

export type RoleType = string;

export type ModeType = "edit" | "create";

export type QuestionsSearchPayloadType = {
  id?: number | null;
  page?: number;
  per_page?: number;
  search?: string | null;
  difficulty_id?: number | null;
  source_id?: number | null;
  chapter_id?: number | null;
  type?: "single" | "multiple" | null;
  is_free?: boolean | null;
};

export type UserSearchPayloadType = {
  id?: number | null;
  page?: number;
  per_page?: number;
  search?: string | null;
  role_id?: number | null;
  is_pro?: boolean | null;
};

export interface AuthenticatedUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  role_info?: {
    id: number;
    name: string;
  };
  subscription_info?: {
    is_pro: boolean;
    subscription_type: "free" | "pro";
    status: string;
    expires_at: string | null;
    will_cancel: boolean;
    question_access: {
      can_access_pro_questions: boolean;
      available_free_questions: number;
      available_pro_questions: number;
      total_questions: number;
    };
  };
  isPro?: boolean;
  hasStripeId?: boolean;
}
