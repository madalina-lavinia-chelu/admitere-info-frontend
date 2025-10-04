// components/auth/LoginForm.tsx
"use client";

import { Form } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import FormInput from "@/components/ui/form-input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  getProfileFormValues,
  updateProfileFormSchema,
  updateProfileFormValues,
} from "./config";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import FormInputContainer from "@/components/form-input-container";
import { updateProfileRequest } from "@/requests/user.requests";
import { setUser } from "@/redux/slices/auth";
import { useEffect } from "react";
import { Separator } from "@radix-ui/react-separator";
import { Typography } from "@/components/typography";

const UpdateProfileForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user as any);

  const initialValues = getProfileFormValues(user);

  const form = useForm<updateProfileFormValues>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (user) {
      const values = getProfileFormValues(user);
      Object.entries(values).forEach(([key, value]) => {
        form.setValue(key as any, value);
      });
    }
  }, [user, form]);

  const onSubmit = async (data: updateProfileFormValues) => {
    try {
      const response = await updateProfileRequest(data);

      if (response.error) {
        toast.error("Ceva nu a mers bine.", {
          description: response.message,
        });
        return;
      }

      dispatch(setUser(response.user));

      toast.success("Succes!", {
        description: "Datele au fost actualizate cu succes.",
      });

      form.reset(getProfileFormValues(response.data));
    } catch (error) {
      toast.error("Ceva nu a mers bine.", {
        description:
          error instanceof Error ? error.message : "Încearcă din nou.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInputContainer>
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
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
          />
        </FormInputContainer>
        <Typography variant="h3">Schimbă parola</Typography>
        <Separator className="my-2" />
        <FormInputContainer withSpacing={false}>
          <FormInput
            control={form.control}
            name="current_password"
            label="Parola veche"
            placeholder="••••••••"
            type="password"
            autoComplete="new-password"
            showPasswordToggle={true}
          />
          <FormInput
            control={form.control}
            name="new_password"
            label="Parola nouă"
            placeholder="••••••••"
            type="password"
            autoComplete="new-password"
            showPasswordToggle={true}
          />{" "}
        </FormInputContainer>
        <SubmitButton
          isSubmitting={form.formState.isSubmitting}
          loadingText="Se creează contul..."
          createText="Actualizează"
          className="w-full"
        />
      </form>
    </Form>
  );
};

export default UpdateProfileForm;
