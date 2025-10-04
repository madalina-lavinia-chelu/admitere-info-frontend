"use client";

import { Badge } from "@/components/ui/badge";
import { QuestionFlowQuestion } from "@/requests/question-flow.requests";

interface QuestionInfoContentProps {
  question: QuestionFlowQuestion;
}

export function QuestionInfoContent({ question }: QuestionInfoContentProps) {
  return (
    <div className="space-y-6 py-4">
      {/* Question Type and Difficulty */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Tip și Dificultate
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant={question.type === "single" ? "default" : "secondary"}
            className="text-sm">
            {question.type === "single" ? "Un răspuns" : "Răspunsuri multiple"}
          </Badge>
          <Badge variant="outline" className="text-sm">
            {question.difficulty.name}
          </Badge>
        </div>
      </div>

      {/* Chapters */}
      {question.chapters.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Capitole
          </h3>
          <div className="flex flex-wrap gap-2">
            {question.chapters.map((chapter) => (
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
      {question.source && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Sursă
          </h3>
          <Badge
            variant="outline"
            className="text-sm px-3 py-1 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300">
            {question.source.name}
          </Badge>
        </div>
      )}
    </div>
  );
}
