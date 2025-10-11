import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { FileInput } from "../../components/ui/FileInput";
import { useToast } from "../../components/ui/Toast/use-toast";

export const LibraryPathInput = () => {
  const [path, setPath] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    window.api["settings:load"]().then((settings) => {
      setPath(settings.libraryPath || "");
    });
  }, []);

  const handlePathChange = async (newPath: string) => {
    setPath(newPath);
    await window.api["settings:save"]({ libraryPath: newPath });

    toast({
      headline: (
        <>
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
      className="w-full"
    />
  );
};
