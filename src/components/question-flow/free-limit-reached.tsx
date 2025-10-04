"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Zap, Star, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";
import MotionWrapper from "@/components/ui/motion-wrapper";

interface FreeLimitReachedProps {
  onRetry?: () => void;
  showRetryButton?: boolean;
  title?: string;
  description?: string;
}

export function FreeLimitReached({
  onRetry,
  showRetryButton = false,
  title = "Limita întrebărilor gratuite a fost atinsă",
  description = "Ai consumat toate întrebările gratuite disponibile pentru astăzi. Upgrade la Pro pentru acces nelimitat la toate întrebările.",
}: FreeLimitReachedProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push(paths.dashboard.subscription);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <MotionWrapper type="scale" duration={0.6} className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <MotionWrapper type="bounce-in" duration={0.8} delay={0.2}>
              <div className="mx-auto mb-4 p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full w-fit">
                <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </MotionWrapper>
            <MotionWrapper type="fade-up" duration={0.6} delay={0.4}>
              <CardTitle className="text-xl font-bold">{title}</CardTitle>
            </MotionWrapper>
          </CardHeader>
          <CardContent className="space-y-6">
            <MotionWrapper type="fade-up" duration={0.6} delay={0.6}>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </MotionWrapper>

            {/* Pro Benefits */}
            <MotionWrapper type="fade-up" duration={0.6} delay={0.8}>
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Cu Pro ai acces la:</h4>
                <div className="space-y-2">
                  <MotionWrapper type="slide-left" duration={0.5} delay={1.0}>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span>Întrebări nelimitate</span>
                    </div>
                  </MotionWrapper>
                  <MotionWrapper type="slide-left" duration={0.5} delay={1.1}>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span>Acces la toate capitolele</span>
                    </div>
                  </MotionWrapper>
                  <MotionWrapper type="slide-left" duration={0.5} delay={1.2}>
                    <div className="flex items-center gap-2 text-sm">
                      <Crown className="h-4 w-4 text-amber-500" />
                      <span>Statistici avansate</span>
                    </div>
                  </MotionWrapper>
                </div>
              </div>
            </MotionWrapper>

            {/* Action Buttons */}
            <MotionWrapper type="spring-up" duration={0.6} delay={1.3}>
              <div className="space-y-3">
                <Button
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  size="lg">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade la Pro
                </Button>

                {showRetryButton && onRetry && (
                  <MotionWrapper type="fade-up" duration={0.4} delay={1.5}>
                    <Button
                      onClick={onRetry}
                      variant="outline"
                      className="w-full"
                      size="sm">
                      Încearcă din nou
                    </Button>
                  </MotionWrapper>
                )}
              </div>
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
  );
}
