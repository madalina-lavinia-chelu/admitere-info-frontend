// src/schemas/auth.ts
import { VALIDATION_MESSAGES } from "@/utils/validation-messages";
import { z } from "zod";

export const signupFormSchema = z.object({
  first_name: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED }),
  last_name: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED }),
  email: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
    .email({ message: VALIDATION_MESSAGES.EMAIL.INVALID }),
  password: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
    .min(8, { message: VALIDATION_MESSAGES.STRING.MIN("Parola", 8) }),
  password_confirmation: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
    .min(8, { message: VALIDATION_MESSAGES.STRING.MIN("Parola", 8) }),
});

export type SignupFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export const signupFormDefaults: SignupFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password_confirmation: "",
};
