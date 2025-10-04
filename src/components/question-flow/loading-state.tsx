"use client";

import MotionWrapper from "@/components/ui/motion-wrapper";

export function LoadingState() {
  return (
    <MotionWrapper type="fade" duration={0.5}>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Se încarcă întrebarea...</p>
        </div>
      </div>
    </MotionWrapper>
  );
}
