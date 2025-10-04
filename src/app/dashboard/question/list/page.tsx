"use client";

import RoleBasedGuard from "@/auth/guard/role-based-guard";
import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import {
  QuestionsDataTable,
  Question,
} from "@/components/questions-data-table";
import { paths } from "@/routes/paths";
import { PERMISSIONS } from "@/utils/permissions.utils";
import { useRouter } from "next/navigation";

export default function QuestionsListPage() {
  const router = useRouter();

  const handleEditQuestion = (question: Question) => {
    router.push(paths.dashboard.question.edit(question.id));
  };

  return (
    <RoleBasedGuard permissions={[PERMISSIONS.ADMIN]} hasContent>
      <DashboardPageWrapper
        title="Întrebări"
        subtitle="Gestionați întrebările existente sau adăugați unele noi.">
        <QuestionsDataTable onEdit={handleEditQuestion} />
      </DashboardPageWrapper>
    </RoleBasedGuard>
  );
}
