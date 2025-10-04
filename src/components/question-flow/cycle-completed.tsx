"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import MotionWrapper from "@/components/ui/motion-wrapper";
import { SessionStats } from "@/requests/question-flow.requests";
import { FreeLimitReached } from "./free-limit-reached";

interface CycleCompletedProps {
  sessionStats: SessionStats | null;
  newCycleAvailable: boolean;
  freeLimitReached?: boolean;
  onStartNewCycle: () => Promise<void>;
}

export function CycleCompleted({
  sessionStats,
  newCycleAvailable,
  freeLimitReached = false,
  onStartNewCycle,
}: CycleCompletedProps) {
  // If free limit is reached, show the upgrade prompt instead
  if (freeLimitReached) {
    return (
      <FreeLimitReached
        title="Limita întrebărilor gratuite a fost atinsă"
        description="Ai consumat toate întrebările gratuite disponibile. Pentru a continua cu un ciclu nou, ai nevoie de un abonament Pro."
        showRetryButton={false}
      />
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <MotionWrapper type="scale" duration={0.8} className="w-full max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <MotionWrapper type="bounce-in" duration={0.6} delay={0.2}>
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </MotionWrapper>
            <MotionWrapper type="fade-up" duration={0.6} delay={0.4}>
              <CardTitle className="text-2xl mb-1 text-green-700">
                Ai răspuns la toate întrebările!
              </CardTitle>
              <p className="text-muted-foreground">
                Felicitări! Ai răspuns toate întrebările din propuse. Începe din
                nou să răspunzi la întrebări într-o altă ordine.
              </p>
            </MotionWrapper>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {sessionStats && (
              <MotionWrapper type="fade-up" duration={0.6} delay={0.6}>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {sessionStats.correct_answers}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Răspunsuri corecte
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(sessionStats.accuracy_percentage)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Acuratețe</p>
                  </div>
                </div>
              </MotionWrapper>
            )}

            {newCycleAvailable && (
              <MotionWrapper type="spring-up" duration={0.6} delay={0.8}>
                <Button className="w-full" onClick={onStartNewCycle}>
                  Începe Ciclu Nou
                </Button>
              </MotionWrapper>
            )}
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  );
}
