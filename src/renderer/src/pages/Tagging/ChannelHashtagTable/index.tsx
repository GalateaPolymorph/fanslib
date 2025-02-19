import { cn } from "@renderer/lib/utils";
import { ChannelBadge } from "../../../components/ChannelBadge";
import { HashtagInput } from "../../../components/HashtagInput";
import { Skeleton } from "../../../components/ui/skeleton";
import { useChannels } from "../../../contexts/ChannelContext";

export const ChannelHashtagTable = () => {
  const { channels, isLoading: isLoadingChannels, refetch } = useChannels();

  const updateChannelHashtags = async (channelId: string, hashtags: string[]) => {
    try {
      await window.api["channel:updateDefaultHashtags"](channelId, hashtags);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoadingChannels) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <h3 className="text-lg font-medium">Channel Default Hashtags</h3>
      </header>
      <div className="rounded-md border">
        {channels.map((channel, i) => (
          <div
            key={channel.id}
            className={cn("grid grid-cols-[1fr_5fr]", i % 2 === 1 && "bg-muted/50")}
          >
            <div className="p-2 pl-4 min-h-12 flex items-center">
              <ChannelBadge size="sm" name={channel.name} typeId={channel.typeId} />
            </div>
            <div className="p-2 pr-4 min-h-12 flex items-center">
              <HashtagInput
                hashtags={channel.defaultHashtags?.map((h) => h.name) ?? []}
                onChange={(hashtags) => updateChannelHashtags(channel.id, hashtags)}
                placeholder="Default hashtags"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
