"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { toast } from "sonner";
import { paths } from "@/routes/paths";
import Link from "next/link";
import { CheckCircle, XCircle, Mail, Loader2, AlertCircle } from "lucide-react";
import {
  verifyEmailRequest,
  resendVerificationEmailRequest,
} from "@/requests/auth/auth.requests";
import { useAppDispatch } from "@/redux/store";
import { setUser } from "@/redux/slices/auth";
import { setSession } from "@/auth/utils";

type VerificationState = "loading" | "success" | "error" | "manual" | "expired";

const EmailVerificationForm = () => {
  const [verificationState, setVerificationState] =
    useState<VerificationState>("loading");
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const token = searchParams.get("token");
  const userId = searchParams.get("user");

  const verifyEmail = useCallback(
    async (verificationToken: string, userIdParam: string) => {
      try {
        const response = await verifyEmailRequest(
          verificationToken,
          userIdParam
        );

        if (response.error) {
          setVerificationState("error");
          toast.error("Verificare eșuată", {
            description: response.message,
          });
          return;
        }

        setVerificationState("success");

        // Auto-login the user (backend always returns login data)
        if (response.user && response.token) {
          dispatch(setUser(response.user));
          setSession(response.token);

          toast.success("Email verificat și conectat!", {
            description: "Te-ai conectat cu succes.",
          });

          // Redirect to dashboard after successful verification and login
          setTimeout(() => {
            router.push(paths.dashboard.root);
          }, 2000);
        } else {
          // Fallback if no login data (shouldn't happen with your backend)
          toast.success("Email verificat!", {
            description: "Emailul tău a fost verificat cu succes.",
          });

          setTimeout(() => {
            router.push(paths.auth.login);
          }, 3000);
        }
      } catch (error) {
        setVerificationState("error");
        toast.error("Verificare eșuată!", {
          description:
            error instanceof Error
              ? error.message
              : "Încearcă din nou mai târziu.",
        });
      }
    },
    [router, dispatch]
  );

  useEffect(() => {
    // If no token or userId, show manual verification state
    if (!token || !userId) {
      setVerificationState("manual");

      // Try to get email from localStorage (from login flow)
      const storedEmail = localStorage.getItem("verificationEmail");
      if (storedEmail) {
        setUserEmail(storedEmail);
        // Clear it after using it
        localStorage.removeItem("verificationEmail");
      }

      return;
    }

    verifyEmail(token, userId);
  }, [token, userId, verifyEmail]);

  const handleResendVerification = async () => {
    if (!userEmail) {
      toast.error("Email necesar", {
        description: "Te rugăm să introduci adresa de email.",
      });
      return;
    }

    setIsResending(true);
    try {
      const response = await resendVerificationEmailRequest(userEmail);

      if (response.error) {
        toast.error("Retrimitere eșuată", {
          description: response.message,
        });
        return;
      }

      toast.success("Email retrimis!", {
        description: "Un nou email de verificare a fost trimis.",
      });
    } catch (error) {
      toast.error("Retrimitere eșuată!", {
        description:
          error instanceof Error
            ? error.message
            : "Încearcă din nou mai târziu.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (verificationState) {
      case "loading":
        return (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold">
                <Typography variant="h2" as="h1">
                  Verificare email
                </Typography>
              </CardTitle>
              <CardDescription>
                <Typography>Se verifică emailul tău...</Typography>
              </CardDescription>
            </CardHeader>
          </>
        );

      case "success":
        return (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold">
                <Typography variant="h2" as="h1">
                  Email verificat și conectat!
                </Typography>
              </CardTitle>
              <CardDescription>
                <Typography>
                  Emailul tău a fost verificat cu succes și ai fost conectat
                  automat. Vei fi redirecționat către aplicație în câteva
                  secunde.
                </Typography>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full">
                <Link href={paths.dashboard.root}>Mergi la aplicație</Link>
              </Button>
            </CardContent>
          </>
        );

      case "error":
        return (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold">
                <Typography variant="h2" as="h1">
                  Verificare eșuată
                </Typography>
              </CardTitle>
              <CardDescription>
                <Typography>
                  {!token || !userId
                    ? "Linkul de verificare este invalid sau nu conține toate informațiile necesare."
                    : "Linkul de verificare este invalid sau a expirat. Te rugăm să încerci din nou."}
                </Typography>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Typography className="text-sm font-medium">
                  Adresa de email:
                </Typography>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  />
                </div>
              </div>
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full">
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Se retrimite...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Retrimite emailul de verificare
                  </>
                )}
              </Button>
            </CardContent>
          </>
        );

      case "manual":
        return (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-blue-500" />
              </div>
              <CardTitle className="text-2xl font-bold">
                <Typography variant="h2" as="h1">
                  Verificare email
                </Typography>
              </CardTitle>
              <CardDescription>
                <Typography>
                  Pentru a continua, te rugăm să îți verifici emailul. Dacă nu
                  ai primit emailul de verificare, poți solicita unul nou.
                </Typography>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Typography className="text-sm font-medium">
                  Adresa de email:
                </Typography>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  />
                </div>
              </div>
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full">
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Se retrimite...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Trimite emailul de verificare
                  </>
                )}
              </Button>
            </CardContent>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="mx-auto">
      {renderContent()}
      <CardFooter className="flex justify-center border-t pt-4">
        <div className="text-sm text-center text-muted-foreground">
          Ai nevoie de ajutor?{" "}
          <Link
            href={paths.auth.login}
            className="text-primary hover:underline">
            Întoarce-te la autentificare
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmailVerificationForm;
