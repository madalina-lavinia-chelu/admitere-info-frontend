"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lightbulb, SkipForward } from "@phosphor-icons/react";
import MotionWrapper from "@/components/ui/motion-wrapper";
import {
  QuestionFlowQuestion,
  SubmitAnswerResult,
} from "@/requests/question-flow.requests";
import { AnswersList } from "./answers-list";
import { ExplanationCard } from "./explanation-card";
import { MathContentRenderer } from "@/components/ui/math-content-renderer";

interface QuestionCardProps {
  question: QuestionFlowQuestion;
  selectedAnswers: number[];
  submitResult: SubmitAnswerResult | null;
  hintUsed: boolean;
  submitting: boolean;
  onAnswerSelection: (answerId: number) => void;
  onSubmitAnswer: () => Promise<void>;
  onSkipQuestion: () => Promise<void>;
  onNextQuestion: () => Promise<void>;
}

export function QuestionCard({
  question,
  selectedAnswers,
  submitResult,
  hintUsed,
  submitting,
  onAnswerSelection,
  onSubmitAnswer,
  onSkipQuestion,
  onNextQuestion,
}: QuestionCardProps) {
  return (
    <MotionWrapper type="spring-up" duration={0.8} delay={0.1}>
      <Card className="border-blue-100 dark:border-gray-700 shadow-lg">
        <CardContent className="space-y-4 md:space-y-5 p-4 md:p-6">
          {" "}
          {/* Question Text */}
          <MotionWrapper type="fade-up" duration={0.7} delay={0.2}>
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 border border-blue-200  rounded-xl p-4 md:p-6">
              <MathContentRenderer
                content={question.question_text}
                className="text-base md:text-lg prose prose-blue max-w-none text-gray-900 dark:text-gray-100 leading-relaxed font-medium"
              />
            </div>
          </MotionWrapper>
          {/* Hint */}
          {hintUsed && question.hint && (
            <MotionWrapper type="bounce-in" duration={0.6}>
              <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-amber-950/30 border border-amber-200 dark:border-amber-700 rounded-xl p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2 text-sm">
                      Hint
                    </p>
                    <MathContentRenderer
                      className="text-amber-800 dark:text-amber-200 prose prose-sm leading-relaxed"
                      content={question.hint}
                    />
                  </div>
                </div>
              </div>
            </MotionWrapper>
          )}{" "}
          <Separator className="my-3 md:my-4" />
          {/* Answers */}
          <AnswersList
            question={question}
            selectedAnswers={selectedAnswers}
            submitResult={submitResult}
            onAnswerSelection={onAnswerSelection}
          />
          {/* Explanation after answer submission - above action buttons */}
          {submitResult && (
            <MotionWrapper type="bounce-in" duration={0.6}>
              <div className="pt-3 md:pt-4">
                <ExplanationCard submitResult={submitResult} />
              </div>
            </MotionWrapper>
          )}
          {/* Action Buttons - Desktop only, embedded in card */}
          <div className="hidden md:block">
            <MotionWrapper type="fade-up" duration={0.5} delay={0.4}>
              <div className="flex items-center gap-2 md:gap-3 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
                {!submitResult ? (
                  <>
                    <Button
                      onClick={onSubmitAnswer}
                      disabled={selectedAnswers.length === 0 || submitting}
                      className="flex-1 h-9 md:h-10 text-sm md:text-base font-semibold">
                      {submitting ? "Se trimite..." : "Trimite răspunsul"}
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onSkipQuestion}
                          disabled={submitting}
                          className="h-9 md:h-10 px-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                          <SkipForward
                            style={{
                              width: 24,
                              height: 24,
                            }}
                            className="mr-1"
                          />
                          <span className="hidden sm:inline">Skip</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Omite întrebarea</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                ) : (
                  <Button
                    onClick={onNextQuestion}
                    className="flex-1 h-9 md:h-10 text-sm md:text-base font-semibold">
                    Următoarea întrebare
                  </Button>
                )}
              </div>
            </MotionWrapper>
          </div>
        </CardContent>
      </Card>
    </MotionWrapper>
  );
}
