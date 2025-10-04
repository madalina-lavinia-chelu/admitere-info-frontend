import MotionWrapper from "@/components/ui/motion-wrapper";
import LoginForm from "./login-form";

export default function Page() {
  return (
    <MotionWrapper type="slide-down" duration={0.5}>
      <LoginForm />
    </MotionWrapper>
  );
}
