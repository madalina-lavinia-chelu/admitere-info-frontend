"use client";

import NotFound from "@/components/not-found";
import { userCan } from "@/utils/permissions.utils";

type RoleBasedGuardProp = {
  hasContent?: boolean;
  permissions?: string[];
  children: React.ReactNode;
};

export default function RoleBasedGuard({
  hasContent,
  permissions,
  children,
}: RoleBasedGuardProp) {
  if (typeof permissions !== "undefined" && !userCan(permissions)) {
    return hasContent ? <NotFound /> : null;
  }

  return <> {children} </>;
}
