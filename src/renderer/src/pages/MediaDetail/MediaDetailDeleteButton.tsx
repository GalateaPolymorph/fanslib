import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MediaType } from "../../../../features/library/entity";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { DeleteConfirmDialog } from "../../components/ui/DeleteConfirmDialog/DeleteConfirmDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/Tooltip";

type Props = {
  id: string;
  mediaType: MediaType;
};

export const MediaDetailDeleteButton = ({ id, mediaType }: Props) => {
  const navigate = useNavigate();
  const [deleteFile, setDeleteFile] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await window.api["library:delete"](id, deleteFile);
      navigate("/");
    } catch (error) {
      console.error("Failed to delete media:", error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete media</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Media"
        description={`This will permanently delete this ${mediaType}. This action cannot be undone.`}
        itemName={`${mediaType}`}
        onConfirm={handleDelete}
      >
        <div className="flex items-center space-x-2">
          <Checkbox
            id="delete-file"
            checked={deleteFile}
            onCheckedChange={(checked) => setDeleteFile(checked as boolean)}
          />
          <label
            htmlFor="delete-file"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Also delete file from disk
          </label>
        </div>
      </DeleteConfirmDialog>
    </>
  );
};
