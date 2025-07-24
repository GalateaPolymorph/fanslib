import { DatabaseImportWizard } from "@renderer/components/DatabaseImportWizard";
import { Database, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";

export const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [showImportWizard, setShowImportWizard] = useState(false);

  return (
    <>
      <DatabaseImportWizard
        open={showImportWizard}
        onOpenChange={setShowImportWizard}
        onSuccess={() => {
          // Refresh the page or navigate to main view
          window.location.reload();
        }}
      />
      <div className="flex w-full h-full flex-col p-8 justify-center">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Settings className="w-12 h-12 text-muted-foreground" />
            <h1 className="text-2xl font-semibold">Welcome to FansLib</h1>
            <p className="text-muted-foreground">
              Get started by setting up your library or importing an existing database.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <Button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2"
              size="lg"
            >
              <Settings className="w-4 h-4" />
              Set up new library
            </Button>

            <Button
              onClick={() => setShowImportWizard(true)}
              variant="outline"
              className="flex items-center gap-2"
              size="lg"
            >
              <Database className="w-4 h-4" />
              Import existing database
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
