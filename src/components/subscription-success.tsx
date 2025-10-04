"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { checkoutSuccessRequest } from "@/requests/subscription.requests";
import { ApiResponseType } from "@/types/types";
import { paths } from "@/routes/paths";

export function SubscriptionSuccess() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      toast.error("Sesiune invalidă");
      router.push(paths.dashboard.subscription);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response: ApiResponseType = await checkoutSuccessRequest(
          sessionId
        );
        if (!response.error) {
          setSuccess(true);
          toast.success(
            response.data?.message || "Abonament activat cu succes!"
          );
        } else {
          toast.error(response.message || "Eroare la verificarea plății");
          router.push(paths.dashboard.subscription);
        }
      } catch {
        toast.error("Eroare la verificarea plății");
        router.push(paths.dashboard.subscription);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Verificare plată...</h3>
          <p className="text-muted-foreground text-center">
            Te rugăm să aștepți în timp ce verificăm plata ta.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!success) {
    return null; // Will redirect
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-fit">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Abonament activat cu succes!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-lg">
            Felicitări! Ai acum acces complet la toate funcționalitățile Pro.
          </p>
          <p className="text-muted-foreground">
            Poți începe să rezolvi întrebări nelimitate și să accesezi toate
            capitolele disponibile.
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="h-5 w-5 text-amber-600" />
            <h4 className="font-semibold text-amber-800 dark:text-amber-200">
              Beneficiile tale Pro includ:
            </h4>
          </div>
          <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Întrebări nelimitate din toate domeniile
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Acces la toate capitolele și subcapitolele
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Statistici detaliate și progres avansat
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Suport prioritar și actualizări exclusive
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={() => router.push(paths.dashboard.question.answer)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Începe să rezolvi întrebări
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button
            onClick={() => router.push(paths.dashboard.subscription)}
            variant="outline"
            className="flex-1">
            Vezi detalii abonament
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
