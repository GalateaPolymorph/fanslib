import { Channel } from "src/features/channels/entity";
import { ChannelBadge } from "../../../components/ChannelBadge";
import { TableHead, TableHeader, TableRow } from "../../../components/ui/table";

type HashtagTableHeaderProps = {
  channels: Channel[];
};

export const HashtagTableHeader = ({ channels }: HashtagTableHeaderProps) => (
  <TableHeader>
    <TableRow>
      <TableHead>Hashtag</TableHead>
      {channels.map((channel) => (
        <TableHead key={channel.id}>
          <div className="flex items-center gap-2">
            <ChannelBadge size="sm" name={channel.name} typeId={channel.typeId} />
            <span>Views</span>
          </div>
        </TableHead>
      ))}
      <TableHead />
    </TableRow>
  </TableHeader>
);
