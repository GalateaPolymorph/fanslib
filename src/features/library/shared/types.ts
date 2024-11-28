import { MediaData } from "src/lib/database/media/type";

export type MediaFile = {
  path: string;
  type: "image" | "video";
  name: string;
  size: number;
  created: Date;
  modified: Date;
};

export type Media = MediaFile & MediaData;
