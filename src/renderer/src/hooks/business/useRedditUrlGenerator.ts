import { useMemo } from "react";
import { Subreddit } from "../../../../features/channels/subreddit";
import { Media } from "../../../../features/library/entity";

type RedditUrlGeneratorResult = {
  generateUrl: () => string | null;
  urlType: "link" | "text" | null;
  isReady: boolean;
  guidance: string;
};

type RedditUrlGeneratorParams = {
  subreddit: Subreddit | null;
  media: Media | null;
  caption: string;
  redgifsUrl: string | null;
  isRedgifsLoading: boolean;
};

export const useRedditUrlGenerator = ({
  subreddit,
  media,
  caption,
  redgifsUrl,
  isRedgifsLoading,
}: RedditUrlGeneratorParams): RedditUrlGeneratorResult => {
  const result = useMemo(() => {
    if (!subreddit || !media) {
      return {
        generateUrl: () => null,
        urlType: null,
        isReady: false,
        guidance: "Select a subreddit and media to generate Reddit URL",
      };
    }

    if (media.type === "video" && isRedgifsLoading) {
      return {
        generateUrl: () => null,
        urlType: null,
        isReady: false,
        guidance: "Checking for RedGIFs URL...",
      };
    }

    const generateUrl = (): string | null => {
      const baseUrl = `https://www.reddit.com/r/${subreddit.name}/submit`;
      const title = caption || `${media.name}`;
      const encodedTitle = encodeURIComponent(title);

      if (media.type === "video" && redgifsUrl) {
        // Video with RedGIFs URL - create link post
        const encodedUrl = encodeURIComponent(redgifsUrl);
        return `${baseUrl}?url=${encodedUrl}&title=${encodedTitle}`;
      } else if (media.type === "video" && !redgifsUrl) {
        // Video without RedGIFs URL - create text post with upload guidance
        const uploadText = `Upload your video file manually to Reddit.\n\nVideo: ${media.name}\nDuration: ${media.duration ? Math.round(media.duration) + "s" : "Unknown"}\n\n${caption || ""}`;
        const encodedText = encodeURIComponent(uploadText);
        return `${baseUrl}?selftext=true&title=${encodedTitle}&text=${encodedText}`;
      } else if (media.type === "image") {
        // Image - create text post with upload guidance
        const uploadText = `Upload your image file manually to Reddit.\n\nImage: ${media.name}\n\n${caption || ""}`;
        const encodedText = encodeURIComponent(uploadText);
        return `${baseUrl}?selftext=true&title=${encodedTitle}&text=${encodedText}`;
      }

      return null;
    };

    const urlType: "link" | "text" = media.type === "video" && redgifsUrl ? "link" : "text";
    const isReady = true;

    let guidance = "";
    if (media.type === "video" && redgifsUrl) {
      guidance = "Ready to create link post with RedGIFs URL";
    } else if (media.type === "video" && !redgifsUrl) {
      guidance = "Ready to create text post - manual video upload required";
    } else if (media.type === "image") {
      guidance = "Ready to create text post - manual image upload required";
    }

    return {
      generateUrl,
      urlType,
      isReady,
      guidance,
    };
  }, [subreddit, media, caption, redgifsUrl, isRedgifsLoading]);

  return result;
};
