"use client";

import { Button } from "@/components/ui/button";
import { ModeType } from "@/types/types";

interface SubmitButtonProps {
  isSubmitting: boolean;
  mode?: ModeType;
  className?: string;
  loadingText?: string;
  createText?: string;
  editText?: string;
}

export function SubmitButton({
  isSubmitting,
  mode = "create",
  className = "",
  loadingText = "Se procesează...",
  createText = "Creează",
  editText = "Salvează",
}: SubmitButtonProps) {
  return (
    <div className={`flex items-center justify-end ${className}`}>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? loadingText : mode === "create" ? createText : editText}
      </Button>
    </div>
  );
}
