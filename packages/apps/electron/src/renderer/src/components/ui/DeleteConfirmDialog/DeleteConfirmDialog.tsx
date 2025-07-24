import * as React from "react";

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
} from "@renderer/components/ui/AlertDialog";

export type DeleteConfirmDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  itemName?: string;
  itemType?: string;
  onConfirm: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
};

const DeleteConfirmDialog = React.forwardRef<HTMLDivElement, DeleteConfirmDialogProps>(
  (
    {
      open,
      onOpenChange,
      trigger,
      title,
      description,
      itemName,
      itemType = "item",
      onConfirm,
      confirmText = "Delete",
      cancelText = "Cancel",
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    const defaultTitle = title || `Delete ${itemType}`;
    const defaultDescription =
      description ||
      `Are you sure you want to delete ${itemName ? `"${itemName}"` : `this ${itemType}`}? This action cannot be undone.`;

    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
        <AlertDialogContent ref={ref} {...props}>
          <AlertDialogHeader>
            <AlertDialogTitle>{defaultTitle}</AlertDialogTitle>
            <AlertDialogDescription>{defaultDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          {children}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);
DeleteConfirmDialog.displayName = "DeleteConfirmDialog";

export { DeleteConfirmDialog };
