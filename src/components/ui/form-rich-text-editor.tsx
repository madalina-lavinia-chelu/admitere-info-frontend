"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { RichTextEditor } from "../math-rich-text-editor";
import FormInputContainer from "../form-input-container";

interface FormRichTextEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  useContainer?: boolean;
}

const FormRichTextEditor = React.forwardRef<
  HTMLDivElement,
  FormRichTextEditorProps
>(
  (
    {
      className,
      name,
      label,
      description,
      placeholder,
      useContainer = true,
      ...props
    },
    ref
  ) => {
    const { control } = useFormContext();

    const formFieldContent = (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className} ref={ref} {...props}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <RichTextEditor value={field.value} onChange={field.onChange} />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );

    if (useContainer) {
      return <FormInputContainer>{formFieldContent}</FormInputContainer>;
    }

    return formFieldContent;
  }
);

FormRichTextEditor.displayName = "FormRichTextEditor";

export { FormRichTextEditor };
