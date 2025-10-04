import RoleBasedGuard from "@/auth/guard/role-based-guard";
import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import { SubscriptionManagement } from "@/components/subscription-management";
import { PERMISSIONS } from "@/utils/permissions.utils";

export default function Page() {
  return (
    <RoleBasedGuard permissions={[PERMISSIONS.MEMBER]} hasContent>
      <DashboardPageWrapper
        title="Abonament"
        subtitle="Gestionează abonamentul și accesul la funcționalitățile Pro.">
        <SubscriptionManagement />
      </DashboardPageWrapper>
    </RoleBasedGuard>
  );
}
