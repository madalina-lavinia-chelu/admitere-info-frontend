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
import { loginFormDefaults, loginFormSchema, LoginFormValues } from "./config";
import { Typography } from "@/components/typography";
import { loginUserRequest } from "@/requests/auth/auth.requests";
import { useAppDispatch } from "@/redux/store";
import { setUser } from "@/redux/slices/auth";
import { setSession } from "@/auth/utils";
import Link from "next/link";
import { paths } from "@/routes/paths";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormDefaults,
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginUserRequest({
        email: data.email,
        password: data.password,
      });

      if (response.error) {
        if (response.email_not_verified) {
          toast.error("Email neverificat", {
            description: response.message,
          });

          const emailToStore = response.email || data.email;
          localStorage.setItem("verificationEmail", emailToStore);

          router.push(paths.auth.verifyEmail);
          return;
        }

        toast.error("Login failed", {
          description: response.message,
        });
        return;
      }

      dispatch(setUser(response.user));

      setSession(response.token);

      toast.success("Te-ai conectat!", {
        description: "Conectarea a fost efectuată cu succes.",
      });
    } catch (error) {
      toast.error("Conectare eșuată!", {
        description:
          error instanceof Error
            ? error.message
            : "Încearcă din nou mai târziu.",
      });
    }
  };

  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Typography variant="h2" as="h1">
            Conectare
          </Typography>
        </CardTitle>
        <CardDescription>
          <Typography>Introdu datele de conectare.</Typography>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              autoComplete="current-password"
              showPasswordToggle={true}
            />{" "}
            <SubmitButton
              isSubmitting={form.formState.isSubmitting}
              loadingText="Se conectează..."
              createText="Login"
              className="w-full"
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <div className="text-sm text-center text-muted-foreground">
          <Link
            href={paths.auth.resetPassword}
            className="text-primary hover:underline">
            Ți-ai uitat parola?
          </Link>
          <div className="mt-2">
            Nu ai cont?{" "}
            <Link
              href={paths.auth.register}
              className="text-primary hover:underline">
              Înregistrează-te
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
