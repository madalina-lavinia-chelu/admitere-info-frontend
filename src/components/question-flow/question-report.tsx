"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { reportQuestionIssue } from "@/requests/feedback.requests";
import { VALIDATION_MESSAGES } from "@/utils/validation-messages";
import { Flag } from "@phosphor-icons/react";

// Schema
const questionReportSchema = z.object({
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

type QuestionReportFormValues = {
  subject: string;
  description: string;
};

const defaultValues: QuestionReportFormValues = {
  subject: "",
  description: "",
};

interface QuestionReportProps {
  questionId: number;
}

export function QuestionReport({ questionId }: QuestionReportProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const form = useForm<QuestionReportFormValues>({
    resolver: zodResolver(questionReportSchema),
    defaultValues,
    mode: "onChange",
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
    }
  }, [open, form]);

  const onSubmit = useCallback(
    async (data: QuestionReportFormValues) => {
      try {
        const response = await reportQuestionIssue({
          question_id: questionId,
          subject: data.subject,
          description: data.description,
        });

        if (response.error) {
          toast.error("Raportarea problemei a eșuat", {
            description: response.message,
          });
          return;
        }

        toast.success("Problemă raportată cu succes!", {
          description: "Mulțumim pentru feedback! Vom investiga problema.",
        });

        form.reset(defaultValues);
        setOpen(false);
      } catch (error) {
        toast.error("Raportarea problemei a eșuat", {
          description:
            error instanceof Error
              ? error.message
              : "Încearcă din nou mai târziu.",
        });
      }
    },
    [questionId, form]
  );

  const TriggerIcon = (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto w-auto p-2 hover:bg-red-100 dark:hover:bg-red-900/40">
      <Flag
        className="text-red-500 dark:text-red-400"
        size={isMobile ? 20 : 24}
        style={{
          width: isMobile ? 24 : 28,
          height: isMobile ? 24 : 28,
        }}
      />
    </Button>
  );

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>{TriggerIcon}</DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Raportează o problemă cu această întrebare</p>
        </TooltipContent>
      </Tooltip>
      <DrawerContent>
        <DrawerHeader className="mb-4">
          <DrawerTitle className="text-2xl tracking-tight">
            Raportează o problemă
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                control={form.control}
                name="subject"
                label="Subiectul problemei"
                placeholder="ex: Răspuns greșit marcat ca corect"
                type="text"
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrierea problemei</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Te rugăm să descrii problema în detaliu. De exemplu: ce răspuns crezi că este corect și de ce, sau ce eroare ai observat..."
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
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{TriggerIcon}</DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Raportează o problemă cu această întrebare</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent
        className="max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl tracking-tight">
            Raportează o problemă
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              control={form.control}
              name="subject"
              label="Subiectul problemei"
              placeholder="ex: Răspuns greșit marcat ca corect"
              type="text"
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrierea problemei</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Te rugăm să descrii problema în detaliu. De exemplu: ce răspuns crezi că este corect și de ce, sau ce eroare ai observat..."
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
      </DialogContent>
    </Dialog>
  );
}
