"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import {
  getCurrentQuestionRequest,
  submitAnswerRequest,
  nextQuestionRequest,
  skipQuestionRequest,
  startNewCycleRequest,
  sendUseHintRequest,
  QuestionFlowFilters,
} from "@/requests/question-flow.requests";
import {
  getDifficultiesRequest,
  getChaptersRequest,
} from "@/requests/question.requests";
import { ApiResponseType } from "@/types/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { withoutRevalidateOnFocus } from "@/utils/api.utils";
import {
  QuestionFlowState,
  TimerBar,
  QuestionCard,
  MobileActionButtons,
  CycleCompleted,
  LoadingState,
  EmptyState,
  FreeLimitReached,
} from "./question-flow/index";

export function QuestionFlow() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<QuestionFlowState>({
    currentQuestion: null,
    progress: null,
    sessionStats: null,
    loading: true,
    submitting: false,
    selectedAnswers: [],
    submitResult: null,
    hintUsed: false,
    startTime: Date.now(),
    cycleCompleted: false,
    newCycleAvailable: false,
    freeLimitReached: false,
  });
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [filters, setFilters] = useState<QuestionFlowFilters>({});
  const [parentChapterId, setParentChapterId] = useState<number | null>(null);
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const isMobile = useIsMobile();

  // Fetch chapters and difficulties for filters
  const { data: difficultiesData } = useSWR<ApiResponseType>(
    "difficulties",
    () => getDifficultiesRequest(),
    { ...withoutRevalidateOnFocus }
  );

  const { data: chaptersData } = useSWR<ApiResponseType>(
    "chapters",
    () => getChaptersRequest(),
    { ...withoutRevalidateOnFocus }
  );
  const difficulties = difficultiesData?.data || [];
  const chapters = useMemo(() => chaptersData?.data || [], [chaptersData]);

  // Initialize filters based on URL parameter
  useEffect(() => {
    // Wait for chapters to load before initializing filters
    if (chapters.length === 0 && chaptersData === undefined) {
      return; // Still loading chapters
    }

    const chapterSlug = searchParams.get("chapter");
    if (chapterSlug && chapters.length > 0) {
      // Find the parent chapter by slug
      const parentChapter = chapters.find(
        (chapter: any) =>
          chapter.slug === chapterSlug && chapter.parent_id === null
      );

      if (parentChapter) {
        setParentChapterId(parentChapter.id);
        setFilters((prev) => ({
          ...prev,
          chapter_ids: [parentChapter.id],
        }));
      }
      setFiltersInitialized(true);
    } else {
      // No chapter slug in URL or chapters are loaded - filters are ready
      setFiltersInitialized(true);
    }
  }, [searchParams, chapters, chaptersData]);

  // Simple timer effect
  useEffect(() => {
    if (state.currentQuestion && !state.submitting && !state.submitResult) {
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
  }, [
    state.currentQuestion,
    state.startTime,
    state.submitting,
    state.submitResult,
  ]); // Load initial question
  const loadCurrentQuestion = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    const response: ApiResponseType = await getCurrentQuestionRequest(filters);
    if (!response.error && response.data?.current_question) {
      const { current_question, progress, session_stats } = response.data;

      setState((prev) => ({
        ...prev,
        currentQuestion: current_question,
        progress,
        sessionStats: session_stats,
        selectedAnswers: [],
        submitResult: null,
        hintUsed: false,
        startTime: Date.now(),
        cycleCompleted: false,
        newCycleAvailable: false,
        freeLimitReached: false,
        loading: false,
      }));
      setCurrentTime(0);
    } else {
      // Check if free limit is reached
      const freeLimitReached = response.data?.free_limit_reached || false;

      // Clear any existing question when no questions are available
      setState((prev) => ({
        ...prev,
        currentQuestion: null,
        progress: null,
        sessionStats: null,
        selectedAnswers: [],
        submitResult: null,
        hintUsed: false,
        cycleCompleted: false,
        newCycleAvailable: false,
        freeLimitReached,
        loading: false,
      }));

      if (!freeLimitReached && response.error) {
        toast.error(response.message || "Nu s-au găsit întrebări disponibile");
      }
    }
  }, [filters]);
  // Load question on mount and when filters change, but only after filters are initialized
  useEffect(() => {
    if (filtersInitialized) {
      loadCurrentQuestion();
    }
  }, [loadCurrentQuestion, filtersInitialized]);

  // Handle answer selection
  const handleAnswerSelection = (answerId: number) => {
    setState((prev) => {
      const { currentQuestion, selectedAnswers } = prev;
      if (!currentQuestion) return prev;

      let newSelectedAnswers: number[];

      if (currentQuestion.type === "single") {
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
  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!state.currentQuestion || state.selectedAnswers.length === 0) {
      toast.error("Selectează cel puțin un răspuns");
      return;
    }

    setState((prev) => ({ ...prev, submitting: true }));

    const timeSpent = Math.floor((Date.now() - state.startTime) / 1000);

    const response: ApiResponseType = await submitAnswerRequest(
      {
        question_id: state.currentQuestion.id,
        selected_answer_ids: state.selectedAnswers,
        time_spent: timeSpent,
      },
      filters
    );

    if (!response.error && response.data?.result) {
      const { result, progress, session_stats } = response.data;
      setState((prev) => ({
        ...prev,
        submitResult: result,
        progress,
        sessionStats: session_stats,
        submitting: false,
      }));
    } else {
      toast.error("Eroare la trimiterea răspunsului");
      setState((prev) => ({ ...prev, submitting: false }));
    }
  }; // Move to next question
  const handleNextQuestion = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const response: ApiResponseType = await nextQuestionRequest(filters);

      if (!response.error && response.data) {
        if (response.data.cycle_completed) {
          const freeLimitReached = response.data.free_limit_reached || false;
          setState((prev) => ({
            ...prev,
            cycleCompleted: true,
            newCycleAvailable: response.data.new_cycle_available || false,
            freeLimitReached,
            loading: false,
          }));

          if (!freeLimitReached) {
            toast.success(
              "Felicitări! Ai răspuns la toate întrebările propuse."
            );
          }
        } else if (response.data.current_question) {
          const { current_question, progress, session_stats } = response.data;

          // Reset timer for new question
          const newStartTime = Date.now();

          setState((prev) => ({
            ...prev,
            currentQuestion: current_question,
            progress,
            sessionStats: session_stats,
            selectedAnswers: [],
            submitResult: null,
            hintUsed: false,
            startTime: newStartTime,
            freeLimitReached: false,
            loading: false,
          }));
          setCurrentTime(0);
        } else {
          // Check if free limit is reached
          const freeLimitReached = response.data.free_limit_reached || false;
          setState((prev) => ({
            ...prev,
            freeLimitReached,
            loading: false,
          }));

          if (!freeLimitReached) {
            toast.error("Nu s-au găsit întrebări disponibile");
          }
        }
      } else {
        // Check if free limit is reached in error response
        const freeLimitReached = response.data?.free_limit_reached || false;
        setState((prev) => ({
          ...prev,
          freeLimitReached,
          loading: false,
        }));

        if (!freeLimitReached) {
          toast.error("Nu mai sunt întrebări disponibile");
        }
      }
    } catch (error) {
      console.error("Error in handleNextQuestion:", error);
      toast.error("Eroare la încărcarea următoarei întrebări");
      setState((prev) => ({ ...prev, loading: false }));
    }
  }; // Skip question
  const handleSkipQuestion = async () => {
    if (!state.currentQuestion) return;

    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const response: ApiResponseType = await skipQuestionRequest(
        {
          question_id: state.currentQuestion.id,
        },
        filters
      );

      if (!response.error) {
        toast.success("Întrebare omisă");

        // Update progress and session stats from skip response
        if (response.data?.progress && response.data?.session_stats) {
          setState((prev) => ({
            ...prev,
            progress: response.data.progress,
            sessionStats: response.data.session_stats,
          }));
        }

        // Reset submitting state before calling next question
        setState((prev) => ({ ...prev, submitting: false }));

        // Now get the next question
        await handleNextQuestion();
      } else {
        toast.error("Eroare la omiterea întrebării");
        setState((prev) => ({ ...prev, submitting: false }));
      }
    } catch (error) {
      console.error("Error in handleSkipQuestion:", error);
      toast.error("Eroare la omiterea întrebării");
      setState((prev) => ({ ...prev, submitting: false }));
    }
  };
  // Use hint
  const handleUseHint = async () => {
    if (!state.currentQuestion || state.hintUsed) return;

    const response: ApiResponseType = await sendUseHintRequest(
      {
        question_id: state.currentQuestion.id,
      },
      filters
    );

    if (!response.error) {
      setState((prev) => ({ ...prev, hintUsed: true }));
      toast.success("Hint folosit");
    } else {
      toast.error("Eroare la folosirea hint-ului");
    }
  };
  const handleStartNewCycle = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    const response: ApiResponseType = await startNewCycleRequest(filters);
    if (!response.error && response.data) {
      const { current_question, progress, session_stats } = response.data;

      // Reset timer for new cycle
      const newStartTime = Date.now();

      setState((prev) => ({
        ...prev,
        currentQuestion: current_question,
        progress,
        sessionStats: session_stats,
        selectedAnswers: [],
        submitResult: null,
        hintUsed: false,
        startTime: newStartTime,
        cycleCompleted: false,
        newCycleAvailable: false,
        freeLimitReached: false,
        loading: false,
      }));
      setCurrentTime(0);
      toast.success("Ciclu nou început!");
    } else {
      // Check if free limit is reached
      const freeLimitReached = response.data?.free_limit_reached || false;
      setState((prev) => ({
        ...prev,
        freeLimitReached,
        loading: false,
      }));

      if (!freeLimitReached) {
        toast.error("Eroare la începerea ciclului nou");
      }
    }
  };
  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: QuestionFlowFilters) => {
    setFilters(newFilters);
    // Reset free limit reached when filters change
    setState((prev) => ({ ...prev, freeLimitReached: false }));
  }, []);

  if (state.loading) {
    return <LoadingState />;
  }

  if (state.cycleCompleted) {
    return (
      <CycleCompleted
        sessionStats={state.sessionStats}
        newCycleAvailable={state.newCycleAvailable}
        freeLimitReached={state.freeLimitReached}
        onStartNewCycle={handleStartNewCycle}
      />
    );
  }

  if (state.freeLimitReached) {
    return (
      <FreeLimitReached onRetry={loadCurrentQuestion} showRetryButton={true} />
    );
  }

  if (!state.currentQuestion) {
    return <EmptyState onRetry={loadCurrentQuestion} />;
  }

  return (
    <div className="relative">
      <div
        className={`w-full max-w-5xl mx-auto space-y-3 md:space-y-4 p-2 md:p-6 ${
          isMobile ? "pb-20" : ""
        }`}>
        {" "}
        {/* Timer and Actions Bar */}
        <TimerBar
          currentQuestion={state.currentQuestion}
          currentTime={currentTime}
          hintUsed={state.hintUsed}
          onUseHint={handleUseHint}
          currentFilters={filters}
          onFiltersChange={handleFiltersChange}
          availableChapters={chapters}
          availableDifficulties={difficulties}
          parentChapterId={parentChapterId}
        />{" "}
        {/* Question Card with Answers */}
        <QuestionCard
          question={state.currentQuestion}
          selectedAnswers={state.selectedAnswers}
          submitResult={state.submitResult}
          hintUsed={state.hintUsed}
          submitting={state.submitting}
          onAnswerSelection={handleAnswerSelection}
          onSubmitAnswer={handleSubmitAnswer}
          onSkipQuestion={handleSkipQuestion}
          onNextQuestion={handleNextQuestion}
        />
      </div>{" "}
      {/* Mobile Action Buttons - Sticky at bottom for mobile only */}
      <MobileActionButtons
        selectedAnswers={state.selectedAnswers}
        submitResult={state.submitResult}
        submitting={state.submitting}
        onSubmitAnswer={handleSubmitAnswer}
        onSkipQuestion={handleSkipQuestion}
        onNextQuestion={handleNextQuestion}
      />
    </div>
  );
}
