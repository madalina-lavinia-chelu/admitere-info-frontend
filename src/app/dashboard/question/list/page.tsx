"use client";

import RoleBasedGuard from "@/auth/guard/role-based-guard";
import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import {
  QuestionsDataTable,
  Question,
} from "@/components/questions-data-table";
import { paths } from "@/routes/paths";
import { PERMISSIONS } from "@/utils/permissions.utils";

export default function QuestionsListPage() {
  const handleEditQuestion = (question: Question) => {
    window.open(paths.dashboard.question.edit(question.id), "_blank");
  };

  const handlePreviewQuestion = (question: Question) => {
    window.open(paths.dashboard.question.preview(question.id), "_blank");
  };

  return (
    <RoleBasedGuard permissions={[PERMISSIONS.ADMIN]} hasContent>
      <DashboardPageWrapper
        title="Întrebări"
        subtitle="Gestionați întrebările existente sau adăugați unele noi.">
        <QuestionsDataTable
          onEdit={handleEditQuestion}
          onPreview={handlePreviewQuestion}
        />
      </DashboardPageWrapper>
    </RoleBasedGuard>
  );
}
