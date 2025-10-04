import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import { SubscriptionSuccess } from "@/components/subscription-success";

export default function Page() {
  return (
    <DashboardPageWrapper
      title="Abonament activat"
      subtitle="Felicitări! Abonamentul tău Pro a fost activat cu succes.">
      <SubscriptionSuccess />
    </DashboardPageWrapper>
  );
}
