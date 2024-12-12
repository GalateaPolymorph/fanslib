import { ChannelTypeIcon } from "@renderer/components/ChannelTypeIcon";
import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Textarea } from "@renderer/components/ui/textarea";
import { useToast } from "@renderer/components/ui/use-toast";
import { MediaSelectDialog } from "@renderer/pages/PostDetail/MediaSelectDialog";
import { format } from "date-fns";
import { ChevronLeft, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CHANNEL_TYPES } from "../../../../features/channels/channelTypes";
import { Media } from "../../../../features/library/entity";
import { Post } from "../../../../features/posts/entity";
import { MediaTile } from "../../components/MediaTile";

export const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);

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
        setCaption(post.caption);
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
      <div className="flex items-center gap-2 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Post Details</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="grid grid-cols-[2fr_3fr] gap-8">
            {/* Media Section */}
            <div className="space-y-4">
              {post.postMedia && post.postMedia.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {post.postMedia.map((media) => (
                      <MediaTile
                        key={media.media.path}
                        media={media.media}
                        className="aspect-square"
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
              {/* Channel and Category */}
              <div className="flex items-center gap-4">
                {post.channel && (
                  <div
                    className="flex items-center gap-2 px-2 py-1 rounded-md"
                    style={{
                      backgroundColor:
                        CHANNEL_TYPES[post.channel.type.id as keyof typeof CHANNEL_TYPES]?.color +
                        "20",
                    }}
                  >
                    <ChannelTypeIcon
                      typeId={post.channel.type.id as keyof typeof CHANNEL_TYPES}
                      className="w-4 h-4"
                      color={
                        CHANNEL_TYPES[post.channel.type.id as keyof typeof CHANNEL_TYPES]?.color
                      }
                    />
                    <span className="font-medium">{post.channel.name}</span>
                  </div>
                )}
                {post.category && (
                  <div
                    className="px-2 py-1 rounded-md font-medium"
                    style={{
                      backgroundColor: post.category.color + "20",
                      color: post.category.color,
                    }}
                  >
                    {post.category.name}
                  </div>
                )}
              </div>

              {/* Status and Schedule */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="capitalize font-medium">{post.status}</p>
                    <p className="text-lg">{format(new Date(post.date), "PPP 'at' p")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.status === "planned" && (
                      <Button
                        onClick={async () => {
                          try {
                            setSaving(true);
                            const updatedPost = await window.api["post:markAsScheduled"](post.id);
                            setPost(updatedPost);
                            toast({
                              title: "Post scheduled",
                              description: "The post has been marked as scheduled.",
                            });
                          } catch (err) {
                            toast({
                              title: "Failed to schedule post",
                              description: err instanceof Error ? err.message : "An error occurred",
                              variant: "destructive",
                            });
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={!post.postMedia || post.postMedia.length === 0 || saving}
                      >
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Schedule
                      </Button>
                    )}
                    {post.status === "scheduled" && (
                      <>
                        <Button
                          onClick={async () => {
                            try {
                              setSaving(true);
                              const updatedPost = await window.api["post:markAsPosted"](post.id);
                              setPost(updatedPost);
                              toast({
                                title: "Post marked as posted",
                                description: "The post has been marked as posted.",
                              });
                            } catch (err) {
                              toast({
                                title: "Failed to mark post as posted",
                                description:
                                  err instanceof Error ? err.message : "An error occurred",
                                variant: "destructive",
                              });
                            } finally {
                              setSaving(false);
                            }
                          }}
                          disabled={saving}
                        >
                          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                          Mark as Posted
                        </Button>
                        <Button
                          variant="outline"
                          onClick={async () => {
                            try {
                              setSaving(true);
                              const updatedPost = await window.api["post:markAsPlanned"](post.id);
                              setPost(updatedPost);
                              toast({
                                title: "Post unscheduled",
                                description: "The post has been marked as planned.",
                              });
                            } catch (err) {
                              toast({
                                title: "Failed to unschedule post",
                                description:
                                  err instanceof Error ? err.message : "An error occurred",
                                variant: "destructive",
                              });
                            } finally {
                              setSaving(false);
                            }
                          }}
                          disabled={saving}
                        >
                          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                          Unschedule
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="min-h-[200px] resize-none"
                  placeholder="Write a caption..."
                />
                <div className="flex justify-end">
                  <Button onClick={handleSaveCaption} disabled={caption === post.caption || saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
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
      </ScrollArea>

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
