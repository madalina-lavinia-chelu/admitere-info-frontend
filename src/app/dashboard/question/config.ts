// src/schemas/auth.ts
import { VALIDATION_MESSAGES } from "@/utils/validation-messages";
import { z } from "zod";

// Define answer schema
const answerSchema = z.object({
  answer_text: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED }),
  is_correct: z.boolean().default(false),
});

export const questionFormSchema = z.object({
  question_text: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED }),
  hint: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED }),
  explanation: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED }),
  difficulty_id: z.number().min(1, { message: VALIDATION_MESSAGES.REQUIRED }),
  source_id: z.number().min(1, { message: VALIDATION_MESSAGES.REQUIRED }),
  type: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED }),
  is_free: z.union([z.boolean(), z.string()]).transform((val) => {
    // Convert string from form to boolean
    if (typeof val === "string") {
      return val === "true";
    }
    return val;
  }),
  chapter_ids: z
    .array(z.number())
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED }),
  answers: z
    .array(answerSchema)
    .min(2, { message: "Adaugă cel puțin două răspunsuri." })
    .refine((answers) => answers.some((answer) => answer.is_correct), {
      message: "Cel puțin un răspuns trebuie să fie corect.",
    }),
});

export type QuestionAnswer = {
  answer_text: string;
  is_correct?: boolean;
};

export type QuestionFormValues = {
  id?: number | null;
  question_text: string;
  difficulty_id: number;
  source_id: number;
  type: string;
  is_free: boolean | string; // Allow both for form compatibility
  chapter_ids: number[];
  hint: string;
  explanation: string;
  answers: QuestionAnswer[];
  chapters?: { id: number; name: string }[];
};

const questionFormDefaults: QuestionFormValues = {
  question_text: "",
  difficulty_id: 0,
  source_id: 0,
  type: "",
  is_free: true, // true = free, false = pro
  chapter_ids: [],
  hint: "",
  explanation: "",
  answers: [
    {
      answer_text: "",
      is_correct: false,
    },
  ],
};

export const getQuestionFormValues = (question: QuestionFormValues | null) => {
  if (!question) return questionFormDefaults;

  const chapterIds = Array.isArray(question.chapters)
    ? question.chapters.map((chapter) =>
        typeof chapter === "object" && chapter !== null ? chapter.id : chapter
      )
    : question.chapter_ids || questionFormDefaults.chapter_ids;

  // Convert boolean to string for form display
  const isFreeValue =
    question.is_free !== undefined
      ? question.is_free.toString()
      : questionFormDefaults.is_free.toString();

  return {
    question_text: question.question_text || questionFormDefaults.question_text,
    difficulty_id: question.difficulty_id || questionFormDefaults.difficulty_id,
    source_id: question.source_id || questionFormDefaults.source_id,
    type: question.type || questionFormDefaults.type,
    is_free: isFreeValue,
    chapter_ids: chapterIds,
    hint: question.hint || questionFormDefaults.hint,
    explanation: question.explanation || questionFormDefaults.explanation,
    answers: question.answers?.length
      ? question.answers
      : questionFormDefaults.answers,
  };
};

export const TYPES: { id: string; name: string }[] = [
  { id: "single", name: "Cu un singur răspuns" },
  { id: "multiple", name: "Cu răspunsuri multiple" },
];
