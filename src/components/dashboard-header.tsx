"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./toggle-dark-mode";
import { useHandleLogout } from "@/utils/user.utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserMenuDrawer } from "./user-menu-drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { store } from "@/redux/store";

export function DashboardHeader() {
  const handleLogout = useHandleLogout();
  const isMobile = useIsMobile();
  const { user } = store.getState().auth as any;

  const userInitials = `${user?.first_name?.[0] || ""}${
    user?.last_name?.[0] || ""
  }`;
  return (
    <header className="sticky top-0 z-50 flex py-7 h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="ml-auto flex items-center gap-2">
          {isMobile && (
            <UserMenuDrawer>
              <Button variant="ghost" size="icon" className="relative">
                <Avatar className="h-8 w-8 rounded-xl bg-brand ring-2 ring-white dark:ring-gray-800">
                  <AvatarFallback className="rounded-xl bg-brand text-white font-semibold text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-gray-800"></div>
              </Button>
            </UserMenuDrawer>
          )}
          <ModeToggle />
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              rel="noopener noreferrer"
              target="_blank"
              onClick={handleLogout}
              className="dark:text-foreground">
              Log out
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
