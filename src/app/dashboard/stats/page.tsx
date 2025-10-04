import RoleBasedGuard from "@/auth/guard/role-based-guard";
import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import { PERMISSIONS } from "@/utils/permissions.utils";
import { StatsFlow } from "@/components/stats-flow";

export default function Page() {
  return (
    <RoleBasedGuard permissions={[PERMISSIONS.MEMBER]} hasContent>
      <DashboardPageWrapper
        title="Statistici"
        subtitle="Vizualizează performanța și progresul tău.">
        <StatsFlow />
      </DashboardPageWrapper>
    </RoleBasedGuard>
  );
}
