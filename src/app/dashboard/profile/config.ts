// src/schemas/auth.ts
import { VALIDATION_MESSAGES } from "@/utils/validation-messages";
import { z } from "zod";

export const updateProfileFormSchema = z.object({
  first_name: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED }),
  last_name: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED }),
  email: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
    .email({ message: VALIDATION_MESSAGES.EMAIL.INVALID }),
  current_password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: VALIDATION_MESSAGES.STRING.MIN("Parola", 8),
    }),
  new_password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: VALIDATION_MESSAGES.STRING.MIN("Parola", 8),
    }),
});

export type updateProfileFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  current_password?: string;
  new_password?: string;
};

export const updateProfileFormDefaults: updateProfileFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  current_password: "",
  new_password: "",
};

export const getProfileFormValues = (user: updateProfileFormValues | null) => {
  if (!user) return updateProfileFormDefaults;

  return {
    first_name: user.first_name || updateProfileFormDefaults.first_name,
    last_name: user.last_name || updateProfileFormDefaults.last_name,
    email: user.email || updateProfileFormDefaults.email,
    current_password: updateProfileFormDefaults.current_password,
    new_password: updateProfileFormDefaults.new_password,
  };
};
