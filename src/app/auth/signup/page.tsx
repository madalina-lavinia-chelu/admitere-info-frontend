import MotionWrapper from "@/components/ui/motion-wrapper";
import SignupForm from "./signup-form";

export default function Page() {
  return (
    <MotionWrapper type="slide-down" duration={0.5}>
      <SignupForm />
    </MotionWrapper>
  );
}
