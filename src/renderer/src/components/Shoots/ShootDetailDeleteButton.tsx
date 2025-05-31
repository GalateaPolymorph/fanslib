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

    // Remove any filter groups that include this shoot
    const updatedFilters = preferences.filter
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => !(item.type === "shoot" && item.id === shoot.id)),
      }))
      .filter((group) => group.items.length > 0);

    if (
      updatedFilters.length !== preferences.filter.length ||
      preferences.filter.some((group) =>
        group.items.some((item) => item.type === "shoot" && item.id === shoot.id)
      )
    ) {
      updatePreferences({
        filter: updatedFilters,
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
            This will permanently delete the shoot &quot;{shoot.name}&quot;. This action cannot be
            undone.
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
