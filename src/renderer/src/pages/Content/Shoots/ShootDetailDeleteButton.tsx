import { Trash2 } from "lucide-react";
import { type FC } from "react";
import { ShootWithMedia } from "../../../../../features/shoots/api-type";
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
import { useLibraryPreferences } from "../../../contexts/LibraryPreferencesContext";

type ShootDetailDeleteButtonProps = {
  shoot: ShootWithMedia;
  onUpdate: () => void;
};

export const ShootDetailDeleteButton: FC<ShootDetailDeleteButtonProps> = ({ shoot, onUpdate }) => {
  const { preferences, updateFilterPreferences } = useLibraryPreferences();

  const handleDelete = async () => {
    await window.api["shoot:delete"](shoot.id);

    // Remove the shoot from excludeShoots if it's there
    if (preferences.filter.excludeShoots?.includes(shoot.id)) {
      updateFilterPreferences({
        ...preferences.filter,
        excludeShoots: preferences.filter.excludeShoots.filter((id) => id !== shoot.id),
      });
    }

    onUpdate?.();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
        >
          <Trash2 className="h-4 w-4" />
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
