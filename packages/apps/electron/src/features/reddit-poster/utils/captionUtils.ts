import { Media } from "../../library/entity";
import { fetchPostsByMediaId } from "../../posts/operations";

export const removeHashtagsFromEnd = (caption: string): string => {
  if (!caption) return "";
  return caption.replace(/#[^\s]*(\s+#[^\s]*)*\s*$/, "").trim();
};

export const generateCaptionForMedia = async (media: Media): Promise<string> => {
  try {
    const posts = await fetchPostsByMediaId(media.id);

    const postsWithCaptions = posts
      .filter((post) => post.caption && post.caption.trim().length > 0)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const caption = postsWithCaptions.length > 0 ? postsWithCaptions[0].caption || "" : "";
    return removeHashtagsFromEnd(caption);
  } catch (error) {
    console.error("Error generating caption:", error);
    return "";
  }
};