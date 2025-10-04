"use client";

import { CheckCircle, XCircle } from "lucide-react";
import MotionWrapper from "@/components/ui/motion-wrapper";
import { SubmitAnswerResult } from "@/requests/question-flow.requests";
import { MathContentRenderer } from "../ui/math-content-renderer";

interface ExplanationCardProps {
  submitResult: SubmitAnswerResult;
}

export function ExplanationCard({ submitResult }: ExplanationCardProps) {
  if (!submitResult.explanation) return null;

  return (
    <MotionWrapper type="bounce-in" duration={0.6}>
      <div
        className={`rounded-xl p-4 border ${
          submitResult.is_correct
            ? "bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-green-950/30 border-green-200 dark:border-green-700"
            : "bg-gradient-to-br from-red-50 via-rose-50 to-red-50 dark:from-red-950/30 dark:via-rose-950/30 dark:to-red-950/30 border-red-200 dark:border-red-700"
        }`}>
        <div className="flex items-start gap-3">
          <div
            className={`p-1.5 rounded-lg ${
              submitResult.is_correct
                ? "bg-green-100 dark:bg-green-900/40"
                : "bg-red-100 dark:bg-red-900/40"
            }`}>
            {submitResult.is_correct ? (
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div className="flex-1">
            <p
              className={`font-semibold mb-2 text-sm ${
                submitResult.is_correct
                  ? "text-green-900 dark:text-green-100"
                  : "text-red-900 dark:text-red-100"
              }`}>
              {submitResult.is_correct ? "Răspuns corect!" : "Răspuns incorect"}
            </p>
            <MathContentRenderer
              className={`prose prose-sm leading-relaxed ${
                submitResult.is_correct
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              }`}
              content={submitResult.explanation}
            />
          </div>
        </div>
      </div>
    </MotionWrapper>
  );
}
