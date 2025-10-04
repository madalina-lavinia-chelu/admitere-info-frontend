"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SkipForward } from "@phosphor-icons/react";
import MotionWrapper from "@/components/ui/motion-wrapper";
import { useIsMobile } from "@/hooks/use-mobile";
import { SubmitAnswerResult } from "@/requests/question-flow.requests";

interface MobileActionButtonsProps {
  selectedAnswers: number[];
  submitResult: SubmitAnswerResult | null;
  submitting: boolean;
  onSubmitAnswer: () => Promise<void>;
  onSkipQuestion: () => Promise<void>;
  onNextQuestion: () => Promise<void>;
}

export function MobileActionButtons({
  selectedAnswers,
  submitResult,
  submitting,
  onSubmitAnswer,
  onSkipQuestion,
  onNextQuestion,
}: MobileActionButtonsProps) {
  const isMobile = useIsMobile();

  // Only render on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border p-4 safe-area-pb">
      <div className="max-w-5xl mx-auto pb-4">
        <MotionWrapper type="fade-up" duration={0.3}>
          <div className="flex items-center gap-3">
            {!submitResult ? (
              <>
                <Button
                  onClick={onSubmitAnswer}
                  disabled={selectedAnswers.length === 0 || submitting}
                  className="flex-1 h-12 text-base font-semibold shadow-lg">
                  {submitting ? "Se trimite..." : "Trimite răspunsul"}
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={onSkipQuestion}
                      disabled={submitting}
                      className="h-12 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-lg">
                      <SkipForward
                        style={{
                          width: 22,
                          height: 22,
                        }}
                      />
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
                className="flex-1 h-12 text-base font-semibold shadow-lg">
                Următoarea întrebare
              </Button>
            )}
          </div>
        </MotionWrapper>
      </div>
    </div>
  );
}
