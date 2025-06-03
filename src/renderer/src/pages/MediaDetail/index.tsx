import { MediaTagEditor } from "@renderer/components/MediaTagEditor";
import { Button } from "@renderer/components/ui/button";
import { MediaSelectionProvider } from "@renderer/contexts/MediaSelectionContext";
import { useMedia } from "@renderer/hooks";
import { MediaDetailDeleteButton } from "@renderer/pages/MediaDetail/MediaDetailDeleteButton";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MediaView } from "../../components/MediaView";
import { PostponeRedgifsButton } from "../../components/PostponeRedgifsButton";
import { CreatePostDialog } from "./CreatePostDialog";
import { MediaDetailMetadata } from "./MediaDetailMetadata";
import { MediaDetailNavigation } from "./MediaDetailNavigation";
import { MediaDetailRevealInFinderButton } from "./MediaDetailRevealInFinderButton";
import { MediaPosts } from "./MediaPosts";

export const MediaDetail = () => {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const { data: media, isLoading, error } = useMedia(mediaId);
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
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
    );
  }
  console.log(media);

  return (
    <MediaSelectionProvider media={[media]}>
      <CreatePostDialog
        open={createPostDialogOpen}
        onOpenChange={setCreatePostDialogOpen}
        media={[media]}
      />
      <div className="overflow-y-auto">
        <div className="max-w-[1280px] px-8 mx-auto pt-8 pb-12">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex-1" />
            <MediaDetailNavigation />
          </div>
          <div className="flex justify-between">
            <h1 className="text-3xl font-semibold tracking-tight">{media.name}</h1>
            <div className="flex gap-2">
              <MediaDetailRevealInFinderButton path={media.path} />
              <MediaDetailDeleteButton id={media.id} mediaType={media.type} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-6">
            <div className="rounded-md bg-muted aspect-square overflow-hidden">
              <MediaView media={media} controls />
            </div>
            <div className="flex flex-col gap-6">
              <MediaDetailMetadata media={media} />
              <MediaTagEditor media={[media]} />
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
            <PostponeRedgifsButton
              media={media}
              className="self-center"
              onPostCreatedOrFound={(post) => {
                navigate(`/posts/${post.id}`);
              }}
            />
          </div>
        </div>
      </div>
    </MediaSelectionProvider>
  );
};
