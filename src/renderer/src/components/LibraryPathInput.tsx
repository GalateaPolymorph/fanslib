import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { FileInput } from "./ui/file-input";
import { useToast } from "./ui/use-toast";

export const LibraryPathInput = () => {
  const [path, setPath] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    window.api.settingsLoad().then((settings) => {
      setPath(settings.libraryPath || "");
    });
  }, []);

  const handlePathChange = async (newPath: string) => {
    setPath(newPath);
    await window.api.settingsSave({ libraryPath: newPath });
    
    toast({
      headline: (<>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          Library Path Updated
        </div>
        </>
      ),
      description: "Your library path has been successfully updated.",
      variant: "success",
    });
  };

  return (
    <FileInput
      value={path}
      onChange={handlePathChange}
      placeholder="Select library folder"
      directory
    />
  );
};
