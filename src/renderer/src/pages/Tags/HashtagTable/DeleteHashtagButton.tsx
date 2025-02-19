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

type DeleteHashtagButtonProps = {
  hashtagId: number;
  hashtagName: string;
  onHashtagDeleted: () => void;
};

export const DeleteHashtagButton = ({
  hashtagId,
  hashtagName,
  onHashtagDeleted,
}: DeleteHashtagButtonProps) => {
  const deleteHashtag = async () => {
    try {
      await window.api["hashtag:delete"](hashtagId);
      onHashtagDeleted();
    } catch (error) {
      console.error("Failed to delete hashtag", error);
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
          <AlertDialogTitle>Delete Hashtag</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {hashtagName}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={deleteHashtag}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
