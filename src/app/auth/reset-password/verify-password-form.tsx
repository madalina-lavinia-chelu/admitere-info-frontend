"use client";

import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import FormInput from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  requestResetFormDefaults,
  requestResetFormSchema,
  RequestResetFormValues,
  resetPasswordFormDefaults,
  resetPasswordFormSchema,
  ResetPasswordFormValues,
} from "./config";
import { Typography } from "@/components/typography";
import {
  requestPasswordResetRequest,
  resetPasswordRequest,
} from "@/requests/auth/auth.requests";
import Link from "next/link";
import { paths } from "@/routes/paths";
import { ArrowLeft, Clock, Mail } from "lucide-react";

const VerifyPasswordForm = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [resetEmail, setResetEmail] = useState("");
  const [expiresInMinutes, setExpiresInMinutes] = useState(15);

  // Step 1 form - Request reset
  const requestForm = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetFormSchema),
    defaultValues: requestResetFormDefaults,
  });

  // Step 2 form - Reset password
  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: resetPasswordFormDefaults,
  });

  const onRequestReset = async (data: RequestResetFormValues) => {
    try {
      const response = await requestPasswordResetRequest({
        email: data.email,
      });

      if (response.error) {
        toast.error("Solicitare eșuată", {
          description: response.message,
        });
        return;
      }
      setResetEmail(data.email);
      setExpiresInMinutes(response.expires_in_minutes || 15); // Pre-fill email in step 2 form and ensure other fields are empty
      resetForm.reset({
        email: data.email,
        code: "",
        new_password: "",
        new_password_confirmation: "",
      });

      toast.success("Cod trimis!", {
        description: "Codul de resetare a fost trimis pe email.",
      });

      setStep(2);
    } catch (error) {
      toast.error("Solicitare eșuată!", {
        description:
          error instanceof Error
            ? error.message
            : "Încearcă din nou mai târziu.",
      });
    }
  };
  const onResetPassword = async (data: ResetPasswordFormValues) => {
    try {
      const response = await resetPasswordRequest({
        email: data.email,
        code: data.code,
        new_password: data.new_password,
        new_password_confirmation: data.new_password_confirmation,
      });

      if (response.error) {
        toast.error("Resetare eșuată", {
          description: response.message,
        });
        return;
      }

      toast.success("Parolă schimbată!", {
        description: "Parola a fost schimbată cu succes.",
      });

      // Redirect to login after successful reset
      window.location.href = paths.auth.login;
    } catch (error) {
      toast.error("Resetare eșuată!", {
        description:
          error instanceof Error
            ? error.message
            : "Încearcă din nou mai târziu.",
      });
    }
  };

  const goBackToStep1 = () => {
    setStep(1);
    setResetEmail("");
    resetForm.reset();
  };

  if (step === 1) {
    return (
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            <Typography variant="h2" as="h1">
              Resetare parolă
            </Typography>
          </CardTitle>
          <CardDescription>
            <Typography>
              Introdu adresa de email pentru a primi codul de resetare.
            </Typography>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...requestForm}>
            <form
              onSubmit={requestForm.handleSubmit(onRequestReset)}
              className="space-y-4">
              <FormInput
                control={requestForm.control}
                name="email"
                label="Email"
                placeholder="nume@exemplu.com"
                type="email"
                autoComplete="email"
              />
              <SubmitButton
                isSubmitting={requestForm.formState.isSubmitting}
                loadingText="Se trimite codul..."
                createText="Trimite cod"
                className="w-full"
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <div className="text-sm text-center text-muted-foreground">
            Îți amintești parola?{" "}
            <Link
              href={paths.auth.login}
              className="text-primary hover:underline">
              Conectează-te
            </Link>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBackToStep1}
            className="p-2 h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold">
            <Typography variant="h2" as="h1">
              Schimbă parola
            </Typography>
          </CardTitle>
        </div>
        <CardDescription>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <Typography className="text-muted-foreground">
                Cod trimis la: <span className="font-medium">{resetEmail}</span>
              </Typography>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <Typography className="text-muted-foreground">
                Codul expiră în {expiresInMinutes} minute
              </Typography>
            </div>
          </div>
        </CardDescription>
      </CardHeader>{" "}
      <CardContent>
        <Form {...resetForm}>
          <form
            onSubmit={resetForm.handleSubmit(onResetPassword)}
            className="space-y-4">
            {/* Hidden email field */}
            <input
              type="hidden"
              {...resetForm.register("email")}
              value={resetEmail}
            />
            <FormField
              control={resetForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cod de verificare</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      onComplete={(value) => {
                        field.onChange(value);
                      }}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormInput
              control={resetForm.control}
              name="new_password"
              label="Parola nouă"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              showPasswordToggle={true}
            />
            <FormInput
              control={resetForm.control}
              name="new_password_confirmation"
              label="Confirmă parola nouă"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              showPasswordToggle={true}
            />
            <SubmitButton
              isSubmitting={resetForm.formState.isSubmitting}
              loadingText="Se schimbă parola..."
              createText="Schimbă parola"
              className="w-full"
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <div className="text-sm text-center text-muted-foreground">
          Nu ai primit codul?{" "}
          <button
            type="button"
            onClick={goBackToStep1}
            className="text-primary hover:underline">
            Trimite din nou
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VerifyPasswordForm;
