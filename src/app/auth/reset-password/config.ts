import { VALIDATION_MESSAGES } from "@/utils/validation-messages";
import { z } from "zod";

// Step 1: Request password reset
export const requestResetFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
    .email({ message: VALIDATION_MESSAGES.EMAIL.INVALID }),
});

export type RequestResetFormValues = {
  email: string;
};

export const requestResetFormDefaults: RequestResetFormValues = {
  email: "",
};

// Step 2: Reset password with code
export const resetPasswordFormSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
      .email({ message: VALIDATION_MESSAGES.EMAIL.INVALID }),
    code: z
      .string()
      .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
      .length(6, { message: "Codul trebuie să aibă exact 6 cifre" }),
    new_password: z
      .string()
      .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
      .min(8, { message: VALIDATION_MESSAGES.STRING.MIN("Parola nouă", 8) }),
    new_password_confirmation: z
      .string()
      .min(1, { message: VALIDATION_MESSAGES.REQUIRED }),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Parolele nu se potrivesc",
    path: ["new_password_confirmation"],
  });

export type ResetPasswordFormValues = {
  email: string;
  code: string;
  new_password: string;
  new_password_confirmation: string;
};

export const resetPasswordFormDefaults: ResetPasswordFormValues = {
  email: "",
  code: "",
  new_password: "",
  new_password_confirmation: "",
};
