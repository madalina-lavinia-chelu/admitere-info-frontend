import { VALIDATION_MESSAGES } from "@/utils/validation-messages";
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
    .min(2, { message: VALIDATION_MESSAGES.STRING.MIN("Numele", 2) })
    .max(100, { message: VALIDATION_MESSAGES.STRING.MAX("Numele", 100) }),
  email: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
    .email({ message: VALIDATION_MESSAGES.EMAIL.INVALID }),
  subject: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
    .min(3, { message: VALIDATION_MESSAGES.STRING.MIN("Subiectul", 3) })
    .max(200, { message: VALIDATION_MESSAGES.STRING.MAX("Subiectul", 200) }),
  description: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
    .min(10, { message: VALIDATION_MESSAGES.STRING.MIN("Mesajul", 10) })
    .max(2000, { message: VALIDATION_MESSAGES.STRING.MAX("Mesajul", 2000) }),
});

export type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  description: string;
};

export const contactFormDefaults: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  description: "",
};
