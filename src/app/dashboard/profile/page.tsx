import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper";
import UpdateProfileForm from "./update-profile-form";

export default function Page() {
  return (
    <DashboardPageWrapper
      title="Profil"
      subtitle="Pagina de afișare și editare profil de utilizator.">
      <UpdateProfileForm />
    </DashboardPageWrapper>
  );
}
