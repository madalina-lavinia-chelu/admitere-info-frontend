import RoleBasedGuard from "@/auth/guard/role-based-guard";
import { DashboardHeader } from "@/components/dashboard-header";
import { QuestionFlow } from "@/components/question-flow";
import { PERMISSIONS } from "@/utils/permissions.utils";

export default function Page() {
  return (
    <RoleBasedGuard permissions={[PERMISSIONS.MEMBER]} hasContent>
      <>
        <DashboardHeader />
        <QuestionFlow />
      </>
    </RoleBasedGuard>
  );
}
