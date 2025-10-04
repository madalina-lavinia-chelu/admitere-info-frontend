import MotionWrapper from "@/components/ui/motion-wrapper";
import VerifyPasswordForm from "./verify-password-form";

export default function Page() {
  return (
    <MotionWrapper type="slide-down" duration={0.5}>
      <VerifyPasswordForm />
    </MotionWrapper>
  );
}
