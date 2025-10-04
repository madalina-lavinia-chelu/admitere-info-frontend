"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
  IconHelp,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { store } from "@/redux/store";
import Link from "next/link";
import { paths } from "@/routes/paths";
import { useHandleLogout } from "@/utils/user.utils";
import { useTheme } from "next-themes";

export function NavUser() {
  const { isMobile, setOpenMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const handleLogout = useHandleLogout();

  const handleNavigation = () => {
    // Close sidebar on mobile when navigating
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  const { user } = store.getState().auth as any;

  const userInitials = `${user?.first_name?.[0] || ""}${
    user?.last_name?.[0] || ""
  }`;

  // Mock user stats - replace with real data from your API
  const userStats = {
    questionsAnswered: user?.question_stats?.total_answered || 42,
    correctAnswers: user?.question_stats?.correct_answers || 35,
    accuracy: user?.question_stats?.accuracy_percentage || 83,
  };

  const UserMenuContent = () => (
    <>
      {/* User Stats */}
      <div className="mx-2 mt-2 mb-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-lg">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="font-bold text-sm text-blue-600 dark:text-blue-400">
              {userStats.questionsAnswered}
            </div>
            <div className="text-xs text-muted-foreground">Întrebări</div>
          </div>
          <div>
            <div className="font-bold text-sm text-blue-600 dark:text-blue-400">
              {userStats.correctAnswers}
            </div>
            <div className="text-xs text-muted-foreground">Corecte</div>
          </div>
          <div>
            <div className="font-bold text-sm text-blue-600 dark:text-blue-400">
              {userStats.accuracy}%
            </div>
            <div className="text-xs text-muted-foreground">Acuratețe</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 m-2 rounded-lg">
        <Avatar
          className={`h-10 w-10 rounded-xl bg-brand ring-2 ring-white dark:ring-blue-700`}>
          <AvatarFallback
            className={`rounded-xl bg-brand text-white font-bold`}>
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left leading-tight">
          <span className="truncate font-semibold text-sm">
            {user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.email?.split("@")[0]}
          </span>
          <span className="text-muted-foreground truncate text-xs">
            {user?.email}
          </span>
        </div>
      </div>
    </>
  );
  const UserMenuItems = () => (
    <>
      <div className={isMobile ? "px-4 space-y-1" : "px-2"}>
        <Link
          href={paths.dashboard.profile}
          onClick={handleNavigation}
          className="block">
          <div
            className={`flex items-center gap-3 rounded-lg py-2.5 px-3 cursor-pointer transition-colors ${
              isMobile
                ? "hover:bg-blue-50 dark:hover:bg-blue-950/50"
                : "hover:bg-accent"
            }`}>
            <IconUserCircle className="text-blue-500" size={18} />
            <span className="font-medium">Editează profilul</span>
          </div>
        </Link>

        <div
          className={`flex items-center gap-3 rounded-lg py-2.5 px-3 cursor-pointer transition-colors ${
            isMobile
              ? "hover:bg-blue-50 dark:hover:bg-blue-950/50"
              : "hover:bg-accent"
          }`}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? (
            <IconSun className="text-blue-500" size={18} />
          ) : (
            <IconMoon className="text-blue-600" size={18} />
          )}
          <span className="font-medium">
            {theme === "dark" ? "Mod luminos" : "Mod întunecat"}
          </span>
        </div>

        <div
          className={`flex items-center gap-3 rounded-lg py-2.5 px-3 cursor-pointer transition-colors ${
            isMobile
              ? "hover:bg-blue-50 dark:hover:bg-blue-950/50"
              : "hover:bg-accent"
          }`}>
          <IconHelp className="text-blue-500" size={18} />
          <span className="font-medium">Ajutor</span>
        </div>
      </div>

      <div className={`${isMobile ? "mx-4" : ""} my-2 border-t`} />
      <div className={isMobile ? "px-4 pb-4" : "px-2 pb-2"}>
        <div
          onClick={handleLogout}
          className={`flex items-center gap-3 rounded-lg py-2.5 px-3 cursor-pointer text-red-600 dark:text-red-400 transition-colors ${
            isMobile
              ? "hover:bg-red-50 dark:hover:bg-red-950/50"
              : "hover:bg-red-50 dark:hover:bg-red-950/50"
          }`}>
          <IconLogout size={18} />
          <span className="font-medium">Deconectare</span>
        </div>
      </div>
    </>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {isMobile ? (
          // Mobile Drawer
          <Drawer>
            <DrawerTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-all duration-200">
                <div className="relative">
                  <Avatar
                    className={`h-9 w-9 rounded-xl bg-brand ring-2 ring-white dark:ring-gray-800 shadow-lg`}>
                    <AvatarFallback
                      className={`rounded-xl bg-brand text-white font-semibold text-sm`}>
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div className="grid flex-1 text-left leading-tight ml-1">
                  <span className="truncate font-semibold text-sm">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user?.email?.split("@")[0]}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-0 h-5">
                      {user?.role_info?.name}
                    </Badge>
                  </div>
                </div>
                <IconDotsVertical className="ml-auto size-4 opacity-60" />
              </SidebarMenuButton>
            </DrawerTrigger>
            <DrawerContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
              <DrawerHeader className="pb-0">
                <DrawerTitle className="sr-only">
                  Meniul utilizatorului
                </DrawerTitle>
                <UserMenuContent />
              </DrawerHeader>
              <UserMenuItems />
            </DrawerContent>
          </Drawer>
        ) : (
          // Desktop Dropdown
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-all duration-200">
                <div className="relative">
                  <Avatar
                    className={`h-9 w-9 rounded-xl bg-brand ring-2 ring-white dark:ring-gray-800 shadow-lg`}>
                    <AvatarFallback
                      className={`rounded-xl bg-brand text-white font-semibold text-sm`}>
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div className="grid flex-1 text-left leading-tight ml-1">
                  <span className="truncate font-semibold text-sm">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user?.email?.split("@")[0]}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-0 h-5">
                      {user?.role_info?.name}
                    </Badge>
                  </div>
                </div>
                <IconDotsVertical className="ml-auto size-4 opacity-60" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 rounded-xl shadow-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg"
              side="right"
              align="end"
              sideOffset={8}>
              <DropdownMenuLabel className="p-0 font-normal">
                <UserMenuContent />
              </DropdownMenuLabel>{" "}
              <DropdownMenuGroup className="px-2">
                <Link href={paths.dashboard.profile} onClick={handleNavigation}>
                  <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer">
                    <IconUserCircle className="text-blue-500" size={18} />
                    <span className="font-medium">Editează profilul</span>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem
                  className="rounded-lg py-2.5 cursor-pointer"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? (
                    <IconSun className="text-blue-500" size={18} />
                  ) : (
                    <IconMoon className="text-blue-600" size={18} />
                  )}
                  <span className="font-medium">
                    {theme === "dark" ? "Mod luminos" : "Mod întunecat"}
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer">
                  <IconHelp className="text-blue-500" size={18} />
                  <span className="font-medium">Ajutor</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="my-2" />
              <div className="px-2 pb-2">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-lg py-2.5 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50">
                  <IconLogout size={18} />
                  <span className="font-medium">Deconectare</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
