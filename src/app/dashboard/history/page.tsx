import RoleBasedGuard from "@/auth/guard/role-based-guard";
import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import { HistoryFlow } from "@/components/history-flow";
import { PERMISSIONS } from "@/utils/permissions.utils";

export default function Page() {
  return (
    <RoleBasedGuard permissions={[PERMISSIONS.MEMBER]} hasContent>
      <DashboardPageWrapper
        title="Istoric"
        subtitle="Vizualizează istoricul sesiunilor de practică și rezultatele tale.">
        <HistoryFlow />
      </DashboardPageWrapper>
    </RoleBasedGuard>
  );
}
