"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Download,
  Loader2,
  Star,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  getSubscriptionStatusRequest,
  getSubscriptionPlansRequest,
  getInvoicesRequest,
  createCheckoutSessionRequest,
  cancelSubscriptionRequest,
  resumeSubscriptionRequest,
  updatePaymentMethodRequest,
  downloadInvoiceRequest,
  SubscriptionInfo,
  SubscriptionPlan,
  Invoice,
} from "@/requests/subscription.requests";
import { ApiResponseType } from "@/types/types";
import { withoutRevalidateOnFocus } from "@/utils/api.utils";
import useSWR from "swr";

export function SubscriptionManagement() {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch subscription status
  const { data: subscriptionData, mutate: mutateSubscription } =
    useSWR<ApiResponseType>(
      "subscription-status",
      () => getSubscriptionStatusRequest(),
      { ...withoutRevalidateOnFocus }
    );

  // Fetch plans
  const { data: plansData } = useSWR<ApiResponseType>(
    "subscription-plans",
    () => getSubscriptionPlansRequest(),
    { ...withoutRevalidateOnFocus }
  );

  // Fetch invoices
  const { data: invoicesData } = useSWR<ApiResponseType>(
    "subscription-invoices",
    () => getInvoicesRequest(),
    { ...withoutRevalidateOnFocus }
  );

  const subscriptionInfo: SubscriptionInfo | null =
    subscriptionData?.data || null;
  const plans: SubscriptionPlan[] = plansData?.plans || [];
  const invoices: Invoice[] = invoicesData?.data?.invoices || [];

  const handleSubscribe = async () => {
    setActionLoading("subscribe");
    const response: ApiResponseType = await createCheckoutSessionRequest();
    setActionLoading(null);
    if (!response.error && response.checkout_url) {
      window.location.href = response.checkout_url;
    } else {
      toast.error(response.message || "Eroare la crearea sesiunii de plată");
    }
  };

  const handleCancelSubscription = async () => {
    setActionLoading("cancel");
    const response: ApiResponseType = await cancelSubscriptionRequest();
    setActionLoading(null);
    if (!response.error) {
      toast.success(response.message || "Abonament anulat cu succes");
      mutateSubscription();
    } else {
      toast.error(response.message || "Eroare la anularea abonamentului");
    }
  };

  const handleResumeSubscription = async () => {
    setActionLoading("resume");
    const response: ApiResponseType = await resumeSubscriptionRequest();
    setActionLoading(null);
    if (!response.error) {
      toast.success(response.message || "Abonament reactivat cu succes");
      mutateSubscription();
    } else {
      toast.error(response.message || "Eroare la reactivarea abonamentului");
    }
  };

  const handleUpdatePaymentMethod = async () => {
    setActionLoading("payment");
    const response: ApiResponseType = await updatePaymentMethodRequest();
    setActionLoading(null);
    if (!response.error && response.billing_portal_url) {
      // Redirect to Stripe billing portal
      window.location.href = response.billing_portal_url;
    } else {
      toast.error(
        response.message || "Eroare la accesarea portalului de facturare"
      );
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    const response: ApiResponseType = await downloadInvoiceRequest(invoiceId);
    if (!response.error) {
      toast.success("Factura a fost descărcată cu succes");
    } else {
      toast.error("Eroare la descărcarea facturii");
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    // Parse DD/MM/YYYY format (e.g., "01/07/2025" = July 1st, 2025)
    const parts = dateString.replace(/\//g, "/").split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return format(date, "dd MMMM yyyy", { locale: ro });
    }
    // Fallback to original parsing if format is unexpected
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy", { locale: ro });
  };

  if (!subscriptionData || !plansData) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Statusul abonamentului
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Plan curent:</span>
                <Badge
                  variant={
                    subscriptionInfo?.subscription_type === "pro"
                      ? "default"
                      : "secondary"
                  }>
                  {subscriptionInfo?.subscription_type === "pro"
                    ? "Pro"
                    : "Gratuit"}
                </Badge>
              </div>
              {subscriptionInfo?.is_pro && (
                <div className="text-sm text-muted-foreground">
                  Status: {subscriptionInfo.status}
                </div>
              )}
            </div>

            {subscriptionInfo?.subscription_type === "pro" && (
              <div className="text-left sm:text-right">
                {subscriptionInfo.expires_at && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      {subscriptionInfo.will_cancel
                        ? "Se încheie pe:"
                        : "Activ până pe:"}
                    </span>
                    <div className="font-medium">
                      {formatDate(subscriptionInfo.expires_at)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Question Access Info */}
          {subscriptionInfo?.question_access && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm space-y-1">
                <div className="font-medium text-blue-800 dark:text-blue-200">
                  Acces întrebări:
                </div>
                <div className="text-blue-700 dark:text-blue-300">
                  • Întrebări gratuite:{" "}
                  {subscriptionInfo.question_access.available_free_questions}
                </div>
                {subscriptionInfo.is_pro && (
                  <div className="text-blue-700 dark:text-blue-300">
                    • Acces la toate întrebările Pro
                  </div>
                )}
                <div className="text-blue-700 dark:text-blue-300">
                  • Total întrebări disponibile:{" "}
                  {subscriptionInfo.question_access.total_questions}
                </div>
              </div>
            </div>
          )}

          {subscriptionInfo?.will_cancel && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <XCircle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-800 dark:text-orange-200">
                Abonamentul va fi anulat la sfârșitul perioadei de facturare
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {!subscriptionInfo?.is_pro ? (
              <Button
                onClick={handleSubscribe}
                disabled={actionLoading === "subscribe"}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 w-full sm:w-auto">
                {actionLoading === "subscribe" && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                <Crown className="h-4 w-4 mr-2" />
                Upgrade la Pro
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {subscriptionInfo.will_cancel ? (
                  <Button
                    onClick={handleResumeSubscription}
                    disabled={actionLoading === "resume"}
                    variant="default"
                    className="w-full sm:w-auto">
                    {actionLoading === "resume" && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Reactivează abonamentul
                  </Button>
                ) : (
                  <Button
                    onClick={handleCancelSubscription}
                    disabled={actionLoading === "cancel"}
                    variant="destructive"
                    className="w-full sm:w-auto">
                    {actionLoading === "cancel" && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    <XCircle className="h-4 w-4 mr-2" />
                    Anulează abonamentul
                  </Button>
                )}

                <Button
                  onClick={handleUpdatePaymentMethod}
                  disabled={actionLoading === "payment"}
                  variant="outline"
                  className="w-full sm:w-auto">
                  {actionLoading === "payment" && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  <CreditCard className="h-4 w-4 mr-2" />
                  Gestionează plata
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      {!subscriptionInfo?.is_pro && plans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Planuri disponibile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <p className="text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-2xl font-bold">
                        {formatPrice(plan.price, plan.currency)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        pe {plan.interval === "month" ? "lună" : "an"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Funcționalități incluse:</h4>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={handleSubscribe}
                    disabled={actionLoading === "subscribe"}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    {actionLoading === "subscribe" && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    <Zap className="h-4 w-4 mr-2" />
                    Abonează-te acum
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      {subscriptionInfo?.is_pro && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Istoric facturare
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nu există încă facturi generate.
              </p>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="font-medium">
                        {invoice.amount_formatted}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Factura {invoice.identifier} •{" "}
                        {formatDate(invoice.date)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Seria: {invoice.series} • Numărul: {invoice.number}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Badge variant="default" className="w-fit">
                        {invoice.status_text}
                      </Badge>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="w-full sm:w-auto">
                        <Download className="h-4 w-4 mr-1" />
                        <span className="sm:hidden">Descarcă PDF</span>
                        <span className="hidden sm:inline">Descarcă PDF</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
