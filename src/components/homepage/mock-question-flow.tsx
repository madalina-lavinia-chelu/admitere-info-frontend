"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Lightbulb, Clock, ArrowClockwise } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import MotionWrapper from "@/components/ui/motion-wrapper";
import { MathContentRenderer } from "../ui/math-content-renderer";

// Mock data types
interface MockAnswer {
  id: number;
  answer_text: string;
  is_correct: boolean;
}

interface MockQuestion {
  id: number;
  question_text: string;
  hint: string;
  type: "single" | "multiple";
  answers: MockAnswer[];
}

interface MockQuestionState {
  currentQuestion: MockQuestion;
  selectedAnswers: number[];
  submitResult: {
    is_correct: boolean;
    correct_answers: number[];
    explanation: string;
  } | null;
  hintUsed: boolean;
  startTime: number;
  submitting: boolean;
  showDemo: boolean;
}

// Mock question data
const MOCK_QUESTION: MockQuestion = {
  id: 1,
  question_text: `
    <p><strong>Care dintre următoarele afirmații despre vectori (array-uri) în programare sunt corecte?</strong></p>
    <p>Selectează toate răspunsurile corecte:</p>
  `,
  hint: `
    <p><strong>Indiciu:</strong> Vectorii sunt structuri de date care stochează elemente de același tip într-o succesiune ordonată. 
    Gândește-te la proprietățile și operațiile fundamentale cu vectori.</p>
  `,
  type: "multiple",
  answers: [
    {
      id: 1,
      answer_text:
        "Vectorii stochează elemente de același tip de date într-o succesiune ordonată",
      is_correct: true,
    },
    {
      id: 2,
      answer_text:
        "Indexarea elementelor unui vector începe de la 0 în majoritatea limbajelor de programare",
      is_correct: true,
    },
    {
      id: 3,
      answer_text: "Un vector poate stoca doar numere întregi",
      is_correct: false,
    },
    {
      id: 4,
      answer_text:
        "Lungimea unui vector nu poate fi modificată după declarare în toate limbajele",
      is_correct: false,
    },
  ],
};

