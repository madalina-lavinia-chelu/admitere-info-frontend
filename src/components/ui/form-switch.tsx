"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface FormSwitchProps {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}

export function FormSwitch({
  name,
  label,
  description,
  defaultChecked = false,
}: FormSwitchProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // Convert any non-boolean value to boolean
        const isChecked =
          field.value === true || field.value === 1 || field.value === "true";

        return (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel className="text-base">{label}</FormLabel>
              {description && <FormDescription>{description}</FormDescription>}
            </div>
            <FormControl>
              <Switch
                checked={isChecked}
                onCheckedChange={(checked) => {
                  // Always pass a boolean to onChange
                  field.onChange(checked);
                }}
                disabled={field.disabled}
                defaultChecked={defaultChecked}
                aria-readonly={field.disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default FormSwitch;
