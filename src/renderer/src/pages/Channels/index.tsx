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
    setIsCreateDialogOpen(false);
    loadChannels();
  };

  if (channels.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col justify-between mb-6 max-w-xl">
          <h2 className="text-xl font-bold mb-6">Create Your First Channel</h2>
          <CreateChannelForm onSubmit={handleCreateChannel} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Channel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Channel</DialogTitle>
            </DialogHeader>
            <CreateChannelForm onSubmit={handleCreateChannel} className="mt-4" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: channel.type.color }}
              />
              <h3 className="font-semibold">{channel.name}</h3>
            </div>
            {channel.description && (
              <p className="text-sm text-muted-foreground">{channel.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
