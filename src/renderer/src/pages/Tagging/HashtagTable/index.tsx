import { Badge } from "@renderer/components/ui/badge";
import { cn } from "@renderer/lib/utils";
import { CSSProperties } from "react";
import { HashtagWithStats } from "../../../../../features/hashtags/api-type";
import { Skeleton } from "../../../components/ui/skeleton";
import { useChannels } from "../../../contexts/ChannelContext";
import { DeleteHashtagButton } from "./DeleteHashtagButton";
import { HashtagTableHeader } from "./HashtagTableHeader";
import { HashtagViewInput } from "./HashtagViewInput";
import { NewHashtagRow } from "./NewHashtagRow";

type HashtagTableProps = {
  hashtags: HashtagWithStats[];
  onStatsChange: (hashtagId: number, channelId: string, views: number) => void;
  onHashtagCreated: () => void;
  onHashtagDeleted: () => void;
};

export const HashtagTable = ({
  hashtags,
  onStatsChange,
  onHashtagCreated,
  onHashtagDeleted,
}: HashtagTableProps) => {
  const { channels, isLoading: isLoadingChannels } = useChannels();

  const getViewCount = (hashtag: HashtagWithStats, channelId: string) => {
    const stat = hashtag.channelStats.find((s) => s.channelId === channelId);
    return stat?.views ?? 0;
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
        <h3 className="text-lg font-medium">Hashtags</h3>
      </header>
      <div className="rounded-md border">
        <HashtagTableHeader channels={channels} />
        {hashtags.map((hashtag, i) => (
          <div
            key={hashtag.id}
            className={cn("grid grid-cols-[1fr_5fr_auto]", i % 2 === 0 && "bg-muted/50")}
          >
            <div className="p-2 pl-4 h-12 flex items-center">
              <Badge variant="secondary">{hashtag.name}</Badge>
            </div>
            <div
              className="grid grid-cols-[repeat(var(--channel-count),_1fr)]"
              style={{ "--channel-count": channels.length } as CSSProperties}
            >
              {channels.map((channel) => (
                <div key={channel.id} className="p-2 h-12 max-w-48 flex items-center justify-start">
                  <HashtagViewInput
                    initialValue={getViewCount(hashtag, channel.id)}
                    onViewCountChange={(newValue) =>
                      onStatsChange(hashtag.id, channel.id, newValue)
                    }
                  />
                </div>
              ))}
            </div>
            <DeleteHashtagButton
              hashtagId={hashtag.id}
              hashtagName={hashtag.name}
              onHashtagDeleted={onHashtagDeleted}
            />
          </div>
        ))}
        <NewHashtagRow channelCount={channels.length} onHashtagCreated={onHashtagCreated} />
      </div>
    </div>
  );
};
