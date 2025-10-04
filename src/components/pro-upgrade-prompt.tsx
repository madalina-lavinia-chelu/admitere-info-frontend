"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Star, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";

interface ProUpgradePromptProps {
  title?: string;
  description?: string;
  features?: string[];
}

export function ProUpgradePrompt({
  title = "Această funcționalitate necesită abonament Pro",
  description = "Upgrade la Pro pentru acces nelimitat la toate întrebările și funcționalitățile avansate.",
  features = [
    "Întrebări nelimitate din toate domeniile",
    "Acces la toate capitolele și subcapitolele",
    "Statistici detaliate și progres avansat",
    "Suport prioritar și actualizări exclusive",
  ],
}: ProUpgradePromptProps) {
  const router = useRouter();

  return (
    <Card className="border-2 border-dashed border-orange-200 dark:border-orange-800">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full w-fit">
          <Lock className="h-8 w-8 text-orange-600" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-muted-foreground">{description}</p>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-5 w-5 text-amber-600" />
            <h4 className="font-semibold text-amber-800 dark:text-amber-200">
              Beneficiile abonamentului Pro:
            </h4>
          </div>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                <Zap className="h-4 w-4 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Button
            onClick={() => router.push(paths.dashboard.subscription)}
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
            <Crown className="h-5 w-5 mr-2" />
            Upgrade la Pro acum
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Doar 49,99 RON/lună
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
