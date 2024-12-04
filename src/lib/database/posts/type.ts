import { Category } from "../categories/type";
import { Channel } from "../channels/type";
import { Media } from "../media/type";

export type PostStatus = "planned" | "scheduled" | "posted";

export type MediaId = {
  path: string;
  order: number;
};
export type PostMedia = Media & MediaId;

export interface RawPost {
  id: string;
  scheduleId: string;
  channelId: string;
  categorySlug?: string;
  caption: string;
  scheduledDate: string; // ISO string
  status: PostStatus;
  mediaIds: MediaId[];
  createdAt: string;
  updatedAt: string;
}

export interface Post extends RawPost {
  media: PostMedia[];
  channel?: Channel;
  category?: Category;
}
