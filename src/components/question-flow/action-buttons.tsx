"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SkipForward } from "@phosphor-icons/react";
import MotionWrapper from "@/components/ui/motion-wrapper";
import { SubmitAnswerResult } from "@/requests/question-flow.requests";

interface ActionButtonsProps {
  selectedAnswers: number[];
  submitResult: SubmitAnswerResult | null;
  submitting: boolean;
  onSubmitAnswer: () => Promise<void>;
  onSkipQuestion: () => Promise<void>;
  onNextQuestion: () => Promise<void>;
}

export function ActionButtons({
  selectedAnswers,
  submitResult,
  submitting,
  onSubmitAnswer,
  onSkipQuestion,
  onNextQuestion,
}: ActionButtonsProps) {
  return (
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
  );
}
