import { store } from "@/redux/store";
import { RoleType } from "@/types/types";

export const PERMISSIONS = {
  ADMIN: "admin",
  MEMBER: "member",
};

export const userCan = (role: RoleType | RoleType[]) => {
  const { user } = store.getState().auth as any;

  if (!user) return false;
  if (!user.role_info) return false;

  const roleName = user.role_info.name;

  if (Array.isArray(role)) {
    return role.some((p) => roleName === p || roleName === "*");
  }

  return roleName === role || roleName === "*";
};
