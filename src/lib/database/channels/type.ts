export type ChannelType = {
  id: string;
  name: string;
  color?: string;
};

export type RawChannel = {
  id: string;
  name: string;
  description?: string;

  typeId: string;
};

export type Channel = RawChannel & {
  type: ChannelType;
};
