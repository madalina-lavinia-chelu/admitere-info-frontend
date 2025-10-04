"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import MotionWrapper from "@/components/ui/motion-wrapper";

interface EmptyStateProps {
  onRetry: () => void;
}

export function EmptyState({ onRetry }: EmptyStateProps) {
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
                Nu sunt întrebări disponibile
              </h3>
              <p className="text-muted-foreground mb-4">
                Nu s-au găsit întrebări pentru filtrele selectate.
              </p>
              <Button onClick={onRetry}>Încearcă din nou</Button>
            </MotionWrapper>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  );
}
