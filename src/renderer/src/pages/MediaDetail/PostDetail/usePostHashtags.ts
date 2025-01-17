import { useSettings } from "@renderer/contexts/SettingsContext";
import { Post } from "../../../../../features/posts/entity";

export const usePostHashtags = (post: Post) => {
  const { settings } = useSettings();

  const collectHashtags = () => {
    const defaultHashtags = settings?.defaultHashtags ?? [];

    // Get all unique hashtags from all media tags
    const mediaHashtags = post.postMedia
      .map((pm) => pm.media.tags ?? [])
      .flat()
      .map((tag) => tag.hashtags ?? [])
      .flat();

    // Combine and deduplicate hashtags
    const uniqueHashtags = Array.from(new Set([...defaultHashtags, ...mediaHashtags]));

    return uniqueHashtags.map((hashtag) => (hashtag.startsWith("#") ? hashtag : `#${hashtag}`));
  };

  return { collectHashtags };
};
