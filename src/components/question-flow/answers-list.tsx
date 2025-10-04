"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, XCircle } from "lucide-react";
import MotionWrapper from "@/components/ui/motion-wrapper";
import {
  QuestionFlowQuestion,
  SubmitAnswerResult,
} from "@/requests/question-flow.requests";
import { MathContentRenderer } from "../ui/math-content-renderer";

interface AnswersListProps {
  question: QuestionFlowQuestion;
  selectedAnswers: number[];
  submitResult: SubmitAnswerResult | null;
  onAnswerSelection: (answerId: number) => void;
}

export function AnswersList({
  question,
  selectedAnswers,
  submitResult,
  onAnswerSelection,
}: AnswersListProps) {
  // Get answer status for styling
  const getAnswerStatus = (answerId: number) => {
    if (!submitResult) return "default";

    const isSelected = selectedAnswers.includes(answerId);
    const isCorrect = submitResult.correct_answers.includes(answerId);

    if (isCorrect) return "correct";
    if (isSelected && !isCorrect) return "incorrect";
    return "default";
  };

  return (
    <MotionWrapper type="fade-up" duration={0.8} delay={0.3}>
      <div className="space-y-3 md:space-y-4">
        <div className="grid grid-cols-1 gap-2 md:gap-3 lg:grid-cols-2">
          {question.answers.map((answer, index) => {
            const isSelected = selectedAnswers.includes(answer.id);
            const status = getAnswerStatus(answer.id);
            const disabled = !!submitResult; // Disable after submission

            return (
              <MotionWrapper
                key={answer.id}
                type="fade-up"
                duration={0.5}
                delay={0.5 + index * 0.1}>
                <div
                  className={`
                        group border-2 rounded-xl p-3 md:p-4 cursor-pointer transition-all duration-200 hover:shadow-md
                        ${
                          disabled ? "cursor-not-allowed" : "hover:scale-[1.01]"
                        }
                        ${
                          isSelected && !disabled
                            ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-500 shadow-md"
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-blue-200 dark:hover:border-blue-700"
                        }
                        ${
                          status === "correct"
                            ? "border-green-400 bg-green-50 dark:bg-green-950/30 dark:border-green-500 shadow-md"
                            : ""
                        }
                        ${
                          status === "incorrect"
                            ? "border-red-400 bg-red-50 dark:bg-red-950/30 dark:border-red-500 shadow-md"
                            : ""
                        }
                      `}
                  onClick={() => !disabled && onAnswerSelection(answer.id)}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {question?.type === "single" ? (
                        <div
                          className={`
                                w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                                ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-400 dark:border-gray-500 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                                }
                                ${
                                  status === "correct"
                                    ? "border-green-500 bg-green-500"
                                    : ""
                                }
                                ${
                                  status === "incorrect"
                                    ? "border-red-500 bg-red-500"
                                    : ""
                                }
                              `}>
                          {(isSelected || status === "correct") && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      ) : (
                        <Checkbox
                          checked={isSelected}
                          disabled={disabled}
                          className={`
                                w-4 h-4
                                ${
                                  status === "correct"
                                    ? "border-green-500 data-[state=checked]:bg-green-500"
                                    : ""
                                }
                                ${
                                  status === "incorrect"
                                    ? "border-red-500 data-[state=checked]:bg-red-500"
                                    : ""
                                }
                              `}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <MathContentRenderer
                        className="text-sm md:text-base prose prose-sm max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                        content={answer.answer_text}
                      />
                    </div>

                    {submitResult && (
                      <div className="shrink-0">
                        {status === "correct" && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {status === "incorrect" && (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </MotionWrapper>
  );
}
