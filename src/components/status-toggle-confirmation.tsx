"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Power } from "lucide-react";

interface StatusToggleConfirmationProps {
  itemId: number;
  itemName?: string;
  itemType: string;
  isActive?: boolean;
  toggleFunction: (id: number) => Promise<any>;
  onToggleSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

export function StatusToggleConfirmation({
  itemId,
  itemName,
  itemType,
  isActive = true,
  toggleFunction,
  onToggleSuccess,
  triggerButton,
}: StatusToggleConfirmationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const actionText = isActive ? "dezactivați" : "activați";
  const actionTextPast = isActive ? "dezactivat" : "activat";
  const colorClass = isActive
    ? "text-amber-600 hover:bg-amber-600/10"
    : "text-emerald-600 hover:bg-emerald-600/10";

  const handleToggle = async () => {
    setIsProcessing(true);
    try {
      const response = await toggleFunction(itemId);

      if (response.error) {
        toast.error(`Eroare la schimbarea statului`, {
          description:
            response.message || `Nu s-a putut ${actionText} ${itemType}.`,
        });
      } else {
        toast.success(`Succes`, {
          description: `${itemType} a fost ${actionTextPast} cu succes.`,
        });

        if (onToggleSuccess) {
          onToggleSuccess();
        }
      }
    } catch (error: any) {
      toast.error(`Eroare la schimbarea statului`, {
        description: error.message || `Nu s-a putut ${actionText} ${itemType}.`,
      });
    } finally {
      setIsProcessing(false);
      setIsOpen(false);
    }
  };

  const defaultTrigger = (
    <Button variant="ghost" size="icon" className={colorClass}>
      <Power className="h-4 w-4" />
    </Button>
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {triggerButton || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Sunteți sigur că doriți să {actionText} acest{" "}
            {itemType.toLowerCase()}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {itemName ? (
              <>
                Sunteți pe cale să {actionText} utilizatorul{" "}
                <span className="font-medium">{itemName}</span>.
              </>
            ) : (
              <>Sunteți pe cale să {actionText} utilizatorul.</>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>
            Anulează
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={isActive ? "destructive" : "success"}
              onClick={handleToggle}
              disabled={isProcessing}>
              {isProcessing
                ? "Se procesează..."
                : isActive
                ? "Dezactivează"
                : "Activează"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
