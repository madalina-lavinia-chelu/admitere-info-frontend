"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface AutocompleteOption {
  id: string | number;
  name: string;
}

type SingleValue = string | number | null;
type MultipleValue = Array<string | number>;

interface BaseAutocompleteProps {
  options: AutocompleteOption[];
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

interface SingleAutocompleteProps extends BaseAutocompleteProps {
  multiple?: false;
  value?: SingleValue;
  onChange?: (value: SingleValue) => void;
}

interface MultipleAutocompleteProps extends BaseAutocompleteProps {
  multiple: true;
  value?: MultipleValue;
  onChange?: (value: MultipleValue) => void;
}

export type AutocompleteProps =
  | SingleAutocompleteProps
  | MultipleAutocompleteProps;

export function Autocomplete(props: AutocompleteProps) {
  const {
    options,
    placeholder = "Select item...",
    emptyMessage = "No matching items found",
    disabled = false,
    className,
  } = props;

  const multiple = props.multiple ?? false;
  const value = props.value;
  const onChange = props.onChange;

  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Convert single value to array for consistent internal handling
  const selectedValues = React.useMemo(() => {
    if (multiple) {
      // For multiple selection, ensure we have an array
      return Array.isArray(value) ? value : [];
    } else {
      // For single selection, convert to array for internal consistency
      return value !== null && value !== undefined ? [value] : [];
    }
  }, [value, multiple]);

  // Find the selected options for display
  const selectedOptions = React.useMemo(() => {
    return options.filter((option) => selectedValues.includes(option.id));
  }, [selectedValues, options]);

  const handleSelect = (optionId: string | number) => {
    if (multiple) {
      // Multiple selection mode
      const typedOnChange = onChange as
        | ((value: MultipleValue) => void)
        | undefined;
      if (selectedValues.includes(optionId)) {
        // Remove if already selected
        const newValues = selectedValues.filter((id) => id !== optionId);
        typedOnChange?.(newValues as any);
      } else {
        // Add to selection
        const newValues = [...selectedValues, optionId];
        typedOnChange?.(newValues as any);
      }
      // Don't close popover in multiple mode
    } else {
      // Single selection mode
      const typedOnChange = onChange as
        | ((value: SingleValue) => void)
        | undefined;
      typedOnChange?.(optionId);
      setSearchQuery("");
      setOpen(false);
    }
  };

  const handleRemove = (optionId: string | number) => {
    if (multiple) {
      // Multiple selection mode
      const typedOnChange = onChange as
        | ((value: MultipleValue) => void)
        | undefined;
      const newValues = selectedValues.filter((id) => id !== optionId);
      typedOnChange?.(newValues as any);
    } else {
      // Single selection mode
      const typedOnChange = onChange as
        | ((value: SingleValue) => void)
        | undefined;
      typedOnChange?.(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      multiple &&
      e.key === "Backspace" &&
      !searchQuery &&
      selectedValues.length > 0
    ) {
      // Remove the last item when pressing backspace with an empty search
      const typedOnChange = onChange as
        | ((value: MultipleValue) => void)
        | undefined;
      const newValues = [...selectedValues];
      newValues.pop();
      typedOnChange?.(newValues as any);
    }
  };

  // Display content for the button
  const buttonContent = () => {
    if (!selectedValues.length) {
      return placeholder;
    }

    if (!multiple) {
      // Single selection
      return selectedOptions[0]?.name || placeholder;
    }

    // Multiple selection - show badges
    return (
      <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
        {selectedOptions.map((option) => (
          <Badge
            key={option.id}
            variant="secondary"
            className="flex items-center gap-1 max-w-[150px] truncate">
            <span className="truncate">{option.name}</span>
            <button
              className="text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(option.id);
              }}
              type="button"
              aria-label={`Remove ${option.name}`}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          type="button"
          className={cn(
            "w-full justify-between min-h-10",
            multiple && selectedValues.length > 0 ? "h-auto" : "",
            className
          )}>
          <span className="flex-1 font-medium text-left flex items-center gap-1 flex-wrap">
            {buttonContent()}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Caută valori...`}
            value={searchQuery}
            onValueChange={setSearchQuery}
            onKeyDown={handleKeyDown}
          />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {options
              .filter((option) =>
                option.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.id.toString()}
                  onSelect={() => handleSelect(option.id)}
                  className="cursor-pointer">
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
