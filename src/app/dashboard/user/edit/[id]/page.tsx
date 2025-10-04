"use client";

import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiResponseType } from "@/types/types";
import useSWR from "swr";
import { toast } from "sonner";
import { paths } from "@/routes/paths";
import Loading from "@/components/loading";
import { getAllUsersRequest } from "@/requests/user.requests";
import EditUserForm from "../edit-user-form";
import { setSelectedUser } from "@/redux/slices/general";
import { PERMISSIONS } from "@/utils/permissions.utils";
import RoleBasedGuard from "@/auth/guard/role-based-guard";

export default function Page() {
  const { id }: { id: string } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, isLoading } = useSWR<ApiResponseType>(`user-${id}`, () =>
    getAllUsersRequest({ id: Number(id) })
  );

  useEffect(() => {
    if (!data) {
      return () => {};
    }
    if (data?.error) {
      toast.error("Eroare", {
        description: data.message,
      });
      return router.push(paths.dashboard.user.list);
    }

    dispatch(setSelectedUser(data.data));
    return () => {
      dispatch(setSelectedUser(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <RoleBasedGuard permissions={[PERMISSIONS.ADMIN]} hasContent>
      <DashboardPageWrapper
        title="Editează utilizator"
        subtitle="Introdu datele pe care dorești să le schimbi și salvează.">
        <EditUserForm />
      </DashboardPageWrapper>
    </RoleBasedGuard>
  );
}
