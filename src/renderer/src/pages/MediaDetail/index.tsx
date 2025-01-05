import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MediaView } from "../../components/MediaView";
import { Button } from "../../components/ui/button";
import { useMedia } from "../../hooks/useMedia";
import { CreatePostDialog } from "./CreatePostDialog";
import { MediaDetailCategorySelect } from "./MediaDetailCategorySelect";
import { MediaDetailDeleteButton } from "./MediaDetailDeleteButton";
import { MediaDetailMetadata } from "./MediaDetailMetadata";
import { MediaDetailRevealInFinderButton } from "./MediaDetailRevealInFinderButton";
import { MediaPosts } from "./MediaPosts";

export const MediaDetail = () => {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const { media, isLoading, error } = useMedia(mediaId);
  const [createPostDialogOpen, setCreatePostDialogOpen] = useState(false);

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
        <h1 className="text-2xl font-semibold mb-4">Media not found</h1>
        <Button onClick={() => navigate("/")}>Back to gallery</Button>
      </div>
    );
  }

  return (
    <>
      <CreatePostDialog
        open={createPostDialogOpen}
        onOpenChange={setCreatePostDialogOpen}
        media={media}
      />
      <div className="overflow-y-auto">
        <div className="max-w-[1280px] px-8 mx-auto pt-8 pb-12">
          <Button className="mb-2" variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to gallery
          </Button>
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">{media.name}</h1>
              <MediaDetailCategorySelect media={media} />
            </div>
            <div className="flex gap-2">
              <MediaDetailRevealInFinderButton path={media.path} />
              <MediaDetailDeleteButton id={media.id} mediaType={media.type} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-6">
            <div className="rounded-md bg-muted aspect-square overflow-hidden">
              <MediaView media={media} controls />
            </div>
            <div className="grid grid-cols-[3fr_1fr] items-start gap-4">
              <MediaDetailMetadata media={media} />
            </div>
          </div>

          <h3 className="text-lg font-medium mb-4">Posts</h3>
          <div className="flex flex-col gap-4">
            <MediaPosts mediaId={media.id} />
            <Button
              variant="outline"
              className="self-center"
              onClick={() => setCreatePostDialogOpen(true)}
            >
              Create new post with this media
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
