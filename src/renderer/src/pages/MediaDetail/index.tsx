import { format } from "date-fns";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CategorySelect } from "../../components/CategorySelect";
import { MediaDisplay } from "../../components/MediaDisplay";
import { Button } from "../../components/ui/button";
import { useMedia } from "../../hooks/useMedia";
import { CreatePostDialog } from "./CreatePostDialog";
import { MediaPosts } from "./MediaPosts";

export const MediaDetail = () => {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const { media, isLoading, error } = useMedia(mediaId);
  const [categories, setCategories] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [createPostDialogOpen, setCreatePostDialogOpen] = useState(false);

  useEffect(() => {
    setCategories((media?.categories ?? []).map((cat) => cat.id));
  }, [media]);

  const handleChangeCategory = async (newCategories: string[]) => {
    if (!media) return;
    try {
      await window.api["library:update"](media.id, { categoryIds: newCategories });
      setCategories(newCategories);
    } catch (error) {
      console.error("Failed to update media category:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-semibold mb-4">{error || "Media not found"}</h1>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </Button>
      </div>
    );
  }

  const handleRescan = async () => {
    try {
      setIsScanning(true);
      await window.api["library:scanFile"](media.path);
    } catch (error) {
      console.error("Failed to rescan file:", error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <CreatePostDialog
        open={createPostDialogOpen}
        onOpenChange={setCreatePostDialogOpen}
        mediaId={media.id}
      />
      <div className="container mx-auto p-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to gallery
          </Button>
          <Button variant="ghost" onClick={handleRescan} disabled={isScanning}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
            {isScanning ? "Scanning..." : "Rescan"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square">
            <MediaDisplay media={media} />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-2">{media.name}</h2>

            <div>
              <CategorySelect value={categories} onChange={handleChangeCategory} />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Details</h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt>Size</dt>
                <dd>{media.size}</dd>
                <dt>Created</dt>
                <dd>{format(new Date(media.fileCreationDate), "PPP")}</dd>
                <dt>Last modified</dt>
                <dd>{format(new Date(media.fileModificationDate), "PPP")}</dd>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setCreatePostDialogOpen(true)}
                >
                  Mark Posted
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Posts</h3>
              <MediaPosts mediaId={media.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
