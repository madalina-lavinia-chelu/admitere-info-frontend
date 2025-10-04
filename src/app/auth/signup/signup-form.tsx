// components/auth/LoginForm.tsx
"use client";

import { Form } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import FormInput from "@/components/ui/form-input";

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
  signupFormDefaults,
  signupFormSchema,
  SignupFormValues,
} from "./config";
import { Typography } from "@/components/typography";
import { signupUserRequest } from "@/requests/auth/auth.requests";
import { useAppDispatch } from "@/redux/store";
import { setInitialEmail } from "@/redux/slices/app-settings";
import { paths } from "@/routes/paths";
import Link from "next/link";
import FormInputContainer from "@/components/form-input-container";

const SignupForm = () => {
  const dispatch = useAppDispatch();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: signupFormDefaults,
  });

  const onSubmit = async (data: SignupFormValues) => {
    if (data.password !== data.password_confirmation) {
      toast.error("Parolele nu se potrivesc", {
        description: "Te rugăm să verifici parolele introduse",
      });
      return;
    }

    try {
      const response = await signupUserRequest({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
      });

      if (response.error) {
        toast.error("Ceva nu a mers bine.", {
          description: response.message,
        });
        return;
      }

      dispatch(setInitialEmail(data.email));

      // Don't set user session until email is verified
      // dispatch(setUser(response.user));
      // setSession(response.token);

      toast.success("Contul a fost creat!", {
        description: "Te rugăm să îți verifici emailul pentru a continua.",
      });

      // Redirect to email verification page
      window.location.href = paths.auth.verifyEmail;
    } catch (error) {
      toast.error("Ceva nu a mers bine.", {
        description:
          error instanceof Error ? error.message : "Încearcă din nou.",
      });
    }
  };

  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Typography variant="h2" as="h1">
            Înregistrare
          </Typography>
        </CardTitle>
        <CardDescription>
          <Typography>Introdu datele de înregistrare.</Typography>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInputContainer withSpacing={false}>
              <FormInput
                control={form.control}
                name="first_name"
                label="Prenume"
                placeholder="Prenume"
                autoComplete="given-name"
              />
              <FormInput
                control={form.control}
                name="last_name"
                label="Nume"
                placeholder="Nume"
                autoComplete="family-name"
              />
            </FormInputContainer>
            <FormInput
              control={form.control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
            />
            <FormInput
              control={form.control}
              name="password"
              label="Parolă"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              showPasswordToggle={true}
            />
            <FormInput
              control={form.control}
              name="password_confirmation"
              label="Confirmă Parola"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              showPasswordToggle={true}
            />{" "}
            <SubmitButton
              isSubmitting={form.formState.isSubmitting}
              loadingText="Se creează contul..."
              createText="Înregistrează-te"
              className="w-full"
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <div className="text-sm text-center text-muted-foreground">
          Ai deja cont?{" "}
          <Link
            href={paths.auth.login}
            className="text-primary hover:underline">
            Conectează-te
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
