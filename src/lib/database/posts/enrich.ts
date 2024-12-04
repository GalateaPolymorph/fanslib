import { isNotNil } from "ramda";
import { categoriesDb } from "../categories/base";
import { Category } from "../categories/type";
import { channelsDb } from "../channels/base";
import { enrichChannel } from "../channels/enrich";
import { Channel, RawChannel } from "../channels/type";
import { mediaDb } from "../media/base";
import { enrichMedia } from "../media/enrich";
import { Media } from "../media/type";
import { Post, RawPost } from "./type";

export const enrichPost = async (post: RawPost): Promise<Post> => {
  const [channelDb, categoryDb, mediaDatabase] = await Promise.all([
    channelsDb(),
    categoriesDb(),
    mediaDb(),
  ]);

  const [channel, category, enrichedMedia] = await Promise.all([
    new Promise<RawChannel | undefined>((resolve) => {
      channelDb.findOne({ id: post.channelId }, (err: Error | null, doc: RawChannel | null) => {
        if (err || !doc) resolve(undefined);
        else resolve(doc);
      });
    }).then((c) => c && enrichChannel(c)),
    new Promise<Category | undefined>((resolve) => {
      categoryDb.findOne({ slug: post.categorySlug }, (err: Error | null, doc: Category | null) => {
        if (err || !doc) resolve(undefined);
        else resolve(doc);
      });
    }),
    Promise.all(
      (post.mediaIds || []).map((mediaId) =>
        new Promise<Media | undefined>((resolve) => {
          mediaDatabase.findOne({ path: mediaId.path }, (err: Error | null, doc: Media | null) => {
            if (err || !doc) resolve(undefined);
            else resolve(doc);
          });
        })
          .then((m) => m && enrichMedia(m))
          .then((m) => m && { ...m, order: mediaId.order })
      )
    ).then((media) => media.filter(isNotNil)),
  ]);

  return {
    ...post,
    channel: channel || undefined,
    category,
    media: enrichedMedia || [],
  };
};

export const enrichPosts = async (posts: RawPost[]): Promise<Post[]> => {
  // Get all unique channel IDs and category slugs
  const channelIds = new Set(posts.map((post) => post.channelId));
  const categorySlugs = new Set(posts.map((post) => post.categorySlug).filter(Boolean));
  const mediaPaths = new Set(
    posts.flatMap((post) => (post.mediaIds || []).map((mediaId) => mediaId.path))
  );

  const [channelDb, categoryDb, mediaDatabase] = await Promise.all([
    channelsDb(),
    categoriesDb(),
    mediaDb(),
  ]);

  // Fetch all channels
  const channels = await new Promise<Record<string, Channel>>((resolve) => {
    channelDb.find(
      { id: { $in: Array.from(channelIds) } },
      async (err: Error | null, docs: RawChannel[]) => {
        if (err) {
          console.error("Error fetching channels:", err);
          resolve({});
          return;
        }
        const enriched = await Promise.all(docs.map(enrichChannel));
        resolve(
          Object.fromEntries(enriched.filter(isNotNil).map((channel) => [channel.id, channel]))
        );
      }
    );
  });

  // Fetch all categories
  const categories = await new Promise<Record<string, Category>>((resolve) => {
    categoryDb.find(
      { slug: { $in: Array.from(categorySlugs) } },
      (err: Error | null, docs: Category[]) => {
        if (err) {
          console.error("Error fetching categories:", err);
          resolve({});
          return;
        }
        resolve(Object.fromEntries(docs.map((category) => [category.slug, category])));
      }
    );
  });

  // Fetch all media
  const media = await new Promise<Record<string, Media>>((resolve) => {
    mediaDatabase.find(
      { path: { $in: Array.from(mediaPaths) } },
      async (err: Error | null, docs: Media[]) => {
        if (err) {
          console.error("Error fetching media:", err);
          resolve({});
          return;
        }
        const enriched = await Promise.all(docs.map(enrichMedia));
        resolve(Object.fromEntries(enriched.filter(Boolean).map((media) => [media.path, media])));
      }
    );
  });

  // Enrich each post
  return posts.map((post) => ({
    ...post,
    channel: channels[post.channelId],
    category: post.categorySlug ? categories[post.categorySlug] : undefined,
    media: (post.mediaIds || [])
      .map((mediaId) => {
        const m = media[mediaId.path];
        return m ? { ...m, order: mediaId.order } : undefined;
      })
      .filter(isNotNil),
  }));
};
