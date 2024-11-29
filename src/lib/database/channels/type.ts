import { Category } from "../categories/type";

export interface ChannelType {
  id: string;
  name: string;
  color?: string;
}

export interface RawChannel {
  id: string;
  name: string;
  description?: string;
  typeId: string;
  categoryIds: string[];
}

export type Channel = RawChannel & {
  type: ChannelType;
  categories: Category[];
};
