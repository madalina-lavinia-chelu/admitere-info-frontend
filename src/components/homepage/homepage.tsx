import { HomepageHeader } from "./header";
import { HeroSection } from "./hero-section";
import { FeaturesSection } from "./features-section";
import { PricingSection } from "./pricing-section";
import { AboutSection } from "./about-section";
import { ContactSection } from "./contact-section";
import { HomepageFooter } from "./footer";
import MotionWrapper from "@/components/ui/motion-wrapper";
import { QuestionSection } from "./question-section";

export function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      {/* Animated gradient dots background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient dots */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-96 left-1/3 w-64 h-64 bg-cyan-400/12 rounded-full blur-3xl animate-pulse delay-2000" />
        <div className="absolute bottom-40 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-3000" />
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-indigo-400/8 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Medium gradient dots */}
        <div className="absolute top-32 right-1/3 w-40 h-40 bg-blue-300/15 rounded-full blur-2xl animate-pulse delay-1500" />
        <div className="absolute top-80 right-40 w-36 h-36 bg-cyan-500/12 rounded-full blur-2xl animate-pulse delay-2500" />
        <div className="absolute bottom-60 left-1/4 w-44 h-44 bg-blue-400/10 rounded-full blur-2xl animate-pulse delay-4000" />
        <div className="absolute bottom-96 right-1/4 w-32 h-32 bg-indigo-300/15 rounded-full blur-2xl animate-pulse delay-700" />

        {/* Small accent dots */}
        <div className="absolute top-64 left-1/2 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-3500" />
        <div className="absolute top-1/3 right-12 w-20 h-20 bg-cyan-400/18 rounded-full blur-xl animate-pulse delay-1200" />
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-blue-600/15 rounded-full blur-xl animate-pulse delay-2800" />
        <div className="absolute bottom-80 right-1/3 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-4500" />
      </div>{" "}
      {/* Content */}
      <div className="relative z-10">
        <MotionWrapper type="fade" duration={0.8}>
          <HomepageHeader />
        </MotionWrapper>

        <MotionWrapper type="slide-fade-up" duration={0.7} delay={0.2}>
          <HeroSection />
        </MotionWrapper>

        <MotionWrapper
          type="fade-scale"
          duration={0.6}
          delay={0.1}
          useViewport={true}>
          <FeaturesSection />
        </MotionWrapper>

        <MotionWrapper
          type="fade-up"
          duration={0.6}
          delay={0.1}
          useViewport={true}>
          <QuestionSection />
        </MotionWrapper>

        <MotionWrapper
          type="gentle-bounce"
          duration={0.8}
          delay={0.1}
          useViewport={true}>
          <PricingSection />
        </MotionWrapper>

        <MotionWrapper
          type="slide-up"
          duration={0.7}
          delay={0.1}
          useViewport={true}>
          <AboutSection />
        </MotionWrapper>

        <MotionWrapper
          type="fade-up"
          duration={0.6}
          delay={0.1}
          useViewport={true}>
          <ContactSection />
        </MotionWrapper>

        <MotionWrapper
          type="fade"
          duration={0.5}
          delay={0.1}
          useViewport={true}>
          <HomepageFooter />
        </MotionWrapper>
      </div>
    </div>
  );
}
