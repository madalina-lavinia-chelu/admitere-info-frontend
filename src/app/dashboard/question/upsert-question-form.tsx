"use client";

import React from "react";
import { Form } from "@/components/ui/form";
import useSWR, { mutate } from "swr";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  getQuestionFormValues,
  questionFormSchema,
  QuestionFormValues,
  TYPES,
} from "./config";
import FormInputContainer from "@/components/form-input-container";
import { FormRichTextEditor } from "@/components/ui/form-rich-text-editor";
import { FormAutocomplete } from "@/components/ui/form-autocomplete";
import { withRevalidateOnMount } from "@/utils/api.utils";
import { ApiResponseType, ModeType } from "@/types/types";
import {
  getChaptersRequest,
  getDifficultiesRequest,
  getSourcesRequest,
  upsertQuestionRequest,
} from "@/requests/question.requests";
import { FormHierarchicalAutocomplete } from "@/components/ui/form-hierarchical-autocomplete";
import { QuestionAnswers } from "@/components/question-answers";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye } from "@phosphor-icons/react";

const QuestionForm = () => {
  const router = useRouter();
  const question = useAppSelector((state) => state.general.selectedQuestion);
  const mode: ModeType = question ? "edit" : "create";

  const initialValues = getQuestionFormValues(question);

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (question) {
      const values = getQuestionFormValues(question);
      Object.entries(values).forEach(([key, value]) => {
        form.setValue(key as any, value);
      });
    }
  }, [question, form]);

  const {
    data: difficultiesData,
    error: difficultiesError,
    mutate: mutateDifficulties,
  } = useSWR<ApiResponseType>(
    "difficulties",
    () => getDifficultiesRequest(),
    withRevalidateOnMount
  );

  const difficulties = React.useMemo(() => {
    if (difficultiesError) {
      console.error("Error fetching difficulties:", difficultiesError);
      return [];
    }
    return Array.isArray(difficultiesData?.data) ? difficultiesData.data : [];
  }, [difficultiesData, difficultiesError]);

  const {
    data: chaptersData,
    error: chaptersError,
    mutate: mutateChapters,
  } = useSWR<ApiResponseType>(
    "chapters",
    () => getChaptersRequest(),
    withRevalidateOnMount
  );

  const chapters = React.useMemo(() => {
    if (chaptersError) {
      console.error("Error fetching chapters:", chaptersError);
      return [];
    }
    return Array.isArray(chaptersData?.data) ? chaptersData.data : [];
  }, [chaptersData, chaptersError]);

  const {
    data: sourcesData,
    error: sourcesError,
    mutate: mutateSources,
  } = useSWR<ApiResponseType>(
    "sources",
    () => getSourcesRequest(),
    withRevalidateOnMount
  );

  const sources = React.useMemo(() => {
    if (sourcesError) {
      console.error("Error fetching sources:", sourcesError);
      return [];
    }
    return Array.isArray(sourcesData?.data) ? sourcesData.data : [];
  }, [sourcesData, sourcesError]);

  // Auto-refresh data if any of the arrays are empty after component mount
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (difficulties.length === 0 && !difficultiesError) {
        console.log("Refreshing difficulties data...");
        mutateDifficulties();
      }
      if (chapters.length === 0 && !chaptersError) {
        console.log("Refreshing chapters data...");
        mutateChapters();
      }
      if (sources.length === 0 && !sourcesError) {
        console.log("Refreshing sources data...");
        mutateSources();
      }
    }, 1000); // Wait 1 second after mount to check

    return () => clearTimeout(timeout);
  }, [
    difficulties.length,
    chapters.length,
    sources.length,
    difficultiesError,
    chaptersError,
    sourcesError,
    mutateDifficulties,
    mutateChapters,
    mutateSources,
  ]);

  const onSubmit = async (data: QuestionFormValues) => {
    console.log("Form data", data);

    try {
      const payload = { ...data };

      if (mode === "edit" && question) {
        payload.id = question.id;
      }

      const response = await upsertQuestionRequest(payload);

      if (response.error) {
        toast.error("Eroare", {
          description: response.message,
        });
        return;
      }

      await mutate(`question-${response?.data.id}`);

      if (mode === "create") {
        router.push(`${paths.dashboard.question.edit(response?.data.id)}`);
      }

      toast.success("Succes", {
        description:
          mode === "edit"
            ? "Ai actualizat cu succes întrebarea"
            : "Ai creat cu succes o întrebare",
      });
    } catch (error) {
      toast.error("Eroare", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <FormInputContainer columns={1}>
          <FormRichTextEditor
            useContainer={false}
            name="question_text"
            label="Textul întrebării"
            onChange={(value) => {
              form.setValue("question_text", value as any);
            }}
          />
        </FormInputContainer>
        <FormInputContainer columns={2}>
          <FormAutocomplete
            name="type"
            label="Tip"
            placeholder="Selectează un tip"
            options={TYPES}
          />
          <FormAutocomplete
            name="difficulty_id"
            label="Dificultate"
            placeholder="Selectează o dificultate"
            options={difficulties}
          />
          <FormAutocomplete
            name="source_id"
            label="Sursă"
            placeholder="Selectează o sursă"
            options={sources}
          />
          <FormAutocomplete
            name="is_free"
            label="Plan disponibilitate"
            placeholder="Selectează planul"
            options={[
              { id: "true", name: "Plan Gratuit" },
              { id: "false", name: "Plan Pro" },
            ]}
          />
          <FormHierarchicalAutocomplete
            options={chapters}
            name="chapter_ids"
            label="Capitole"
            placeholder="Selectează capitolele"
            multiple
          />
        </FormInputContainer>
        <FormInputContainer columns={1}>
          <QuestionAnswers name="answers" label="Răspunsuri" />
        </FormInputContainer>
        <FormInputContainer columns={2}>
          <FormRichTextEditor
            name="hint"
            label="Hint"
            onChange={(value) => {
              form.setValue("hint", value as any);
            }}
            useContainer={false}
          />
          <FormRichTextEditor
            name="explanation"
            label="Explicație"
            onChange={(value) => {
              form.setValue("explanation", value as any);
            }}
            useContainer={false}
          />
        </FormInputContainer>{" "}
        <div className="flex items-center justify-end gap-2">
          {mode === "edit" && (
            <Button type="button" variant="outline">
              <Link href={paths.dashboard.question.preview(question?.id || "")}>
                Previzualizare
              </Link>
              <Eye className="ml-2 h-4 w-4" />
            </Button>
          )}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Se încarcă..."
              : mode === "create"
              ? "Crează întrebare"
              : "Salvează întrebare"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
