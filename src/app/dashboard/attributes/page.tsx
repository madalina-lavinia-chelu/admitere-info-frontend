import RoleBasedGuard from "@/auth/guard/role-based-guard";
import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import { PERMISSIONS } from "@/utils/permissions.utils";
import AttributesManagement from "@/components/attributes-management";

export default function Page() {
  return (
    <RoleBasedGuard permissions={[PERMISSIONS.ADMIN]} hasContent>
      <DashboardPageWrapper
        title="Surse și capitole"
        subtitle="Adaugă și editează sursele și capitolele pentru întrebările din sesiuni.">
        <AttributesManagement />
      </DashboardPageWrapper>
    </RoleBasedGuard>
  );
}
