"use client";

import {
  IconLogout,
  IconUserCircle,
  IconSettings,
  IconMoon,
  IconSun,
  IconChevronRight,
  IconTrophy,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSidebar } from "@/components/ui/sidebar";
import { store } from "@/redux/store";
import Link from "next/link";
import { paths } from "@/routes/paths";
import { useHandleLogout } from "@/utils/user.utils";
import { useTheme } from "next-themes";

export function NavUserModern() {
  const { isMobile, setOpenMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  const handleNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const { user } = store.getState().auth as any;

  const getAvatarGradient = (name: string) => {
    const gradients = [
      "from-blue-400 via-purple-500 to-pink-500",
      "from-green-400 via-blue-500 to-purple-600",
      "from-yellow-400 via-orange-500 to-red-500",
      "from-pink-400 via-purple-500 to-indigo-500",
      "from-teal-400 via-cyan-500 to-blue-500",
      "from-orange-400 via-red-500 to-pink-500",
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const userInitials = `${user?.first_name?.[0] || ""}${
    user?.last_name?.[0] || ""
  }`;
  const avatarGradient = getAvatarGradient(userInitials);

  // Mock stats - you can replace with real data
  const userStats = {
    questionsCompleted: 147,
    totalQuestions: 200,
    currentStreak: 12,
    accuracy: 84,
  };

  return (
    <div className="px-2 pb-2">
      <Card className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 border-0 shadow-xl">
        <CardHeader className="pb-3">
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${avatarGradient} rounded-2xl blur-md opacity-75`}></div>
              <Avatar
                className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${avatarGradient} ring-2 ring-white dark:ring-gray-800 shadow-lg`}>
                <AvatarFallback
                  className={`rounded-2xl bg-gradient-to-br ${avatarGradient} text-white font-bold text-lg shadow-inner`}>
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 shadow-sm animate-pulse"></div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg truncate bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.email?.split("@")[0]}
              </h2>
              <p className="text-sm text-muted-foreground truncate">
                {user?.email}
              </p>
              <Badge
                variant="secondary"
                className="mt-1 text-xs h-5 px-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 border-0">
                <IconTrophy size={12} className="mr-1" />
                {user?.role_info?.name}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Progres total
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {userStats.questionsCompleted}/{userStats.totalQuestions}
              </span>
            </div>
            <Progress
              value={
                (userStats.questionsCompleted / userStats.totalQuestions) * 100
              }
              className="h-2 bg-gray-200 dark:bg-gray-700"
            />

            <div className="flex justify-between mt-3 text-xs">
              <div className="text-center">
                <div className="font-bold text-green-600 dark:text-green-400">
                  {userStats.currentStreak}
                </div>
                <div className="text-muted-foreground">Streak</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600 dark:text-blue-400">
                  {userStats.accuracy}%
                </div>
                <div className="text-muted-foreground">Acuratețe</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600 dark:text-purple-400">
                  {userStats.questionsCompleted}
                </div>
                <div className="text-muted-foreground">Rezolvate</div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-2">
          {/* Main Actions */}
          <Link
            href={paths.dashboard.profile}
            onClick={handleNavigation}
            className="block">
            <Button
              variant="ghost"
              className="w-full justify-between h-10 group hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all">
              <div className="flex items-center">
                <IconUserCircle className="text-blue-500 mr-3" size={18} />
                <span className="font-medium">Editează profilul</span>
              </div>
              <IconChevronRight
                size={16}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="w-full justify-between h-10 group hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <div className="flex items-center">
              <IconSettings className="text-gray-500 mr-3" size={18} />
              <span className="font-medium">Setări</span>
            </div>
            <IconChevronRight
              size={16}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between h-10 group hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <div className="flex items-center">
              {theme === "dark" ? (
                <IconSun className="text-yellow-500 mr-3" size={18} />
              ) : (
                <IconMoon className="text-purple-500 mr-3" size={18} />
              )}
              <span className="font-medium">
                {theme === "dark" ? "Mod luminos" : "Mod întunecat"}
              </span>
            </div>
          </Button>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start h-10 text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all"
              onClick={useHandleLogout}>
              <IconLogout className="mr-3" size={18} />
              <span className="font-medium">Deconectare</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
