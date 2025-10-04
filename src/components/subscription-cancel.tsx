"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, Crown } from "lucide-react";
import { paths } from "@/routes/paths";

export function SubscriptionCancel() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-full w-fit">
          <XCircle className="h-12 w-12 text-gray-600" />
        </div>
        <CardTitle className="text-2xl">Plată anulată</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-lg">Procesul de abonare a fost anulat.</p>
          <p className="text-muted-foreground">
            Nu s-au efectuat plăți și poți încerca din nou oricând.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">
              Beneficiile abonamentului Pro:
            </h4>
          </div>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <li>• Acces nelimitat la toate întrebările</li>
            <li>• Toate capitolele și subcapitolele disponibile</li>
            <li>• Statistici detaliate și progres avansat</li>
            <li>• Suport prioritar și actualizări exclusive</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={() => router.push(paths.dashboard.subscription)}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
            <Crown className="h-4 w-4 mr-2" />
            Încearcă din nou
          </Button>
          <Button
            onClick={() => router.push(paths.dashboard.root)}
            variant="outline"
            className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi la dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
