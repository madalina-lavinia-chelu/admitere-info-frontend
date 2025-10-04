"use client";

import RoleBasedGuard from "@/auth/guard/role-based-guard";
import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import { UsersDataTable } from "@/components/users-data-table";
import { paths } from "@/routes/paths";
import { PERMISSIONS } from "@/utils/permissions.utils";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleEditUser = (user: any) => {
    router.push(paths.dashboard.user.edit(user.id));
  };

  return (
    <RoleBasedGuard permissions={[PERMISSIONS.ADMIN]} hasContent>
      <DashboardPageWrapper
        title="Utilizatori"
        subtitle="Gestionați utilizatorii existenți.">
        <UsersDataTable onEdit={handleEditUser} />
      </DashboardPageWrapper>
    </RoleBasedGuard>
  );
}
