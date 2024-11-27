export type MediaFile = {
  path: string;
  type: "image" | "video";
  name: string;
  size: number;
  created: Date;
  modified: Date;
};

export type MediaData = {
  isNew: boolean;
};

export type Media = MediaFile & MediaData;
