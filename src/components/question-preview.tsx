"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import MotionWrapper from "@/components/ui/motion-wrapper";
import { useIsMobile } from "@/hooks/use-mobile";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { Lightbulb, PencilSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import { ApiResponseType } from "@/types/types";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";
import { MathContentRenderer } from "./ui/math-content-renderer";

interface QuestionPreviewProps {
  questionId: string;
  getQuestionRequest: (id: string) => Promise<ApiResponseType>;
}

interface QuestionPreviewState {
  question: any | null;
  loading: boolean;
  selectedAnswers: number[];
  showAnswers: boolean;
  hintUsed: boolean;
}

export function QuestionPreview({
  questionId,
  getQuestionRequest,
}: QuestionPreviewProps) {
  const [state, setState] = useState<QuestionPreviewState>({
    question: null,
    loading: true,
    selectedAnswers: [],
    showAnswers: false,
    hintUsed: false,
  });

  const isMobile = useIsMobile();
  const router = useRouter();

  // Question Information Content Component
  const QuestionInfoContent = () => {
    if (!state.question) return null;

    return (
      <div className="space-y-6 py-4">
        {/* Question Type and Difficulty */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Tip și Dificultate
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={
                state.question.type === "single" ? "default" : "secondary"
              }
              className="text-sm">
              {state.question.type === "single"
                ? "Un răspuns"
                : "Răspunsuri multiple"}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {state.question.difficulty?.name || "N/A"}
            </Badge>
          </div>
        </div>

        {/* Chapters */}
        {state.question.chapters && state.question.chapters.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Capitole
            </h3>
            <div className="flex flex-wrap gap-2">
              {state.question.chapters.map((chapter: any) => (
                <Badge
                  key={chapter.id}
                  variant="outline"
                  className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                  {chapter.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Source */}
        {state.question.source && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Sursă
            </h3>
            <Badge
              variant="outline"
              className="text-sm px-3 py-1 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300">
              {state.question.source.name}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  // Load question
  useEffect(() => {
    const loadQuestion = async () => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const response = await getQuestionRequest(questionId);

        if (!response.error && response.data) {
          setState((prev) => ({
            ...prev,
            question: response.data,
            loading: false,
          }));
        } else {
          toast.error("Nu s-a putut încărca întrebarea");
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Error loading question:", error);
        toast.error("Eroare la încărcarea întrebării");
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    if (questionId) {
      loadQuestion();
    }
  }, [questionId, getQuestionRequest]);

  // Handle answer selection
  const handleAnswerSelection = (answerId: number) => {
    setState((prev) => {
      const { question, selectedAnswers } = prev;
      if (!question) return prev;

      let newSelectedAnswers: number[];

      if (question.type === "single") {
        // Single choice - replace selection
        newSelectedAnswers = [answerId];
      } else {
        // Multiple choice - toggle selection
        if (selectedAnswers.includes(answerId)) {
          newSelectedAnswers = selectedAnswers.filter((id) => id !== answerId);
        } else {
          newSelectedAnswers = [...selectedAnswers, answerId];
        }
      }
      return { ...prev, selectedAnswers: newSelectedAnswers };
    });
  };

  // Show correct answers
  const handleShowAnswers = () => {
    setState((prev) => ({ ...prev, showAnswers: true }));
  };
  // Reset preview
  const handleReset = () => {
    setState((prev) => ({
      ...prev,
      selectedAnswers: [],
      showAnswers: false,
      hintUsed: false,
    }));
  };

  // Navigate to edit page
  const handleEdit = () => {
    router.push(paths.dashboard.question.edit(questionId));
  };

  // Use hint
  const handleUseHint = () => {
    setState((prev) => ({ ...prev, hintUsed: true }));
  };

  // Get answer status for styling
  const getAnswerStatus = (answerId: number, isCorrect: boolean) => {
    if (!state.showAnswers) return "default";

    const isSelected = state.selectedAnswers.includes(answerId);

    if (isCorrect) return "correct";
    if (isSelected && !isCorrect) return "incorrect";
    return "default";
  };

  if (state.loading) {
    return (
      <MotionWrapper type="fade" duration={0.5}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Se încarcă întrebarea...</p>
          </div>
        </div>
      </MotionWrapper>
    );
  }

  if (!state.question) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <MotionWrapper type="fade" duration={0.6} className="w-full max-w-3xl">
          <Card>
            <CardContent className="w-full text-center py-12">
              <MotionWrapper type="bounce-in" duration={0.6} delay={0.2}>
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              </MotionWrapper>
              <MotionWrapper type="fade-up" duration={0.6} delay={0.4}>
                <h3 className="text-lg font-semibold mb-2">
                  Întrebarea nu a fost găsită
                </h3>
                <p className="text-muted-foreground mb-4">
                  Nu s-a putut încărca întrebarea solicitată.
                </p>
              </MotionWrapper>
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`w-full max-w-5xl mx-auto space-y-3 md:space-y-4 p-2 md:p-6 ${
          isMobile ? "pb-20" : ""
        }`}>
        {/* Preview Header */}
        <MotionWrapper type="fade-down" duration={0.6}>
          <Card className="bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-gray-900/30 dark:to-gray-800/30 border-purple-100 dark:border-gray-700">
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <AlertCircle
                      size={isMobile ? 24 : 28}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <span className="font-semibold text-lg md:text-xl text-purple-900 dark:text-purple-100">
                    Previzualizare Întrebare
                  </span>
                </div>

                <div className="flex items-center gap-1">
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
                                  width: isMobile ? 24 : 28,
                                  height: isMobile ? 24 : 28,
                                }}
                              />
                            </Button>
                          </DrawerTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Informații despre întrebare</p>
                        </TooltipContent>
                      </Tooltip>
                      <DrawerContent className="max-h-[85vh]">
                        <DrawerHeader>
                          <DrawerTitle>Informații despre întrebare</DrawerTitle>
                        </DrawerHeader>
                        <div className="px-4 pb-4 overflow-y-auto">
                          <QuestionInfoContent />
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
                          <p>Informații despre întrebare</p>
                        </TooltipContent>
                      </Tooltip>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Informații despre întrebare</DialogTitle>
                        </DialogHeader>
                        <QuestionInfoContent />
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* Hint Button */}
                  {state.question.hint && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={handleUseHint}
                          disabled={state.hintUsed}
                          className="h-auto w-auto p-2 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg">
                          <Lightbulb
                            className={`${
                              state.hintUsed
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
                        <p>
                          {state.hintUsed ? "Hint folosit" : "Folosește hint"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* Question Card */}
        <MotionWrapper type="spring-up" duration={0.8} delay={0.1}>
          <Card className="border-purple-100 dark:border-gray-700 shadow-lg">
            <CardContent className="space-y-4 md:space-y-5 p-4 md:p-6">
              {/* Question Text */}
              <MotionWrapper type="fade-up" duration={0.7} delay={0.2}>
                <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 dark:from-purple-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-purple-200 dark:border-purple-700 rounded-xl p-4 md:p-6">
                  <MathContentRenderer
                    content={state.question.question_text}
                    className="text-base md:text-lg prose prose-blue max-w-none text-gray-900 dark:text-gray-100 leading-relaxed font-medium"
                  />
                </div>
              </MotionWrapper>
              {/* Hint */}
              {state.hintUsed && state.question.hint && (
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
                          content={state.question.hint}
                        />
                      </div>
                    </div>
                  </div>
                </MotionWrapper>
              )}
              <Separator className="my-3 md:my-4" /> {/* Answers */}
              <MotionWrapper type="fade-up" duration={0.8} delay={0.3}>
                <div className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 gap-2 md:gap-3 lg:grid-cols-2">
                    {state.question.answers.map(
                      (answer: any, index: number) => {
                        const isSelected = state.selectedAnswers.includes(
                          answer.id
                        );
                        const status = getAnswerStatus(
                          answer.id,
                          answer.is_correct
                        );
                        const disabled = state.showAnswers;

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
                              onClick={() =>
                                !disabled && handleAnswerSelection(answer.id)
                              }>
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 shrink-0">
                                  {state.question?.type === "single" ? (
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

                                {state.showAnswers && (
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
                      }
                    )}
                  </div>
                </div>
              </MotionWrapper>
              {/* Explanation after showing answers */}
              {state.showAnswers && state.question.explanation && (
                <MotionWrapper type="bounce-in" duration={0.6}>
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm">
                          Explicație
                        </p>
                        <MathContentRenderer
                          className="text-blue-800 dark:text-blue-200 prose prose-sm leading-relaxed"
                          content={state.question.explanation}
                        />
                      </div>
                    </div>
                  </div>
                </MotionWrapper>
              )}{" "}
              {/* Action Buttons - Desktop only */}
              {!isMobile && (
                <MotionWrapper type="fade-up" duration={0.5} delay={0.4}>
                  <div className="flex items-center gap-2 md:gap-3 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
                    {!state.showAnswers ? (
                      <>
                        <Button
                          onClick={handleShowAnswers}
                          disabled={state.selectedAnswers.length === 0}
                          className="flex-1 h-9 md:h-10 text-sm md:text-base font-semibold">
                          Verifică răspunsurile
                        </Button>
                        <Button
                          onClick={handleEdit}
                          variant="outline"
                          className="h-9 md:h-10 px-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                          <PencilSimple className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Editează</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={handleReset}
                          variant="outline"
                          className="flex-1 h-9 md:h-10 text-sm md:text-base font-semibold">
                          Resetează
                        </Button>
                        <Button
                          onClick={handleEdit}
                          variant="outline"
                          className="h-9 md:h-10 px-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                          <PencilSimple className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Editează</span>
                        </Button>
                      </>
                    )}
                  </div>
                </MotionWrapper>
              )}
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>{" "}
      {/* Mobile Sticky Action Buttons */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border p-4 safe-area-pb">
          <div className="max-w-5xl mx-auto pb-4">
            <MotionWrapper type="fade-up" duration={0.3}>
              <div className="flex items-center gap-3">
                {!state.showAnswers ? (
                  <>
                    <Button
                      onClick={handleShowAnswers}
                      disabled={state.selectedAnswers.length === 0}
                      className="flex-1 h-12 text-base font-semibold shadow-lg">
                      Verifică răspunsurile
                    </Button>
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      className="h-12 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-lg">
                      <PencilSimple className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="flex-1 h-12 text-base font-semibold shadow-lg">
                      Resetează
                    </Button>
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      className="h-12 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-lg">
                      <PencilSimple className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>
            </MotionWrapper>
          </div>
        </div>
      )}
    </div>
  );
}
