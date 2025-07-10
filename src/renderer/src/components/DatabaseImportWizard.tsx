import { Button } from "@renderer/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@renderer/components/ui/dialog";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Progress } from "@renderer/components/ui/progress";
import { useToast } from "@renderer/components/ui/use-toast";
import { useImportDatabase, useValidateImportedDatabase } from "@renderer/hooks/api/useImportDatabase";
import { useUpdateSettings } from "@renderer/hooks/api/useSettings";
import { AlertCircle, CheckCircle, Database, FolderOpen, Loader2 } from "lucide-react";
import { useState } from "react";
import { ValidationResult } from "../../../features/settings/api-type";

type ImportStep = "file-selection" | "library-path" | "validation" | "success";

type DatabaseImportWizardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export const DatabaseImportWizard = ({ open, onOpenChange, onSuccess }: DatabaseImportWizardProps) => {
  const [currentStep, setCurrentStep] = useState<ImportStep>("file-selection");
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [libraryPath, setLibraryPath] = useState<string>("");
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const { toast } = useToast();
  const updateSettings = useUpdateSettings();
  const importDatabase = useImportDatabase();
  const validateDatabase = useValidateImportedDatabase();

  const selectDatabaseFile = async () => {
    try {
      const result = await window.api["os:showOpenDialog"]({
        title: "Select Database File",
        filters: [
          { name: "SQLite Database", extensions: ["sqlite", "sqlite3", "db"] },
          { name: "All Files", extensions: ["*"] }
        ],
        properties: ["openFile"]
      });

      if (!result.canceled && result.filePaths.length > 0) {
        setSelectedFile(result.filePaths[0]);
      }
    } catch (_error) {
      console.error("Error selecting file:", _error);
      toast({
        title: "Error",
        description: "Failed to select database file",
        variant: "destructive"
      });
    }
  };

  const selectLibraryPath = async () => {
    try {
      const result = await window.api["os:showOpenDialog"]({
        title: "Select Library Folder",
        properties: ["openDirectory"]
      });

      if (!result.canceled && result.filePaths.length > 0) {
        setLibraryPath(result.filePaths[0]);
      }
    } catch (_error) {
      console.error("Error selecting library path:", _error);
      toast({
        title: "Error",
        description: "Failed to select library folder",
        variant: "destructive"
      });
    }
  };

  const handleImportDatabase = async () => {
    if (!selectedFile) return;

    try {
      const result = await importDatabase.mutateAsync(selectedFile);
      
      if (!result.success) {
        toast({
          title: "Import Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
        return;
      }

      setCurrentStep("library-path");
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import database",
        variant: "destructive"
      });
    }
  };

  const handleLibraryPathSubmit = async () => {
    if (!libraryPath) return;

    try {
      // Update library path in settings
      await updateSettings.mutateAsync({ libraryPath });
      
      setCurrentStep("validation");
      
      // Validate the imported database
      const result = await validateDatabase.mutateAsync(libraryPath);
      setValidationResult(result);
      
      setCurrentStep("success");
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Failed to validate library path",
        variant: "destructive"
      });
    }
  };

  const handleFinish = () => {
    onOpenChange(false);
    onSuccess?.();
    
    // Reset wizard state
    setCurrentStep("file-selection");
    setSelectedFile("");
    setLibraryPath("");
    setValidationResult(null);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "file-selection":
        return "Select Database File";
      case "library-path":
        return "Configure Library Path";
      case "validation":
        return "Validating Import";
      case "success":
        return "Import Complete";
    }
  };

  const getProgressValue = () => {
    switch (currentStep) {
      case "file-selection":
        return 25;
      case "library-path":
        return 50;
      case "validation":
        return 75;
      case "success":
        return 100;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {getStepTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Progress value={getProgressValue()} className="w-full" />

          {currentStep === "file-selection" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select the fanslib.sqlite database file from your other machine.
              </p>
              
              <div className="space-y-2">
                <Label>Database File</Label>
                <div className="flex gap-2">
                  <Input
                    value={selectedFile}
                    placeholder="No file selected"
                    readOnly
                    className="flex-1"
                  />
                  <Button onClick={selectDatabaseFile} variant="outline">
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleImportDatabase}
                  disabled={!selectedFile || importDatabase.isPending}
                >
                  {importDatabase.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Import Database
                </Button>
              </div>
            </div>
          )}

          {currentStep === "library-path" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select the folder where your media files are located.
              </p>
              
              <div className="space-y-2">
                <Label>Library Path</Label>
                <div className="flex gap-2">
                  <Input
                    value={libraryPath}
                    placeholder="No folder selected"
                    readOnly
                    className="flex-1"
                  />
                  <Button onClick={selectLibraryPath} variant="outline">
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCurrentStep("file-selection")}>
                  Back
                </Button>
                <Button 
                  onClick={handleLibraryPathSubmit}
                  disabled={!libraryPath || updateSettings.isPending || validateDatabase.isPending}
                >
                  {(updateSettings.isPending || validateDatabase.isPending) && 
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  }
                  Validate & Complete
                </Button>
              </div>
            </div>
          )}

          {currentStep === "validation" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Validating media files...
              </p>
            </div>
          )}

          {currentStep === "success" && validationResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Database imported successfully!</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total files:</span>
                  <span>{validationResult.totalFiles}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valid files:</span>
                  <span className="text-green-600">{validationResult.validFiles}</span>
                </div>
                {validationResult.missingFiles.length > 0 && (
                  <div className="flex justify-between">
                    <span>Missing files:</span>
                    <span className="text-orange-600">{validationResult.missingFiles.length}</span>
                  </div>
                )}
              </div>

              {validationResult.missingFiles.length > 0 && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                  <div className="flex items-center gap-2 text-orange-800 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Some media files could not be found at the specified library path.</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleFinish}>
                  Finish
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};