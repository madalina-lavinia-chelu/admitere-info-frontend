"use client";

import { IconCirclePlusFilled, IconChecklist } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Typography } from "@/components/typography";
import { PERMISSIONS, userCan } from "@/utils/permissions.utils";
import { paths } from "@/routes/paths";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: any;
    permission?: string | null;
  }[];
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavigation = () => {
    // Close sidebar on mobile when navigating
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const filteredItems = items.filter(
    (item) => !item.permission || userCan(item.permission)
  );
  // Group items by category for better organization
  const adminItems = filteredItems.filter(
    (item) => item.permission === PERMISSIONS.ADMIN
  );

  const disciplineItems = filteredItems.filter(
    (item) =>
      item.permission === PERMISSIONS.MEMBER &&
      (item.title === "Informatică" ||
        item.title === "Matematică" ||
        item.title === "Fizică")
  );

  const memberItems = filteredItems.filter(
    (item) =>
      item.permission === PERMISSIONS.MEMBER &&
      !(
        item.title === "Informatică" ||
        item.title === "Matematică" ||
        item.title === "Fizică"
      )
  );

  const generalItems = filteredItems.filter((item) => !item.permission);
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-4">
        {/* Primary Action Buttons */}
        <div className="space-y-2">
          <SidebarMenu>
            {userCan(PERMISSIONS.ADMIN) ? (
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Adaugă grilă nouă"
                  className="cursor-pointer bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to text-white hover:text-white hover:from-brand-gradient-hover-from hover:to-brand-gradient-hover-to dark:from-brand-gradient-from dark:to-brand-gradient-to dark:hover:from-brand-gradient-hover-from dark:hover:to-brand-gradient-hover-to min-w-8 duration-300 ease-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 rounded-xl group">
                  <Link
                    href={paths.dashboard.question.new}
                    onClick={handleNavigation}
                    className="flex items-center gap-3 w-full">
                    <div className="p-1.5 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-200 group-hover:rotate-6 transform">
                      <IconCirclePlusFilled size={20} strokeWidth={2} />
                    </div>
                    <Typography
                      className="text-base font-semibold tracking-tight"
                      as="span">
                      Adaugă grilă
                    </Typography>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Începe să rezolvi grile"
                  className="cursor-pointer bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to text-white hover:text-white hover:from-brand-gradient-hover-from hover:to-brand-gradient-hover-to dark:from-brand-gradient-from dark:to-brand-gradient-to dark:hover:from-brand-gradient-hover-from dark:hover:to-brand-gradient-hover-to min-w-8 duration-300 ease-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 rounded-xl group">
                  <Link
                    href={paths.dashboard.root}
                    onClick={handleNavigation}
                    className="flex items-center gap-3 w-full">
                    <div className="p-1.5 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-200 group-hover:scale-110 transform">
                      <IconChecklist size={20} strokeWidth={2} />
                    </div>
                    <Typography
                      className="text-base font-semibold tracking-tight"
                      as="span">
                      Rezolvă grile
                    </Typography>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </div>{" "}
        {/* Admin Section */}
        {userCan(PERMISSIONS.ADMIN) && adminItems.length > 0 && (
          <div className="space-y-2">
            <div className="px-3 py-2 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
              <Typography className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                Administrare
              </Typography>
            </div>
            <SidebarMenu className="space-y-1">
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="cursor-pointer group hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all duration-200 ease-out hover:shadow-sm border border-transparent hover:border-red-100 dark:hover:border-red-900/30">
                    <Link href={item.url} onClick={handleNavigation}>
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-all duration-200 group-hover:scale-105 group-hover:rotate-3 transform">
                          {item.icon && (
                            <item.icon
                              size={18}
                              className="text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-200"
                            />
                          )}
                        </div>{" "}
                        <Typography
                          className="text-base md:text-base font-medium tracking-tight group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-200"
                          as="span">
                          {item.title}
                        </Typography>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        )}
        {/* Discipline Section */}
        {userCan(PERMISSIONS.MEMBER) && disciplineItems.length > 0 && (
          <div className="space-y-2">
            <div className="px-3 py-2 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
              <Typography className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
                Discipline
              </Typography>
            </div>
            <SidebarMenu className="space-y-1">
              {disciplineItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="cursor-pointer group hover:bg-green-50 dark:hover:bg-green-950/20 rounded-lg transition-all duration-200 ease-out hover:shadow-sm border border-transparent hover:border-green-100 dark:hover:border-green-900/30">
                    <Link href={item.url} onClick={handleNavigation}>
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30 group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-all duration-200 group-hover:scale-105 transform">
                          {item.icon && (
                            <item.icon
                              size={18}
                              className="text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-200"
                            />
                          )}
                        </div>{" "}
                        <Typography
                          className="text-base font-medium tracking-tight group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-200"
                          as="span">
                          {item.title}
                        </Typography>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        )}
        {/* Member Features Section */}
        {memberItems.length > 0 && (
          <div className="space-y-2">
            <div className="px-3 py-2 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
              <Typography className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Activități
              </Typography>
            </div>
            <SidebarMenu className="space-y-1">
              {memberItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="cursor-pointer group hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-all duration-200 ease-out hover:shadow-sm border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30">
                    <Link href={item.url} onClick={handleNavigation}>
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-all duration-200 group-hover:scale-105 transform">
                          {item.icon && (
                            <item.icon
                              size={18}
                              className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200"
                            />
                          )}
                        </div>{" "}
                        <Typography
                          className="text-base font-medium tracking-tight group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200"
                          as="span">
                          {item.title}
                        </Typography>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        )}
        {/* General/Profile Section */}
        {generalItems.length > 0 && (
          <div className="space-y-2">
            <div className="px-3 py-2 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-slate-500 to-slate-600 rounded-full"></div>
              <Typography className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Setări
              </Typography>
            </div>
            <SidebarMenu className="space-y-1">
              {generalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-950/20 rounded-lg transition-all duration-200 ease-out hover:shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-900/30">
                    <Link href={item.url} onClick={handleNavigation}>
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/30 group-hover:bg-slate-100 dark:group-hover:bg-slate-900/40 transition-all duration-200 group-hover:scale-105 transform">
                          {item.icon && (
                            <item.icon
                              size={18}
                              className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-200"
                            />
                          )}
                        </div>{" "}
                        <Typography
                          className="text-base md:text-base font-medium tracking-tight group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-200"
                          as="span">
                          {item.title}
                        </Typography>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
