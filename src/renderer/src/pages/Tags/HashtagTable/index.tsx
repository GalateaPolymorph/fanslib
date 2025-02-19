import { Table, TableBody, TableCell, TableRow } from "@renderer/components/ui/table";
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
    <div className="rounded-md border">
      <Table>
        <HashtagTableHeader channels={channels} />
        <TableBody>
          {hashtags.map((hashtag) => (
            <TableRow key={hashtag.id}>
              <TableCell>{hashtag.name}</TableCell>
              {channels.map((channel) => (
                <TableCell key={channel.id}>
                  <HashtagViewInput
                    initialValue={getViewCount(hashtag, channel.id)}
                    onViewCountChange={(newValue) =>
                      onStatsChange(hashtag.id, channel.id, newValue)
                    }
                  />
                </TableCell>
              ))}
              <TableCell>
                <DeleteHashtagButton
                  hashtagId={hashtag.id}
                  hashtagName={hashtag.name}
                  onHashtagDeleted={onHashtagDeleted}
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="hover:bg-muted/50">
            <NewHashtagRow channelCount={channels.length} onHashtagCreated={onHashtagCreated} />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
