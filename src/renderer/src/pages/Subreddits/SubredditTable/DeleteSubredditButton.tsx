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
import { Button } from "@renderer/components/ui/Button";
import { useDeleteSubreddit } from "@renderer/hooks/api/useChannels";
import { Trash2 } from "lucide-react";

type DeleteSubredditButtonProps = {
  subredditId: string;
  subredditName: string;
  onSubredditDeleted: () => void;
};

export const DeleteSubredditButton = ({
  subredditId,
  subredditName,
  onSubredditDeleted,
}: DeleteSubredditButtonProps) => {
  const deleteSubredditMutation = useDeleteSubreddit();

  const deleteSubreddit = async () => {
    try {
      await deleteSubredditMutation.mutateAsync(subredditId);
      onSubredditDeleted();
    } catch (error) {
      console.error("Failed to delete subreddit", error);
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
          <AlertDialogTitle>Delete Subreddit</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete r/{subredditName}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={deleteSubreddit}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
