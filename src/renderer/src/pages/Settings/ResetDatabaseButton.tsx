import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog";
import { useState } from "react";

export const ResetDatabaseButton = () => {
  const [open, setOpen] = useState(false);

  const handleReset = async () => {
    try {
      await window.api.library.resetDatabase();
      setOpen(false);
    } catch (error) {
      console.error("Failed to reset database:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Reset Database</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Database</DialogTitle>
          <DialogDescription>
            Are you sure you want to reset the database? This action cannot be undone and will
            remove all media entries from your library.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReset}>
            Reset Database
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
