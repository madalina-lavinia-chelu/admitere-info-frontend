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
import {
  HierarchicalAutocomplete,
  HierarchicalOption,
} from "./hierarchical-autocomplete";

interface FormHierarchicalAutocompleteProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  options: HierarchicalOption[];
  emptyMessage?: string;
  disabled?: boolean;
  multiple?: boolean;
  /**
   * Show expanded/collapsed state for parent items
   * @default true
   */
  expandable?: boolean;
  /**
   * Select parent and all children when a parent is selected (only in multiple mode)
   * @default false
   */
  selectChildrenWithParent?: boolean;
  /**
   * Indent child items to show hierarchy
   * @default true
   */
  showIndentation?: boolean;
  /**
   * Initial expanded state for parent items
   * @default true
   */
  defaultExpanded?: boolean;
}

const FormHierarchicalAutocomplete = React.forwardRef<
  HTMLDivElement,
  FormHierarchicalAutocompleteProps
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
      expandable = true,
      selectChildrenWithParent = false,
      showIndentation = true,
      defaultExpanded = true,
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
            // For multiple selection, ensure we have an array
            currentValue = Array.isArray(field.value) ? field.value : [];
          } else {
            // For single selection, handle different value formats
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
                <HierarchicalAutocomplete
                  options={options}
                  value={currentValue}
                  onChange={(value: any) => {
                    field.onChange(value);
                  }}
                  placeholder={placeholder}
                  emptyMessage={emptyMessage}
                  disabled={disabled}
                  multiple={multiple}
                  expandable={expandable}
                  selectChildrenWithParent={selectChildrenWithParent}
                  showIndentation={showIndentation}
                  defaultExpanded={defaultExpanded}
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

FormHierarchicalAutocomplete.displayName = "FormHierarchicalAutocomplete";

export { FormHierarchicalAutocomplete };
