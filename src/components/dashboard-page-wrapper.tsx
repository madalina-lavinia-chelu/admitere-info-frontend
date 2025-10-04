import React from "react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/typography";
import { DashboardHeader } from "./dashboard-header";
import { Card, CardContent } from "./ui/card";

type PageWrapperProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export const DashboardPageWrapper = ({
  title,
  subtitle,
  children,
  className,
}: PageWrapperProps) => {
  return (
    <>
      <DashboardHeader />
      <div className={cn("space-y-6 px-4 py-12 md:p-12", className)}>
        <div className="space-y-2">
          <Typography as="h1" variant="h2">
            {title}
          </Typography>

          {subtitle && <Typography variant="muted">{subtitle}</Typography>}
        </div>

        <div className="mt-6">
          <Card>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
