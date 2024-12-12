import { Button } from "@renderer/components/ui/button";
import { Textarea } from "@renderer/components/ui/textarea";
import { useToast } from "@renderer/components/ui/use-toast";
import { MediaSelectDialog } from "@renderer/pages/PostDetail/MediaSelectDialog";
import { format } from "date-fns";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Media } from "../../../../features/library/entity";
import { Post } from "../../../../features/posts/entity";
import { CategoryBadge } from "../../components/CategoryBadge";
import { ChannelBadge } from "../../components/ChannelBadge";
import { MediaView } from "../../components/MediaView";
import { StatusBadge } from "../../components/StatusBadge";
import { cn } from "../../lib/utils";

export const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [originalCaption, setOriginalCaption] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);

  const hasChanges = caption !== originalCaption;

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) {
        setError("No post ID provided");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const post = await window.api["post:byId"](postId);
        if (!post) {
          setError("Post not found");
          return;
        }
        setPost(post);
        setCaption(post.caption || "");
        setOriginalCaption(post.caption || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  const handleSaveCaption = async () => {
    if (!post) return;

    try {
      setSaving(true);
      const updatedPost = await window.api["post:update"](post.id, { caption });
      setPost(updatedPost);
      setOriginalCaption(caption);
      toast({
        title: "Caption updated",
        description: "Your changes have been saved.",
      });
    } catch (err) {
      toast({
        title: "Failed to update caption",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMediaSelect = async (selectedMedia: Media[]) => {
    if (!post) return;

    try {
      setSaving(true);
      await window.api["post:update"](
        post.id,
        {},
        selectedMedia.map((media) => media.path)
      );

      // Refetch the post to get the latest enriched data
      const posts = await window.api["post:getAll"]();
      const updatedPost = posts.find((p) => p.id === post.id);
      if (!updatedPost) {
        throw new Error("Failed to refetch post");
      }

      setPost(updatedPost);
      toast({
        title: "Media updated",
        description: "Media has been assigned to the post.",
      });
    } catch (err) {
      toast({
        title: "Failed to update media",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-destructive">{error || "Post not found"}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="container mx-auto p-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => navigate("/posts")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to overview
          </Button>
        </div>

        <div className="grid grid-cols-[2fr_3fr] gap-8">
          {/* Media Section */}
          <div className="space-y-4">
            {post.postMedia && post.postMedia.length > 0 ? (
              <>
                <div
                  className={cn(
                    post.postMedia.length > 1 ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 gap-4"
                  )}
                >
                  {post.postMedia.map((media) => (
                    <MediaView
                      key={media.media.path}
                      media={media.media}
                      linkToMediaDetail
                      className="w-full"
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setMediaDialogOpen(true)}
                >
                  Change Media
                </Button>
              </>
            ) : (
              <button
                onClick={() => setMediaDialogOpen(true)}
                className="aspect-square rounded-lg bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/80 transition-colors w-full"
              >
                <Plus className="w-8 h-8" />
                <span>Assign Media</span>
              </button>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold mb-4">
              Post on {post ? format(new Date(post.date), "MMMM d, yyyy") : "..."}
            </h1>

            <div className="flex flex-col divide-y">
              <div className="flex items-center justify-between py-3">
                <div>
                  {post.channel && (
                    <ChannelBadge name={post.channel.name} typeId={post.channel.type.id} />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">Channel</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <StatusBadge status={post.status} />
                <span className="text-sm text-muted-foreground">Status</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>{post.category && <CategoryBadge category={post.category} />}</div>
                <span className="text-sm text-muted-foreground">Category</span>
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="min-h-[200px]"
              />
              <div className="flex justify-end">
                {hasChanges && (
                  <Button onClick={handleSaveCaption} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save caption"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-8 pt-4 border-t text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <p>Created {format(new Date(post.createdAt), "PPP")}</p>
            <p>Updated {format(new Date(post.updatedAt), "PPP")}</p>
          </div>
        </div>
      </div>

      <MediaSelectDialog
        open={mediaDialogOpen}
        onOpenChange={setMediaDialogOpen}
        onSelect={handleMediaSelect}
        initialSelectedMedia={post.postMedia.map((m) => m.media)}
        categoryId={post.category?.slug}
      />
    </div>
  );
};
