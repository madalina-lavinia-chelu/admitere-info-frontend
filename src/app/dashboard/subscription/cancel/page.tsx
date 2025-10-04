import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import { SubscriptionCancel } from "@/components/subscription-cancel";

export default function Page() {
  return (
    <DashboardPageWrapper
      title="Plată anulată"
      subtitle="Procesul de abonare a fost anulat.">
      <SubscriptionCancel />
    </DashboardPageWrapper>
  );
}