export function MockQuestionFlow() {
  const [state, setState] = useState<MockQuestionState>({
    currentQuestion: MOCK_QUESTION,
    selectedAnswers: [],
    submitResult: null,
    hintUsed: false,
    startTime: Date.now(),
    submitting: false,
    showDemo: true,
  });

  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Timer effect
  useEffect(() => {
    if (state.showDemo && !state.submitResult) {
      timeIntervalRef.current = setInterval(() => {
        setCurrentTime(Date.now() - state.startTime);
      }, 1000);
    } else {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    }

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, [state.showDemo, state.submitResult, state.startTime]);

  // Handle answer selection
  const handleAnswerSelection = (answerId: number) => {
    if (state.submitResult) return; // Disable after submission

    setState((prev) => {
      const { selectedAnswers } = prev;
      let newSelectedAnswers: number[];

      if (prev.currentQuestion.type === "single") {
        newSelectedAnswers = [answerId];
      } else {
        if (selectedAnswers.includes(answerId)) {
          newSelectedAnswers = selectedAnswers.filter((id) => id !== answerId);
        } else {
          newSelectedAnswers = [...selectedAnswers, answerId];
        }
      }

      return { ...prev, selectedAnswers: newSelectedAnswers };
    });
  };

  // Submit answer (mock)
  const handleSubmitAnswer = () => {
    if (state.selectedAnswers.length === 0) return;

    setState((prev) => ({ ...prev, submitting: true }));

    // Simulate API delay
    setTimeout(() => {
      const correctAnswers = MOCK_QUESTION.answers
        .filter((answer) => answer.is_correct)
        .map((answer) => answer.id);

      const selectedCorrect = state.selectedAnswers.filter((id) =>
        correctAnswers.includes(id)
      );
      const selectedIncorrect = state.selectedAnswers.filter(
        (id) => !correctAnswers.includes(id)
      );

      const isCorrect =
        selectedCorrect.length === correctAnswers.length &&
        selectedIncorrect.length === 0;
      setState((prev) => ({
        ...prev,
        submitResult: {
          is_correct: isCorrect,
          correct_answers: correctAnswers,
          explanation: isCorrect
            ? `<p><strong>Excelent!</strong> Ai răspuns corect. Vectorii sunt într-adevăr structuri de date ordonate care stochează elemente de același tip, iar indexarea începe de la 0 în majoritatea limbajelor.</p>`
            : `<p><strong>Nu quite!</strong> Vectorii pot stoca orice tip de date (nu doar numere întregi), iar în limbaje dinamice lungimea poate fi modificată. Vectorii stochează elemente de același tip într-o succesiune ordonată, cu indexare de la 0.</p>`,
        },
        submitting: false,
      }));
    }, 1000);
  };

  // Use hint
  const handleUseHint = () => {
    setState((prev) => ({ ...prev, hintUsed: true }));
  };

  // Reset demo
  const handleResetDemo = () => {
    setState({
      currentQuestion: MOCK_QUESTION,
      selectedAnswers: [],
      submitResult: null,
      hintUsed: false,
      startTime: Date.now(),
      submitting: false,
      showDemo: true,
    });
    setCurrentTime(0);
  };

  // Format time display
  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Get answer status for styling
  const getAnswerStatus = (answerId: number) => {
    if (!state.submitResult) return "default";

    const isSelected = state.selectedAnswers.includes(answerId);
    const isCorrect = state.submitResult.correct_answers.includes(answerId);

    if (isCorrect) return "correct";
    if (isSelected && !isCorrect) return "incorrect";
    return "default";
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 md:space-y-6">
      {/* Demo Header */}
      <MotionWrapper type="fade-down" duration={0.6}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="animate-pulse">🚀</span>
            Demo interactiv
          </div>
          <h3 className="tracking-tight text-2xl md:text-3xl font-bold mb-2">
            Încearcă platforma chiar acum!
          </h3>
          <p className="text-muted-foreground">
            Răspunde la această întrebare de demonstrare pentru a vedea cum
            funcționează
          </p>
        </div>
      </MotionWrapper>

      {/* Timer and Hint Section */}
      <MotionWrapper type="fade-down" duration={0.6} delay={0.1}>
        <Card>
          <CardContent className="md:py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={20} className="md:w-6 md:h-6" />
                <span className="font-mono text-base md:text-lg font-semibold">
                  {formatTime(currentTime)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      asChild
                      onClick={handleUseHint}
                      disabled={state.hintUsed}
                      className="h-auto w-auto p-1">
                      <Lightbulb
                        size={22}
                        className="md:w-10 md:h-10 hover:text-yellow-500"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Folosește hint-ul</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      asChild
                      onClick={handleResetDemo}
                      className="h-auto w-auto p-1">
                      <ArrowClockwise
                        size={22}
                        className="md:w-10 md:h-10 hover:text-blue-300"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Resetează demo</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionWrapper>

      {/* Question Card */}
      <MotionWrapper type="spring-up" duration={0.8} delay={0.2}>
        <Card className="w-full">
          <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
            {/* Question Text */}
            <MotionWrapper type="fade-up" duration={0.7} delay={0.3}>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 md:p-6">
                <MathContentRenderer
                  className="text-base md:text-lg prose prose-base md:prose-lg max-w-none text-gray-900 dark:text-gray-100 leading-relaxed font-semibold"
                  content={state.currentQuestion.question_text}
                />
              </div>
            </MotionWrapper>
            {/* Hint */}
            {state.hintUsed && (
              <MotionWrapper type="bounce-in" duration={0.6}>
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 md:p-6">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                        Hint
                      </p>
                      <MathContentRenderer
                        className="text-amber-800 dark:text-amber-200 prose prose-sm leading-relaxed"
                        content={state.currentQuestion.hint}
                      />
                    </div>
                  </div>
                </div>
              </MotionWrapper>
            )}
            <Separator className="my-4 md:my-6" /> {/* Answers */}
            <MotionWrapper type="fade-up" duration={0.8} delay={0.4}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {state.currentQuestion.answers.map((answer, index) => {
                  const isSelected = state.selectedAnswers.includes(answer.id);
                  const status = getAnswerStatus(answer.id);
                  const disabled = !!state.submitResult;

                  return (
                    <MotionWrapper
                      key={answer.id}
                      type="fade-up"
                      duration={0.5}
                      delay={0.5 + index * 0.1}>
                      <div
                        className={`
                          group border-2 h-full rounded-xl p-4 md:p-5 cursor-pointer transition-all duration-200 hover:shadow-md
                          ${
                            disabled
                              ? "cursor-not-allowed"
                              : "hover:scale-[1.01]"
                          }
                          ${
                            isSelected && !disabled
                              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500 shadow-lg"
                              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                          }
                          ${
                            status === "correct"
                              ? "border-green-400 bg-green-50 dark:bg-green-900/20 dark:border-green-500 shadow-lg"
                              : ""
                          }
                          ${
                            status === "incorrect"
                              ? "border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500 shadow-lg"
                              : ""
                          }
                        `}
                        onClick={() =>
                          !disabled && handleAnswerSelection(answer.id)
                        }>
                        <div className="flex items-center gap-3">
                          <div className="mt-1 shrink-0">
                            <div
                              className={`
                                w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                                ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-400 dark:border-gray-500 group-hover:border-gray-500 dark:group-hover:border-gray-400"
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
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <MathContentRenderer
                              className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed"
                              content={answer.answer_text}
                            />
                          </div>

                          {state.submitResult && (
                            <div className="shrink-0">
                              {status === "correct" && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                              {status === "incorrect" && (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </MotionWrapper>
                  );
                })}
              </div>
            </MotionWrapper>
            {/* Explanation after answer submission */}
            {state.submitResult && (
              <MotionWrapper type="bounce-in" duration={0.6}>
                <div
                  className={`rounded-xl p-4 md:p-6 border ${
                    state.submitResult.is_correct
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700"
                      : "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-700"
                  }`}>
                  <div className="flex items-start gap-3">
                    {state.submitResult.is_correct ? (
                      <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400 mt-1 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 md:h-6 md:w-6 text-red-600 dark:text-red-400 mt-1 shrink-0" />
                    )}
                    <div>
                      <p
                        className={`font-semibold mb-2 text-base md:text-lg ${
                          state.submitResult.is_correct
                            ? "text-green-900 dark:text-green-100"
                            : "text-red-900 dark:text-red-100"
                        }`}>
                        {state.submitResult.is_correct
                          ? "Răspuns corect!"
                          : "Răspuns incorect"}
                      </p>
                      <MathContentRenderer
                        className={`prose prose-sm md:prose-base leading-relaxed ${
                          state.submitResult.is_correct
                            ? "text-green-800 dark:text-green-200"
                            : "text-red-800 dark:text-red-200"
                        }`}
                        content={state.submitResult.explanation}
                      />
                    </div>
                  </div>
                </div>
              </MotionWrapper>
            )}
            {/* Action Buttons */}
            <MotionWrapper type="fade-up" duration={0.5} delay={0.5}>
              <div className="flex items-center gap-3 pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
                {!state.submitResult ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={
                      state.selectedAnswers.length === 0 || state.submitting
                    }
                    className="flex-1 h-10 md:h-12 text-sm md:text-base font-semibold">
                    {state.submitting ? "Se verifică..." : "Verifică răspunsul"}
                  </Button>
                ) : (
                  <div className="flex-1 flex flex-col md:flex-row gap-3">
                    <Button
                      onClick={handleResetDemo}
                      variant="outline"
                      className="flex-1 h-10 md:h-12 text-sm md:text-base font-semibold">
                      Încearcă din nou
                    </Button>
                    <Button
                      asChild
                      className="flex-1 h-10 md:h-12 text-sm md:text-base font-semibold">
                      <a href="/auth/signup">Creează cont gratuit</a>
                    </Button>
                  </div>
                )}
              </div>
            </MotionWrapper>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  );
}
