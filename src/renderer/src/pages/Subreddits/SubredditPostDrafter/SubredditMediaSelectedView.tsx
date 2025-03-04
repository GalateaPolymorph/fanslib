import { ChannelBadge } from "@renderer/components/ChannelBadge";
import { MediaTile } from "@renderer/components/MediaTile";
import { PostponeRedgifsButton } from "@renderer/components/PostponeRedgifsButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@renderer/components/ui/accordion";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { MediaSelectionProvider } from "@renderer/contexts/MediaSelectionContext";
import { useRedditPost } from "@renderer/contexts/RedditPostContext";
import { CheckCircle2, Copy, Edit2, ExternalLink, Send } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CHANNEL_TYPES } from "../../../../../features/channels/channelTypes";
import { SubredditPostDraft } from "../type";

type SubredditMediaSelectedViewProps = {
  draft: SubredditPostDraft;
};

export const SubredditMediaSelectedView = ({ draft }: SubredditMediaSelectedViewProps) => {
  const { updateDraftMedia, updateDraftUrl, updateDraftCaption, postDraft } = useRedditPost();
  const media = draft.media;
  const redgifsPost = media?.postMedia.find(
    (pm) => pm.post.channel.typeId === CHANNEL_TYPES.redgifs.id
  );

  useEffect(() => {
    if (!redgifsPost) return;
    updateDraftUrl(draft.subreddit.id, redgifsPost.post.url);
  }, [redgifsPost, updateDraftUrl, draft.subreddit.id]);

  if (!media) return null;

  const existingCaptions = media?.postMedia.filter((pm) => pm.post.caption);

  const readyToPost =
    (media.type === "video" && draft.url && draft.caption) ||
    (media.type === "image" && draft.caption);
  const redditCreatePostUrl = `https://www.reddit.com/r/${draft.subreddit.name}/submit?url=${draft.url}&title=${draft.caption}&type=${media.type === "video" ? "link" : "image"}`;

  return (
    <MediaSelectionProvider media={[media]}>
      <div className="grid grid-cols-4 gap-4 relative">
        {draft.postId && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
            <div className="bg-white/80 w-full h-full" />
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-4 text-2xl">
                <CheckCircle2 className="size-10" style={{ color: "#ff4500" }} />
                Posted
              </div>
              <Link
                to={`/posts/${draft.postId}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                View post <ExternalLink className="size-4" />
              </Link>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <span className="font-bold flex items-center gap-2">
            Media {draft.media ? <CheckCircle2 className="size-4" /> : null}
          </span>
          <div className="flex min-h-32 shrink-0">
            <div className="flex-1 min-h-32 flex flex-col gap-2">
              <MediaTile
                media={media}
                allMedias={[draft.media]}
                index={0}
                withPreview
                withNavigation
              />
              <Button
                variant="ghost"
                className="group text-left"
                onClick={() => {
                  navigator.clipboard.writeText(media.name);
                }}
              >
                <span className="text-sm text-muted-foreground">{media.name}</span>
                <Copy className="size-4 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                updateDraftMedia(draft.subreddit.id, null);
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <span className="font-bold flex items-center gap-2">
              Content{" "}
              {draft.url || media.type === "image" ? <CheckCircle2 className="size-4" /> : null}
            </span>
            {media.type === "video" && (
              <Input
                value={draft.url}
                onChange={(e) => updateDraftUrl(draft.subreddit.id, e.target.value)}
                placeholder="Enter URL"
                className="w-full"
              />
            )}
            {media.type === "video" && !redgifsPost && (
              <PostponeRedgifsButton
                media={media}
                onPostCreatedOrFound={(post) => {
                  updateDraftUrl(draft.subreddit.id, post.url);
                }}
              />
            )}

            {media.type === "image" && (
              <Button
                variant="outline"
                onClick={async () => {
                  await window.api["os:revealInFinder"](media.path);
                }}
              >
                Reveal image in Finder
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <span className="font-bold flex items-center gap-2">
              Caption {draft.caption ? <CheckCircle2 className="size-4" /> : null}
            </span>
            <Input
              value={draft.caption || ""}
              onChange={(e) => updateDraftCaption(draft.subreddit.id, e.target.value)}
              placeholder="Enter caption"
              className="w-full"
            />
            {existingCaptions?.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="captions">
                  <AccordionTrigger className="text-sm font-normal text-muted-foreground hover:no-underline cursor-pointer py-1 hover:bg-muted rounded px-2">
                    Captions from other channels
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-3 pt-2">
                      {existingCaptions.map((pm) => (
                        <div key={pm.post.id} className="flex flex-col items-start gap-1">
                          <ChannelBadge
                            name={pm.post.channel.name}
                            typeId={pm.post.channel.typeId}
                          />
                          <p className="text-sm text-muted-foreground">{pm.post.caption}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </div>

        {readyToPost && (
          <div className="flex flex-col gap-2">
            <span className="font-bold flex items-center gap-2">
              Ready to post! <CheckCircle2 className="size-4" />
            </span>
            <Button
              variant="default"
              style={{ backgroundColor: "#ff4500" }}
              onClick={async () => {
                window.open(redditCreatePostUrl, "_blank");
                setTimeout(async () => {
                  await window.api["os:revealInFinder"](media.path);
                }, 1000);
              }}
            >
              <Send className="size-4 mr-2" />
              Create post on Reddit
            </Button>
            <Button variant="outline" onClick={() => postDraft(draft.subreddit.id)}>
              <CheckCircle2 className="size-4 mr-2" />
              Mark as posted
            </Button>
          </div>
        )}
      </div>
    </MediaSelectionProvider>
  );
};
