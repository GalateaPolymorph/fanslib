import { Trash2 } from "lucide-react";
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
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";

type DeleteNicheButtonProps = {
  nicheId: number;
  nicheName: string;
  onNicheDeleted: () => void;
};

export const DeleteNicheButton = ({
  nicheId,
  nicheName,
  onNicheDeleted,
}: DeleteNicheButtonProps) => {
  const deleteNiche = async () => {
    try {
      await window.api["niche:delete"](nicheId);
      onNicheDeleted();
    } catch (error) {
      console.error("Failed to delete niche", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Niche</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {nicheName}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={deleteNiche}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
