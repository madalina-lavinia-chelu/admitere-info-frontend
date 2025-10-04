"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MotionWrapper from "@/components/ui/motion-wrapper";
import {
  Target,
  CheckCircle,
  XCircle,
  SkipForward,
  Clock,
  Lightbulb,
  TrendingUp,
  Crown,
  Lock,
  BarChart3,
  Zap,
} from "lucide-react";
import {
  getAnalyticsRequest,
  OverallStats,
} from "@/requests/question-flow.requests";
import { ApiResponseType } from "@/types/types";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";

interface StatsFlowState {
  overallStats: OverallStats | null;
  loading: boolean;
}

function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  gradient,
  delay = 0,
  isPro = false,
  blurred = false,
}: {
  title: string;
  value: string | number;
  icon: any;
  description: string;
  gradient: string;
  delay?: number;
  isPro?: boolean;
  blurred?: boolean;
}) {
  return (
    <MotionWrapper type="spring-up" duration={0.6} delay={delay}>
      <Card className="relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-5`}
        />
        {blurred && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
            {isPro && <Crown className="h-3 w-3 text-amber-500 ml-1 inline" />}
          </CardTitle>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">
            {blurred ? "•••" : value}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </MotionWrapper>
  );
}

function AccuracyCard({
  accuracy,
  delay = 0,
  blurred = false,
}: {
  accuracy: number;
  delay?: number;
  blurred?: boolean;
}) {
  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return "text-green-600";
    if (acc >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getAccuracyGradient = (acc: number) => {
    if (acc >= 80) return "from-green-500 to-emerald-500";
    if (acc >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  return (
    <MotionWrapper type="spring-up" duration={0.6} delay={delay}>
      <Card className="relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${getAccuracyGradient(
            accuracy
          )} opacity-5`}
        />
        {blurred && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Acuratețe Generală
            <Crown className="h-3 w-3 text-amber-500 ml-1 inline" />
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-bold mb-1 ${
              blurred ? "text-muted-foreground" : getAccuracyColor(accuracy)
            }`}>
            {blurred ? "••%" : `${accuracy.toFixed(1)}%`}
          </div>
          <p className="text-xs text-muted-foreground">
            {blurred
              ? "Doar pentru utilizatorii Pro"
              : accuracy >= 80
              ? "Performanță excelentă!"
              : accuracy >= 60
              ? "Performanță bună"
              : "Poate fi îmbunătățită"}
          </p>
        </CardContent>
      </Card>
    </MotionWrapper>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

export function StatsFlow() {
  const user = useAppSelector((state) => state.auth.user as any);
  const isPro =
    user?.subscription_info?.subscription_type === "pro" || user?.isPro;
  const router = useRouter();

  const [state, setState] = useState<StatsFlowState>({
    overallStats: null,
    loading: true,
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const response: ApiResponseType = await getAnalyticsRequest();

        if (!response.error && response.data?.overall_stats) {
          setState((prev) => ({
            ...prev,
            overallStats: response.data.overall_stats,
            loading: false,
          }));
        } else {
          toast.error("Eroare la încărcarea statisticilor");
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch {
        toast.error("Eroare la încărcarea statisticilor");
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    loadAnalytics();
  }, []);

  if (state.loading) {
    return (
      <MotionWrapper type="fade" duration={0.5}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Se încarcă statisticile...</p>
          </div>
        </div>
      </MotionWrapper>
    );
  }

  if (!state.overallStats) {
    return (
      <MotionWrapper type="fade" duration={0.6}>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nu există statistici disponibile
            </h3>
            <p className="text-muted-foreground">
              Începe să răspunzi la întrebări pentru a vedea statisticile tale.
            </p>
          </CardContent>
        </Card>
      </MotionWrapper>
    );
  }

  const stats = state.overallStats;

  return (
    <div className="space-y-8">
      {/* Header Cards */}
      <MotionWrapper type="fade-down" duration={0.6}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Întrebări"
            value={stats.total_questions_attempted}
            icon={Target}
            description="Întrebări încercate"
            gradient="from-blue-500 to-indigo-500"
            delay={0.1}
          />

          <StatsCard
            title="Răspunsuri Corecte"
            value={stats.total_correct}
            icon={CheckCircle}
            description="Răspunsuri exacte"
            gradient="from-green-500 to-emerald-500"
            delay={0.2}
          />

          <StatsCard
            title="Răspunsuri Greșite"
            value={stats.total_incorrect}
            icon={XCircle}
            description="Necesită îmbunătățire"
            gradient="from-red-500 to-rose-500"
            delay={0.3}
            isPro={true}
            blurred={!isPro}
          />

          <StatsCard
            title="Întrebări Omise"
            value={stats.total_skipped}
            icon={SkipForward}
            description="Sărite peste"
            gradient="from-gray-500 to-slate-500"
            delay={0.4}
            isPro={true}
            blurred={!isPro}
          />
        </div>
      </MotionWrapper>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AccuracyCard
          accuracy={stats.overall_accuracy}
          delay={0.5}
          blurred={!isPro}
        />

        <StatsCard
          title="Timp Total"
          value={formatTime(stats.total_time_spent)}
          icon={Clock}
          description="Timp petrecut învățând"
          gradient="from-purple-500 to-violet-500"
          delay={0.6}
          isPro={true}
          blurred={!isPro}
        />

        <StatsCard
          title="Hint-uri Folosite"
          value={stats.total_hints_used}
          icon={Lightbulb}
          description="Ajutoare solicitate"
          gradient="from-amber-500 to-yellow-500"
          delay={0.7}
          isPro={true}
          blurred={!isPro}
        />
      </div>

      {/* Summary Card - Only show for Pro users */}
      {isPro && (
        <MotionWrapper type="spring-up" duration={0.8} delay={0.8}>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-xl text-blue-900 dark:text-blue-100 flex items-center gap-2">
                Rezumat Performanță
                <Crown className="h-5 w-5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Progres General
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                    Ai răspuns la{" "}
                    <strong>{stats.total_questions_attempted}</strong>{" "}
                    întrebări, cu o acuratețe de{" "}
                    <strong>{stats.overall_accuracy.toFixed(1)}%</strong>.
                    Continuă să practici pentru a-ți îmbunătăți rezultatele!
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Timpul de Studiu
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                    Ai petrecut{" "}
                    <strong>{formatTime(stats.total_time_spent)}</strong>{" "}
                    învățând și ai folosit{" "}
                    <strong>{stats.total_hints_used}</strong> hint-uri pentru
                    a-ți facilita înțelegerea conceptelor.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>
      )}

      {/* Pro Upgrade Card for Free Users */}
      {!isPro && (
        <div className="flex items-center justify-center">
          <MotionWrapper type="scale" duration={0.6} className="w-full max-w-md">
            <Card className="text-center">
              <CardHeader className="pb-4">
                <MotionWrapper type="bounce-in" duration={0.8} delay={0.2}>
                  <div className="mx-auto mb-4 p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full w-fit">
                    <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                </MotionWrapper>
                <MotionWrapper type="fade-up" duration={0.6} delay={0.4}>
                  <h3 className="text-xl font-bold">Statistici complete - Funcție Pro</h3>
                </MotionWrapper>
              </CardHeader>
              <CardContent className="space-y-6">
                <MotionWrapper type="fade-up" duration={0.6} delay={0.6}>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Vezi statistici detaliate, analiza performanței în timp și
                    multe altele pentru a-ți îmbunătăți rezultatele.
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
                          <span>Statistici detaliate complete</span>
                        </div>
                      </MotionWrapper>
                      <MotionWrapper type="slide-left" duration={0.5} delay={1.1}>
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span>Analiza performanței în timp</span>
                        </div>
                      </MotionWrapper>
                      <MotionWrapper type="slide-left" duration={0.5} delay={1.2}>
                        <div className="flex items-center gap-2 text-sm">
                          <Crown className="h-4 w-4 text-amber-500" />
                          <span>Istoric complet și progres</span>
                        </div>
                      </MotionWrapper>
                    </div>
                  </div>
                </MotionWrapper>

                {/* Action Button */}
                <MotionWrapper type="spring-up" duration={0.6} delay={1.3}>
                  <Button
                    onClick={() => router.push(paths.dashboard.subscription)}
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
        </div>
      )}
    </div>
  );
}
