"use client";

import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import UspertQuestionForm from "../upsert-question-form";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setSelectedQuestion } from "@/redux/slices/general";
import RoleBasedGuard from "@/auth/guard/role-based-guard";
import { PERMISSIONS } from "@/utils/permissions.utils";

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSelectedQuestion(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RoleBasedGuard permissions={[PERMISSIONS.ADMIN]} hasContent>
      <DashboardPageWrapper
        title="Adaugă grilă"
        subtitle="Introdu datele corespunzătoare.">
        <UspertQuestionForm />
      </DashboardPageWrapper>
    </RoleBasedGuard>
  );
}
