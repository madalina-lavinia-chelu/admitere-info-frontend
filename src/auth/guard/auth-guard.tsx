"use client";

import { useRouter, usePathname } from "next/navigation";
import { store } from "@/redux/store";
import { useState, useEffect, useCallback } from "react";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    const { user } = store.getState().auth;
    if (!user) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.href,
      }).toString();

      const loginPath = paths.auth.login;

      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, pathname]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
