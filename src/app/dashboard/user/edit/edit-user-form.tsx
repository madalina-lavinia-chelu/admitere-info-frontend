"use client";

import { Form } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import useSWR, { mutate } from "swr";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  getUpdateUserFormValues,
  updateUserFormSchema,
  UpdateUserFormValues,
} from "./config";
import FormInputContainer from "@/components/form-input-container";
import { FormAutocomplete } from "@/components/ui/form-autocomplete";
import { withoutRevalidateOnFocus } from "@/utils/api.utils";
import { ApiResponseType, ModeType } from "@/types/types";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { getRolesRequest, updateUserRequest } from "@/requests/user.requests";
import FormInput from "@/components/ui/form-input";
import FormSwitch from "@/components/ui/form-switch";

const EditUserForm = () => {
  const user = useAppSelector((state) => state.general.selectedUser as any);

  console.log("User", user);
  const mode: ModeType = "edit";

  const initialValues = getUpdateUserFormValues(user);

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      const values = getUpdateUserFormValues(user);
      Object.entries(values).forEach(([key, value]) => {
        form.setValue(key as any, value);
      });
    }
  }, [user, form]);

  const { data: rolesData } = useSWR<ApiResponseType>(
    "difficulties",
    () => getRolesRequest(),
    { ...withoutRevalidateOnFocus }
  );

  const roles = rolesData?.data || [];

  const onSubmit = async (data: UpdateUserFormValues) => {
    console.log("Form data", data);

    try {
      const payload = { ...data };

      payload.id = user.id;

      const response = await updateUserRequest(payload);

      if (response.error) {
        toast.error("Eroare", {
          description: response.message,
        });
        return;
      }

      await mutate(`user-${response?.data.id}`);

      toast.success("Succes", {
        description: "Ai actualizat cu succes utilizatorul",
      });
    } catch (error) {
      toast.error("Eroare", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  return (
    <Form {...form}>
      {" "}
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <FormInputContainer columns={2} withSpacing={false}>
          <FormInput
            control={form.control}
            name="last_name"
            label="Nume"
            placeholder="Nume"
          />
          <FormInput
            control={form.control}
            name="first_name"
            label="Prenume"
            placeholder="Prenume"
          />
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Email"
            type="email"
          />
          <FormInput
            control={form.control}
            name="new_password"
            label="Parola nouă"
            placeholder="Parolă nouă"
            type="password"
          />
          <FormAutocomplete
            name="role_id"
            label="Role"
            placeholder="Selectează un rol"
            options={roles}
          />
        </FormInputContainer>
        <FormInputContainer columns={2}>
          <FormSwitch
            name="is_active"
            label="Cont activ"
            description="Controlează dacă utilizatorul poate accesa aplicația"
          />
          <FormSwitch
            name="email_verified"
            label="Email validat"
            description="Indică dacă emailul utilizatorului a fost validat"
          />
        </FormInputContainer>

        <SubmitButton
          isSubmitting={form.formState.isSubmitting}
          mode={mode}
          createText="Creează grilă"
        />
      </form>
    </Form>
  );
};

export default EditUserForm;
