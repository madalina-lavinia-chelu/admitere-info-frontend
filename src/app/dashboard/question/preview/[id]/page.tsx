"use client";

import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import { QuestionPreview } from "@/components/question-preview";
import { useParams } from "next/navigation";
import { getAllQuestionsRequest } from "@/requests/question.requests";
import RoleBasedGuard from "@/auth/guard/role-based-guard";
import { PERMISSIONS } from "@/utils/permissions.utils";

export default function Page() {
  const { id }: { id: string } = useParams();

  // Create a wrapper function that matches the expected signature
  const getQuestionRequest = async (questionId: string) => {
    return getAllQuestionsRequest({ id: Number(questionId) });
  };

  return (
    <RoleBasedGuard permissions={[PERMISSIONS.ADMIN]} hasContent>
      <DashboardPageWrapper
        title="Previzualizare întrebare"
        subtitle="Vizualizează și testează întrebarea înainte de publicare.">
        <QuestionPreview
          questionId={id}
          getQuestionRequest={getQuestionRequest}
        />
      </DashboardPageWrapper>
    </RoleBasedGuard>
  );
}
