import { Trash2 } from "lucide-react";
import { type FC } from "react";
import { ShootWithMedia } from "../../../../features/shoots/api-type";
import { useLibraryPreferences } from "../../contexts/LibraryPreferencesContext";
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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

type ShootDetailDeleteButtonProps = {
  shoot: ShootWithMedia;
  onUpdate: () => void;
};

export const ShootDetailDeleteButton: FC<ShootDetailDeleteButtonProps> = ({ shoot, onUpdate }) => {
  const { preferences, updatePreferences } = useLibraryPreferences();

  const handleDelete = async () => {
    await window.api["shoot:delete"](shoot.id);

    // Remove the shoot from excludeShoots if it's there
    if (preferences.filter.excludeShoots?.includes(shoot.id)) {
      updatePreferences({
        filter: {
          ...preferences.filter,
          excludeShoots: preferences.filter.excludeShoots.filter((id) => id !== shoot.id),
        },
      });
    }

    onUpdate?.();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-destructive">
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete shoot?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the shoot "{shoot.name}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
