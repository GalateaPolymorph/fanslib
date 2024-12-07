import { Loader2, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Media } from "../../../features/library/entity";
import { formatFileSize } from "../lib/utils";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export function WelcomeScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get library path from settings
        const settings = await window.api["settings:load"]();
        if (!settings.libraryPath) {
          setError("Library path not set. Please configure it in settings.");
          return;
        }

        // Scan for media files
        const files = await window.api["library:getAll"]();
        setMediaItems(files);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to scan library");
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <Settings className="w-12 h-12 mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-semibold mb-2">Welcome to FansLib</h1>
        <p className="text-muted-foreground mb-6">
          {!error ? "Here are the media files in your library:" : error}
        </p>
        {error && (
          <Button onClick={() => navigate("/settings")} className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Go to Settings
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        !error && (
          <ScrollArea className="flex-1 rounded-md border">
            <div className="p-4">
              <div className="grid grid-cols-[1fr_100px_150px_150px] gap-4 font-medium p-2">
                <div>Name</div>
                <div>Size</div>
                <div>Type</div>
                <div>Modified</div>
              </div>
              {mediaItems.map((file) => (
                <div
                  key={file.path}
                  className="grid grid-cols-[1fr_100px_150px_150px] gap-4 p-2 hover:bg-muted/50 rounded-sm"
                >
                  <div className="truncate" title={file.name}>
                    {file.name}
                  </div>
                  <div>{formatFileSize(file.size)}</div>
                  <div className="capitalize">{file.type}</div>
                  <div>{new Date(file.modified).toLocaleDateString()}</div>
                </div>
              ))}
              {mediaItems.length === 0 && !loading && (
                <div className="text-center text-muted-foreground p-4">
                  No media files found in the library
                </div>
              )}
            </div>
          </ScrollArea>
        )
      )}
    </div>
  );
}
