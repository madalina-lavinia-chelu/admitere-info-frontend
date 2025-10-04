"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import FormInput from "@/components/ui/form-input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  reportFormSchema,
  reportFormDefaults,
  ReportFormValues,
} from "./report-form-config";
import { reportGeneralIssue } from "@/requests/feedback.requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportForm() {
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: reportFormDefaults,
  });

  const onSubmit = async (data: ReportFormValues) => {
    try {
      const response = await reportGeneralIssue(data);

      if (response.error) {
        toast.error("Raportarea problemei a eșuat", {
          description: response.message,
        });
        return;
      }

      toast.success("Problemă raportată cu succes!", {
        description: "Mulțumim pentru feedback-ul tău. Vom investiga problema.",
      });

      // Reset the form after successful submission
      form.reset();
    } catch (error) {
      toast.error("Raportarea problemei a eșuat", {
        description:
          error instanceof Error
            ? error.message
            : "Încearcă din nou mai târziu.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            control={form.control}
            name="subject"
            label="Subiectul problemei"
            placeholder="Descrie pe scurt problema întâlnită"
            type="text"
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrierea detaliată</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Te rugăm să descrii problema în detaliu. Include toate informațiile relevante pentru a ne ajuta să înțelegem și să rezolvăm problema."
                    rows={6}
                    className="resize-none h-44 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton
            isSubmitting={form.formState.isSubmitting}
            loadingText="Se raportează..."
            createText="Raportează problema"
            className="w-full"
          />
        </form>
      </Form>
    </div>
  );
}
