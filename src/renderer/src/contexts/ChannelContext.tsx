import { createContext, useContext, useEffect, useState } from "react";
import { Channel } from "../../../features/channels/entity";

type ChannelContextType = {
  channels: Channel[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const ChannelProvider = ({ children }: { children: React.ReactNode }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChannels = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedChannels = await window.api["channel:getAll"]();
      setChannels(fetchedChannels);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch channels"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const value = {
    channels,
    isLoading,
    error,
    refetch: fetchChannels,
  };

  return <ChannelContext.Provider value={value}>{children}</ChannelContext.Provider>;
};

export const useChannels = () => {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error("useChannels must be used within a ChannelProvider");
  }
  return context;
};
