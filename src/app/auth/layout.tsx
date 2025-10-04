"use client";

import GuestGuard from "@/auth/guard/guest-guard";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import MotionWrapper from "@/components/ui/motion-wrapper";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <div className="flex flex-col min-h-svh w-full">
        <div className="w-full flex justify-center mt-12">
          <div className="flex flex-col items-center gap-4">
            <Logo size="lg" />
            <Link href="/">
              <Button variant="outline" className="ml-4">
                Înapoi la homepage
              </Button>
            </Link>
          </div>
        </div>
        <MotionWrapper
          className="flex-1 flex items-center justify-center p-6 md:p-10"
          type="slide-down"
          duration={0.5}>
          <div className="w-full max-w-md">{children}</div>
        </MotionWrapper>
      </div>
    </GuestGuard>
  );
}
