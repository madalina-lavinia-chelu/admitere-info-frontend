import RoleBasedGuard from "@/auth/guard/role-based-guard";
import { FeedbackReportsDataTable } from "@/components/feedback-reports-data-table";
import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import { PERMISSIONS } from "@/utils/permissions.utils";

export default function Page() {
  return (
    <RoleBasedGuard permissions={[PERMISSIONS.ADMIN]} hasContent>
      <DashboardPageWrapper
        title="Listare feedback"
        subtitle="Pagina unde sunt listate toate eventualele probleme raportate.">
        <FeedbackReportsDataTable />
      </DashboardPageWrapper>
    </RoleBasedGuard>
  );
}
