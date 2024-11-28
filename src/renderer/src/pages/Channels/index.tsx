import { ChannelView } from "@renderer/components/ChannelView";
import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { CHANNEL_TYPES } from "../../../../lib/database/channels/channelTypes";
import { Channel } from "../../../../lib/database/channels/type";
import { CreateChannelForm } from "./CreateChannelForm";

export const ChannelsPage = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    const channels = await window.api.channel.getAllChannels();
    setChannels(channels);
  };

  const handleCreateChannel = async (data: {
    name: string;
    description: string;
    typeId: keyof typeof CHANNEL_TYPES;
  }) => {
    await window.api.channel.createChannel(data);
    loadChannels();
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Channels</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Channel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Channel</DialogTitle>
            </DialogHeader>
            <CreateChannelForm onSubmit={handleCreateChannel} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3 divide-y">
        {channels.map((channel) => (
          <div key={channel.id} className="p-6">
            <ChannelView
              channel={channel}
              onUpdate={(updatedChannel) => {
                setChannels((prevChannels) =>
                  prevChannels.map((ch) => (ch.id === updatedChannel.id ? updatedChannel : ch))
                );
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
