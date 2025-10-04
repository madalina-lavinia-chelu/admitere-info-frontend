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
import { Trash2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
  itemId: number;
  itemName?: string;
  itemType: string;
  deleteFunction: (id: number) => Promise<any>;
  onDeleteSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

export function DeleteConfirmationDialog({
  itemId,
  itemName,
  itemType,
  deleteFunction,
  onDeleteSuccess,
  triggerButton,
}: DeleteConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteFunction(itemId);

      if (response.error) {
        toast.error(`Eroare la ștergere`, {
          description: response.message || `Nu s-a putut șterge ${itemType}.`,
        });
      } else {
        toast.success(`Succes`, {
          description: `${itemType} a fost șters cu succes.`,
        });

        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      }
    } catch (error: any) {
      toast.error(`Eroare la ștergere`, {
        description: error.message || `Nu s-a putut șterge ${itemType}.`,
      });
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="text-destructive hover:bg-destructive/10">
      <Trash2 className="h-4 w-4" />
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
            Sunteți sigur că doriți să ștergeți acest {itemType.toLowerCase()}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {itemName ? (
              <>
                Sunteți pe cale să ștergeți{" "}
                <span className="font-medium">{itemName}</span>. Această acțiune
                nu poate fi anulată.
              </>
            ) : (
              <>Această acțiune nu poate fi anulată.</>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Anulează</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}>
              {isDeleting ? "Se șterge..." : "Șterge"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
