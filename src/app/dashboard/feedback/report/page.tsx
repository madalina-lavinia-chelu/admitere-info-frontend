import RoleBasedGuard from "@/auth/guard/role-based-guard";
import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import { PERMISSIONS } from "@/utils/permissions.utils";
import { ReportForm } from "./report-form";

export default function Page() {
  return (
    <RoleBasedGuard permissions={[PERMISSIONS.MEMBER]} hasContent>
      <DashboardPageWrapper
        title="Raportează o problemă"
        subtitle="Raportează orice problemă sau neînțelegere întâlnită în aplicație.">
        <ReportForm />
      </DashboardPageWrapper>
    </RoleBasedGuard>
  );
}
