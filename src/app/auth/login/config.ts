// src/schemas/auth.ts
import { VALIDATION_MESSAGES } from "@/utils/validation-messages";
import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
    .email({ message: VALIDATION_MESSAGES.EMAIL.INVALID }),
  password: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
    .min(8, { message: VALIDATION_MESSAGES.STRING.MIN("Parola", 8) }),
});

export type LoginFormValues = {
  email: string;
  password: string;
};

export const loginFormDefaults: LoginFormValues = {
  email: "",
  password: "",
};
