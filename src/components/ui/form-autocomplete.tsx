"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Autocomplete, AutocompleteOption } from "./autocomplete";

interface FormAutocompleteProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  options: AutocompleteOption[];
  emptyMessage?: string;
  disabled?: boolean;
  multiple?: boolean;
}

const FormAutocomplete = React.forwardRef<
  HTMLDivElement,
  FormAutocompleteProps
>(
  (
    {
      className,
      name,
      label,
      description,
      placeholder,
      options,
      emptyMessage,
      disabled,
      multiple = false,
      ...props
    },
    ref
  ) => {
    const { control } = useFormContext();

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          let currentValue;

          if (multiple) {
            currentValue = Array.isArray(field.value) ? field.value : [];
          } else {
            if (Array.isArray(field.value)) {
              currentValue = field.value.length > 0 ? field.value[0] : null;
            } else {
              currentValue = field.value || null;
            }
          }

          return (
            <FormItem
              className={cn("space-y-2", className)}
              ref={ref}
              {...props}>
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <Autocomplete
                  options={options}
                  value={currentValue}
                  onChange={(value: any) => {
                    field.onChange(value);
                  }}
                  placeholder={placeholder}
                  emptyMessage={emptyMessage}
                  disabled={disabled}
                  multiple={multiple}
                />
              </FormControl>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  }
);

FormAutocomplete.displayName = "FormAutocomplete";

export { FormAutocomplete };
