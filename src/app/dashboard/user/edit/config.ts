// src/schemas/auth.ts
import { VALIDATION_MESSAGES } from "@/utils/validation-messages";
import { z } from "zod";

// Define user form schema
export const updateUserFormSchema = z.object({
  id: z.number().int().positive({ message: VALIDATION_MESSAGES.REQUIRED }),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  new_password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: VALIDATION_MESSAGES.STRING.MIN("Parola", 8),
    })
    .nullable(),
  role_id: z.number().int().positive().nullable().optional(),
  is_active: z.boolean().nullable().optional(),
  email_verified: z.boolean().nullable().optional(),
});

export type UpdateUserFormValues = {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  new_password?: string | null;
  role_id?: number | null;
  is_active?: boolean | null;
  email_verified?: boolean | null;
};

const userFormDefaults: UpdateUserFormValues = {
  id: 0,
  first_name: "",
  last_name: "",
  email: "",
  new_password: "",
  role_id: null,
  is_active: true,
  email_verified: false,
};

export const getUpdateUserFormValues = (user: UpdateUserFormValues | null) => {
  if (!user) return userFormDefaults;

  return {
    id: user.id || userFormDefaults.id,
    first_name:
      user.first_name !== undefined
        ? user.first_name
        : userFormDefaults.first_name,
    last_name:
      user.last_name !== undefined
        ? user.last_name
        : userFormDefaults.last_name,
    email: user.email !== undefined ? user.email : userFormDefaults.email,
    new_password:
      user.new_password !== undefined
        ? user.new_password
        : userFormDefaults.new_password,
    role_id:
      user.role_id !== undefined ? user.role_id : userFormDefaults.role_id,
    is_active:
      user.is_active !== undefined
        ? Boolean(user.is_active)
        : userFormDefaults.is_active,
    email_verified:
      user.email_verified !== undefined
        ? Boolean(user.email_verified)
        : userFormDefaults.email_verified,
  };
};
