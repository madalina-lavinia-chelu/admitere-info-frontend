import EmailVerificationForm from "@/app/auth/verify-email/email-verification-form";
import MotionWrapper from "@/components/ui/motion-wrapper";

export default function VerifyEmailPage() {
  return (
    <MotionWrapper type="slide-down" duration={0.5}>
      <EmailVerificationForm />
    </MotionWrapper>
  );
}
