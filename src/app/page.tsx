import GuestGuard from "@/auth/guard/guest-guard";
import { Homepage } from "@/components/homepage";

export default function Home() {
  return (
    <GuestGuard>
      <Homepage />
    </GuestGuard>
  );
}
