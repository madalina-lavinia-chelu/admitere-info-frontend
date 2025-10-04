"use client";

import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import UspertQuestionForm from "../../upsert-question-form";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setSelectedQuestion } from "@/redux/slices/general";
import { useParams, useRouter } from "next/navigation";
import { ApiResponseType } from "@/types/types";
import useSWR from "swr";
import { getAllQuestionsRequest } from "@/requests/question.requests";
import { toast } from "sonner";
import { paths } from "@/routes/paths";
import Loading from "@/components/loading";
import RoleBasedGuard from "@/auth/guard/role-based-guard";
import { PERMISSIONS } from "@/utils/permissions.utils";

export default function Page() {
  const { id }: { id: string } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, isLoading } = useSWR<ApiResponseType>(`question-${id}`, () =>
    getAllQuestionsRequest({ id: Number(id) })
  );

  useEffect(() => {
    if (!data) {
      return () => {};
    }
    if (data?.error) {
      toast.error("Eroare", {
        description: data.message,
      });
      return router.push(paths.dashboard.question.list);
    }

    dispatch(setSelectedQuestion(data.data));
    return () => {
      dispatch(setSelectedQuestion(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <RoleBasedGuard permissions={[PERMISSIONS.ADMIN]} hasContent>
      <DashboardPageWrapper
        title="Editează grilă"
        subtitle="Introdu datele pe care dorești să le schimbi și salvează.">
        <UspertQuestionForm />
      </DashboardPageWrapper>
    </RoleBasedGuard>
  );
}
