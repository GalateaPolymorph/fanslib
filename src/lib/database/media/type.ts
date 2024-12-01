import { Category } from "../categories/type";

export type MediaType = "image" | "video";

export interface Media {
  path: string;
  type: MediaType;
  name: string;
  size: number;
  created: string; // ISO date string
  modified: string; // ISO date string

  isNew: boolean;

  categoryIds: string[];
  categories?: Category[];
}
