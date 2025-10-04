"use client";

import {
  IconLogout,
  IconUserCircle,
  IconSettings,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { store } from "@/redux/store";
import Link from "next/link";
import { paths } from "@/routes/paths";
import { useHandleLogout } from "@/utils/user.utils";
import { useTheme } from "next-themes";

export function NavUserCompact() {
  const { isMobile, setOpenMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  const handleNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const { user } = store.getState().auth as any;

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-green-400 to-green-600",
      "bg-gradient-to-br from-purple-400 to-purple-600",
      "bg-gradient-to-br from-pink-400 to-pink-600",
      "bg-gradient-to-br from-orange-400 to-orange-600",
      "bg-gradient-to-br from-teal-400 to-teal-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const userInitials = `${user?.first_name?.[0] || ""}${
    user?.last_name?.[0] || ""
  }`;
  const avatarColor = getAvatarColor(userInitials);

  return (
    <Card className="mx-2 mb-2 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardContent className="p-4">
        {/* User Info Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Avatar
              className={`h-12 w-12 rounded-2xl ${avatarColor} ring-2 ring-white dark:ring-gray-700 shadow-md`}>
              <AvatarFallback
                className={`rounded-2xl ${avatarColor} text-white font-bold text-lg`}>
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.email?.split("@")[0]}
            </h3>
            <p className="text-xs text-muted-foreground truncate mb-1">
              {user?.email}
            </p>
            <Badge variant="outline" className="text-xs h-5 px-2">
              {user?.role_info?.name}
            </Badge>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 justify-start"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? (
              <IconSun className="text-yellow-500 mr-2" size={16} />
            ) : (
              <IconMoon className="text-purple-500 mr-2" size={16} />
            )}
            <span className="text-xs">Temă</span>
          </Button>

          <Button variant="ghost" size="sm" className="h-9 justify-start">
            <IconSettings className="text-gray-500 mr-2" size={16} />
            <span className="text-xs">Setări</span>
          </Button>
        </div>

        {/* Main Actions */}
        <div className="space-y-2">
          <Link
            href={paths.dashboard.profile}
            onClick={handleNavigation}
            className="block">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-9">
              <IconUserCircle className="text-blue-500 mr-2" size={16} />
              <span className="text-xs font-medium">Editează profilul</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-9 text-red-600 dark:text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
            onClick={useHandleLogout}>
            <IconLogout className="mr-2" size={16} />
            <span className="text-xs font-medium">Deconectare</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
