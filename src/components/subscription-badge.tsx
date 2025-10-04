"use client";

import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { useAppSelector } from "@/redux/store";

interface SubscriptionBadgeProps {
  className?: string;
  showIcon?: boolean;
}

export function SubscriptionBadge({
  className,
  showIcon = true,
}: SubscriptionBadgeProps) {
  const user = useAppSelector((state) => state.auth.user as any);
  const isPro =
    user?.subscription_info?.subscription_type === "pro" || user?.isPro;

  if (!isPro) {
    return (
      <Badge variant="secondary" className={className}>
        {showIcon && <Crown className="h-3 w-3 mr-1" />}
        Gratuit
      </Badge>
    );
  }

  return (
    <Badge
      variant="default"
      className={`bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 ${className}`}>
      {showIcon && <Crown className="h-3 w-3 mr-1" />}
      Pro
    </Badge>
  );
}
