"use client";

import { Button } from "@/components/ui/button";
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
import MotionWrapper from "@/components/ui/motion-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Envelope,
  FacebookLogo,
  InstagramLogo,
  MapPinSimpleArea,
  Phone,
  TiktokLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import {
  contactFormSchema,
  contactFormDefaults,
  ContactFormValues,
} from "./contact-form-config";
import { submitContactForm } from "@/requests/feedback.requests";

export function ContactSection() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contactFormDefaults,
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const response = await submitContactForm(data);

      if (response.error) {
        toast.error("Trimiterea mesajului a eșuat", {
          description: response.message,
        });
        return;
      }

      toast.success("Mesaj trimis cu succes!", {
        description: "Îți vom răspunde în cel mai scurt timp.",
      });

      // Reset the form after successful submission
      form.reset();
    } catch (error) {
      toast.error("Trimiterea mesajului a eșuat", {
        description:
          error instanceof Error
            ? error.message
            : "Încearcă din nou mai târziu.",
      });
    }
  };
  return (
    <section
      id="contact"
      className="container max-w-4xl mx-auto px-4 py-16 md:py-24">
      <MotionWrapper type="fade-up" duration={0.6} delay={0.1}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Ia legătura cu noi
          </h2>
          <p className="md:text-xl text-muted-foreground tracking-tight">
            Ai întrebări? Suntem aici să te ajutăm!
          </p>
        </div>
      </MotionWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <MotionWrapper type="slide-fade-up" duration={0.6} delay={0.2}>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Informații de contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Envelope className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-muted-foreground">
                      contact@admitereinfo.ro
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium">Telefon</div>
                    <div className="text-muted-foreground">+40 123 456 789</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPinSimpleArea className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium">Adresă</div>
                    <div className="text-muted-foreground">
                      București, România
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Urmărește-ne</h3>
              <div className="flex gap-4">
                <Button variant="outline" size="icon">
                  <FacebookLogo className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon">
                  <InstagramLogo className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon">
                  <TiktokLogo className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon">
                  <YoutubeLogo className="h-6 w-6" />
                </Button>
              </div>
            </div>{" "}
          </div>
        </MotionWrapper>

        <MotionWrapper type="slide-fade-up" duration={0.6} delay={0.4}>
          <div className="bg-card rounded-xl p-6 border shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Trimite-ne un mesaj</h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4">
                <FormInput
                  control={form.control}
                  name="name"
                  label="Nume"
                  placeholder="Numele tău"
                  type="text"
                  autoComplete="name"
                />
                <FormInput
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="email@exemplu.com"
                  type="email"
                  autoComplete="email"
                />
                <FormInput
                  control={form.control}
                  name="subject"
                  label="Subiect"
                  placeholder="Subiectul mesajului"
                  type="text"
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mesaj</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Scrie mesajul tău aici..."
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SubmitButton
                  isSubmitting={form.formState.isSubmitting}
                  loadingText="Se trimite..."
                  createText="Trimite mesajul"
                  className="w-full"
                />
              </form>
            </Form>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
