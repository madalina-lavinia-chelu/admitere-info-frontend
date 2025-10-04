"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lightbulb, Clock, Info } from "@phosphor-icons/react";
import { useIsMobile } from "@/hooks/use-mobile";
import MotionWrapper from "@/components/ui/motion-wrapper";
import {
  QuestionFlowQuestion,
  QuestionFlowFilters,
} from "@/requests/question-flow.requests";
import { QuestionInfoContent } from "./question-info-content";
import { QuestionReport } from "./question-report";
import { QuestionFilterModal } from "./question-filter-modal";

interface TimerBarProps {
  currentQuestion: QuestionFlowQuestion;
  currentTime: number;
  hintUsed: boolean;
  onUseHint: () => Promise<void>;
  currentFilters: QuestionFlowFilters;
  onFiltersChange: (filters: QuestionFlowFilters) => void;
  availableChapters: Array<{
    id: number;
    name: string;
    parent_id: number | null;
  }>;
  availableDifficulties: Array<{ id: number; name: string }>;
  parentChapterId: number | null;
}

export function TimerBar({
  currentQuestion,
  currentTime,
  hintUsed,
  onUseHint,
  currentFilters,
  onFiltersChange,
  availableChapters,
  availableDifficulties,
  parentChapterId,
}: TimerBarProps) {
  const isMobile = useIsMobile();

  // Format time display
  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <MotionWrapper type="fade-down" duration={0.6}>
      <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-900/30 dark:to-gray-800/30 border-blue-100 dark:border-gray-700">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <Clock
                  size={isMobile ? 24 : 28}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <span className="font-mono text-lg md:text-xl font-semibold text-blue-900 dark:text-blue-100">
                {formatTime(currentTime)}
              </span>
            </div>{" "}
            <div className="flex items-center">
              {/* Filter Modal */}
              <QuestionFilterModal
                currentFilters={currentFilters}
                onFiltersChange={onFiltersChange}
                availableChapters={availableChapters}
                availableDifficulties={availableDifficulties}
                parentChapterId={parentChapterId}
              />
              {/* Question Info Modal - Responsive Dialog/Drawer */}
              {isMobile ? (
                <Drawer>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DrawerTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-auto w-auto p-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg">
                          <Info
                            className="text-blue-600 dark:text-blue-400"
                            style={{
                              width: 24,
                              height: 24,
                            }}
                          />
                        </Button>
                      </DrawerTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Detalii întrebare</p>
                    </TooltipContent>
                  </Tooltip>
                  <DrawerContent className="max-h-[85vh]">
                    <DrawerHeader>
                      <DrawerTitle className="text-xl font-semibold">
                        Informații despre întrebare
                      </DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-4 overflow-y-auto">
                      <QuestionInfoContent question={currentQuestion} />
                    </div>
                  </DrawerContent>
                </Drawer>
              ) : (
                <Dialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-auto w-auto p-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg">
                          <Info
                            className="text-blue-600 dark:text-blue-400"
                            style={{
                              width: isMobile ? 24 : 28,
                              height: isMobile ? 24 : 28,
                            }}
                          />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Detalii întrebare</p>
                    </TooltipContent>
                  </Tooltip>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        Informații despre întrebare
                      </DialogTitle>
                    </DialogHeader>
                    <QuestionInfoContent question={currentQuestion} />
                  </DialogContent>
                </Dialog>
              )}{" "}
              {/* Hint Button */}
              {currentQuestion.hint && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={onUseHint}
                      disabled={hintUsed}
                      className="h-auto w-auto p-2 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg">
                      <Lightbulb
                        className={`${
                          hintUsed
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-amber-500 dark:text-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
                        }`}
                        style={{
                          width: isMobile ? 24 : 28,
                          height: isMobile ? 24 : 28,
                        }}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{hintUsed ? "Hint folosit" : "Folosește hint"}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {/* Question Report Button */}
              <QuestionReport questionId={currentQuestion.id} />
            </div>
          </div>
        </CardContent>
      </Card>
    </MotionWrapper>
  );
}
