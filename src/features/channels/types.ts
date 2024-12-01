import { Channel } from "../../lib/database/channels/type";

export interface ChannelsAPI {
  /**
   * Get all channels
   */
  getAllChannels: () => Promise<Channel[]>;

  /**
   * Create a new channel
   * @param data Channel data
   */
  createChannel: (data: Omit<Channel, "id" | "createdAt" | "updatedAt">) => Promise<Channel>;

  /**
   * Update a channel
   * @param id Channel ID
   * @param updates Updates to apply
   */
  updateChannel: (
    id: string,
    updates: Partial<Omit<Channel, "id" | "createdAt" | "updatedAt">>
  ) => Promise<Channel>;

  /**
   * Delete a channel
   * @param id Channel ID
   */
  deleteChannel: (id: string) => Promise<void>;
}
