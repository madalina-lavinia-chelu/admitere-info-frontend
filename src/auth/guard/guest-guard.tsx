"use client";

import { useRouter } from "next/navigation";

import { useEffect, useCallback } from "react";
//
import { useAppSelector } from "@/redux/store";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

const GuestGuard = ({ children }: GuestGuardProps) => {
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);

  const check = useCallback(() => {
    if (user) {
      router.replace(paths.dashboard.root);
    }
  }, [user, router]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
};

export default GuestGuard;
