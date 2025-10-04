// utils/logout.ts
import { logoutAsync } from "@/redux/slices/auth";
import { useAppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { paths } from "@/routes/paths"; // You forgot to import paths

export const useHandleLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync());
      router.push(paths.dashboard.root);
    } catch (error) {
      toast.error("Logout failed", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  return handleLogout;
};
