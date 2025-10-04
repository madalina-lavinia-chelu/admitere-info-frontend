"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormRichTextEditor } from "@/components/ui/form-rich-text-editor";
import { PlusCircle, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { QuestionFormValues } from "@/app/dashboard/question/config";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FormLabel } from "@/components/ui/form";

interface QuestionAnswersProps {
  name: string;
  label?: string;
  className?: string;
}

export function QuestionAnswers({
  name,
  label = "Răspunsuri",
  className,
}: QuestionAnswersProps) {
  const { control, getValues, setValue, watch, formState, trigger } =
    useFormContext<QuestionFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

  const questionType = watch("type");
  const isMultipleChoice = questionType === "multiple";

  const handleAddAnswer = React.useCallback(() => {
    append({
      answer_text: "",
      is_correct: false,
    });
    // Trigger validation after adding new answer
    setTimeout(() => trigger("answers"), 100);
  }, [append, trigger]);

  React.useEffect(() => {
    if (fields.length === 0) {
      handleAddAnswer();
    }
  }, [fields.length, handleAddAnswer]);

  const handleCorrectChange = (index: number, checked: boolean) => {
    if (!isMultipleChoice && checked) {
      const currentAnswers = getValues("answers");
      currentAnswers.forEach((_, i) => {
        if (i !== index) {
          setValue(`answers.${i}.is_correct`, false);
        }
      });
    }

    setValue(`answers.${index}.is_correct`, checked);
    // Trigger validation after changing correct status
    setTimeout(() => trigger("answers"), 100);
  };

  const handleRemoveAnswer = (index: number) => {
    remove(index);
    // Trigger validation after removing answer
    setTimeout(() => trigger("answers"), 100);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <FormLabel>{label}</FormLabel>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddAnswer}
          className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Adaugă răspuns</span>
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <div>
                  <Checkbox
                    checked={watch(`answers.${index}.is_correct`)}
                    onCheckedChange={(checked) =>
                      handleCorrectChange(index, checked === true)
                    }
                    aria-label="Răspuns corect"
                  />
                </div>
                <div className="flex-1">
                  <FormRichTextEditor
                    name={`answers.${index}.answer_text`}
                    label={`Răspunsul ${index + 1}`}
                    onChange={(value) => {
                      setValue(`answers.${index}.answer_text`, value as any);
                      trigger(`answers.${index}.answer_text`);
                    }}
                    useContainer={false}
                  />
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAnswer(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 self-start"
                    aria-label="Șterge răspunsul">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        {isMultipleChoice
          ? "Poți selecta mai multe răspunsuri corecte."
          : "Doar un singur răspuns poate fi corect."}
      </div>
      {formState.errors.answers && (
        <div className="text-sm font-medium text-destructive">
          {formState.errors.answers.message ||
            (formState.errors.answers as any)?.root?.message}
        </div>
      )}
    </div>
  );
}

export default QuestionAnswers;
