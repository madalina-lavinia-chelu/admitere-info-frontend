"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MotionWrapper from "@/components/ui/motion-wrapper";
import {
  CheckCircle,
  XCircle,
  SkipForward,
  Clock,
  Lightbulb,
  RotateCcw,
  Eye,
  Crown,
  Zap,
  Star,
  BarChart3,
} from "lucide-react";
import {
  getHistoryRequest,
  UserQuestionHistory,
  HistoryApiResponse,
  HistorySearchPayload,
} from "@/requests/question-flow.requests";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";
import { MathContentRenderer } from "./ui/math-content-renderer";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";

interface HistoryFlowState {
  history: UserQuestionHistory[];
  loading: boolean;
  loadingMore: boolean;
  hasNextPage: boolean;
  currentPage: number;
  totalItems: number;
  error: string | null;
  filters: HistorySearchPayload;
}

interface HistoryCardProps {
  item: any;
  index: number;
}

function HistoryCard({ item, index }: HistoryCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  console.log(item);
  const getStatusConfig = () => {
    if (item.user_answer.is_skipped) {
      return {
        icon: SkipForward,
        color: "text-muted-foreground",
        bgColor: "bg-muted/50",
        text: "Omis",
        variant: "secondary" as const,
      };
    }
    if (item.user_answer.is_correct) {
      return {
        icon: CheckCircle,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-950/30",
        text: "Corect",
        variant: "default" as const,
      };
    }
    return {
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      text: "Incorect",
      variant: "destructive" as const,
    };
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <MotionWrapper type="spring-up" duration={0.5} delay={index * 0.05}>
      <Card
        className={cn(
          "relative overflow-hidden transition-all hover:shadow-md",
          status.bgColor
        )}>
        {" "}
        <div
          className={`absolute left-0 top-0 w-1 h-full ${
            status.color.includes("green")
              ? "bg-green-500 dark:bg-green-400"
              : status.color.includes("red")
              ? "bg-red-500 dark:bg-red-400"
              : "bg-muted-foreground"
          }`}
        />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon className={cn("h-5 w-5", status.color)} />
              <Badge variant={status.variant} className="font-medium">
                {status.text}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Ciclul {item.cycle}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="tracking-tight">
                {formatTime(item.user_answer.time_spent)}
              </span>
              {item.user_answer.is_hint_used && (
                <>
                  <Lightbulb className="h-4 w-4 ml-2" />
                  <p className="tracking-tight">Folosit</p>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Question Preview */}
          <div>
            <div
              className="text-sm leading-relaxed cursor-pointer"
              onClick={() => setShowDetails(!showDetails)}>
              <MathContentRenderer content={item.question.question_text} />
            </div>

            {!showDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(true)}
                className="mt-2 h-8 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Vezi detalii
              </Button>
            )}
          </div>{" "}
          {/* Question Meta */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/50">
              {item.question.difficulty.name}
            </Badge>

            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/50">
              {item.question.type === "single"
                ? "Un răspuns"
                : "Răspunsuri multiple"}
            </Badge>

            {item.question.source && (
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800/50">
                {item.question.source.name}
              </Badge>
            )}

            {item.question.chapters.length > 0 && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800/50">
                {item.question.chapters.map((c: any) => c.name).join(", ")}
              </Badge>
            )}
          </div>
          {/* Expanded Details */}
          {showDetails && (
            <MotionWrapper type="fade" duration={0.3}>
              <div className="space-y-3 pt-3 border-t">
                {/* Answers */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Răspunsuri:</h4>
                  <div className="space-y-1">
                    {item.question.answers.map((answer: any) => {
                      const isSelected =
                        item.user_answer.selected_answer_ids.includes(
                          answer.id
                        );
                      const isCorrect = answer.is_correct;

                      return (
                        <div
                          key={answer.id}
                          className={cn(
                            "p-2 rounded text-xs",
                            isCorrect &&
                              "bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800/50",
                            isSelected &&
                              !isCorrect &&
                              "bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800/50",
                            !isCorrect && !isSelected && "bg-muted/50"
                          )}>
                          {" "}
                          <div className="flex items-center gap-2">
                            {isCorrect && (
                              <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                            )}
                            {isSelected && !isCorrect && (
                              <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                            )}
                            <MathContentRenderer content={answer.answer_text} />
                            {isSelected && (
                              <Badge
                                variant="outline"
                                className="ml-auto text-xs">
                                Selectat
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>{" "}
                {/* Explanation */}
                {item.question.explanation && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Explicație:</h4>
                    <MathContentRenderer
                      className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/30 p-3 rounded border-l-4 border-blue-200 dark:border-blue-800"
                      content={item.question.explanation}
                    />
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="h-8 text-xs">
                  Ascunde detalii
                </Button>
              </div>
            </MotionWrapper>
          )}{" "}
          {/* Timestamp */}
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Răspuns oferit{" "}
            {formatDistanceToNow(new Date(item.user_answer.answered_at), {
              addSuffix: true,
              locale: ro,
            })}
          </div>
        </CardContent>
      </Card>
    </MotionWrapper>
  );
}

export function HistoryFlow() {
  const user = useAppSelector((state) => state.auth.user as any);
  const isPro =
    user?.subscription_info?.subscription_type === "pro" || user?.isPro;

  const [state, setState] = useState<HistoryFlowState>({
    history: [],
    loading: true,
    loadingMore: false,
    hasNextPage: false,
    currentPage: 1,
    totalItems: 0,
    error: null,
    filters: { per_page: 10 },
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  const loadHistory = useCallback(
    async (page = 1, append = false) => {
      try {
        if (page === 1) {
          setState((prev) => ({ ...prev, loading: true, error: null }));
        } else {
          setState((prev) => ({ ...prev, loadingMore: true }));
        }

        const payload: HistorySearchPayload = {
          ...state.filters,
          page,
        };
        const response = await getHistoryRequest(payload);

        if (response.error) {
          throw new Error(response.message);
        }
        const data = response.data as HistoryApiResponse;

        console.log(data.history);

        setState((prev) => ({
          ...prev,
          history: append ? [...prev.history, ...data.history] : data.history,
          loading: false,
          loadingMore: false,
          hasNextPage: page < data.pagination.last_page,
          currentPage: page,
          totalItems: data.pagination.total,
          error: null,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Eroare la încărcarea istoricului";
        toast.error(errorMessage);
        setState((prev) => ({
          ...prev,
          loading: false,
          loadingMore: false,
          error: errorMessage,
        }));
      }
    },
    [state.filters]
  );

  const loadMore = useCallback(() => {
    if (!state.loadingMore && state.hasNextPage) {
      loadHistory(state.currentPage + 1, true);
    }
  }, [state.loadingMore, state.hasNextPage, state.currentPage, loadHistory]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && state.hasNextPage && !state.loadingMore) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, state.hasNextPage, state.loadingMore]);

  // Initial load
  useEffect(() => {
    if (isPro) {
      loadHistory(1);
    }
  }, [loadHistory, isPro]);

  // If user is not pro, show the pro feature modal
  if (!isPro) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <ProFeatureModal />
      </div>
    );
  }

  const handleRefresh = () => {
    setState((prev) => ({
      ...prev,
      currentPage: 1,
      hasNextPage: false,
    }));
    loadHistory(1);
  };

  if (state.loading && state?.history?.length === 0) {
    return (
      <MotionWrapper type="fade" duration={0.5}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Se încarcă istoricul...</p>
          </div>
        </div>
      </MotionWrapper>
    );
  }

  if (state.error && state?.history?.length === 0) {
    return (
      <MotionWrapper type="fade" duration={0.6}>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Eroare la încărcare</h3>
            <p className="text-muted-foreground mb-4">{state.error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Încearcă din nou
            </Button>
          </CardContent>
        </Card>
      </MotionWrapper>
    );
  }

  if (state?.history?.length === 0) {
    return (
      <MotionWrapper type="fade" duration={0.6}>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nu există istoric disponibil
            </h3>
            <p className="text-muted-foreground">
              Începe să răspunzi la întrebări pentru a vedea istoricul tău.
            </p>
          </CardContent>
        </Card>
      </MotionWrapper>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <MotionWrapper type="fade-down" duration={0.6}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={state.loading}>
              <RotateCcw
                className={cn("h-4 w-4 mr-2", state.loading && "animate-spin")}
              />
              Reîmprospătează
            </Button>
          </div>
        </div>
      </MotionWrapper>

      {/* History Cards */}
      <div className="space-y-4">
        {state?.history?.map((item, index) => (
          <HistoryCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* Loading More Indicator */}
      {state.loadingMore && (
        <MotionWrapper type="fade" duration={0.3}>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">
                Se încarcă mai multe...
              </p>
            </div>
          </div>
        </MotionWrapper>
      )}

      {/* Observer target for infinite scroll */}
      <div ref={observerTarget} className="h-4" />

      {/* End of list indicator */}
      {!state.hasNextPage && state?.history?.length > 0 && (
        <MotionWrapper type="fade" duration={0.3}>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Ai ajuns la sfârșitul istoricului
            </p>
          </div>
        </MotionWrapper>
      )}
    </div>
  );
}

// Pro Feature Modal Component
function ProFeatureModal() {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push(paths.dashboard.subscription);
  };

  return (
    <MotionWrapper
      type="scale"
      duration={0.6}
      className="w-full max-w-md mx-auto">
      <Card className="text-center">
        <CardHeader className="pb-4">
          <MotionWrapper type="bounce-in" duration={0.8} delay={0.2}>
            <div className="mx-auto mb-4 p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full w-fit">
              <BarChart3 className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
          </MotionWrapper>
          <MotionWrapper type="fade-up" duration={0.6} delay={0.4}>
            <h3 className="text-xl font-bold">
              Istoric întrebări - Funcție Pro
            </h3>
          </MotionWrapper>
        </CardHeader>
        <CardContent className="space-y-6">
          <MotionWrapper type="fade-up" duration={0.6} delay={0.6}>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Vezi istoricul complet al întrebărilor la care ai răspuns, cu
              detalii despre corectitudinea răspunsurilor și timpul petrecut.
            </p>
          </MotionWrapper>

          {/* Pro Benefits */}
          <MotionWrapper type="fade-up" duration={0.6} delay={0.8}>
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Cu Pro ai acces la:</h4>
              <div className="space-y-2">
                <MotionWrapper type="slide-left" duration={0.5} delay={1.0}>
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="h-4 w-4 text-amber-500" />
                    <span>Istoric complet al răspunsurilor</span>
                  </div>
                </MotionWrapper>
                <MotionWrapper type="slide-left" duration={0.5} delay={1.1}>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>Statistici detaliate de performanță</span>
                  </div>
                </MotionWrapper>
                <MotionWrapper type="slide-left" duration={0.5} delay={1.2}>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>Acces nelimitat la toate întrebările</span>
                  </div>
                </MotionWrapper>
              </div>
            </div>
          </MotionWrapper>

          {/* Action Button */}
          <MotionWrapper type="spring-up" duration={0.6} delay={1.3}>
            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              size="lg">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade la Pro
            </Button>
          </MotionWrapper>

          <MotionWrapper type="fade-up" duration={0.5} delay={1.4}>
            <p className="text-xs text-muted-foreground">
              Începând de la doar 10 lei/lună
            </p>
          </MotionWrapper>
        </CardContent>
      </Card>
    </MotionWrapper>
  );
}

export default HistoryFlow;
