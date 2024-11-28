import { Category } from "../categories/type";

export interface RawMediaData {
  path: string;
  isNew: boolean;
  categoryIds: string[];
}

export interface MediaData extends RawMediaData {
  categories?: Category[];
}
