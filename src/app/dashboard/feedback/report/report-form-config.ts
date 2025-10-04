import { VALIDATION_MESSAGES } from "@/utils/validation-messages";
import { z } from "zod";

export const reportFormSchema = z.object({
  subject: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
    .min(3, { message: VALIDATION_MESSAGES.STRING.MIN("Subiectul", 3) })
    .max(500, { message: VALIDATION_MESSAGES.STRING.MAX("Subiectul", 500) }),
  description: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
    .min(10, { message: VALIDATION_MESSAGES.STRING.MIN("Descrierea", 10) })
    .max(2000, { message: VALIDATION_MESSAGES.STRING.MAX("Descrierea", 2000) }),
});

export type ReportFormValues = {
  subject: string;
  description: string;
};

export const reportFormDefaults: ReportFormValues = {
  subject: "",
  description: "",
};
