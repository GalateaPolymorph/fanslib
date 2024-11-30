import { Button } from "@renderer/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@renderer/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Channel } from "../../../../lib/database/channels/type";
import { ChannelView } from "./ChannelView";
import { CreateChannelForm } from "./CreateChannelForm";

export const ChannelsPage = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    const channels = await window.api.channel.getAllChannels();
    setChannels(channels);
  };

  const handleNewChannel = (channel: Channel) => {
    setChannels((prev) => [...prev, channel]);
    setIsCreateDialogOpen(false);
    setEditingChannelId(channel.id);
  };

  const handleChannelUpdate = (updatedChannel: Channel) => {
    setChannels((prev) => prev.map((ch) => (ch.id === updatedChannel.id ? updatedChannel : ch)));
  };

  const handleChannelDelete = async (channel: Channel) => {
    await window.api.channel.deleteChannel(channel.id);
    setChannels((prev) => prev.filter((ch) => ch.id !== channel.id));
    if (editingChannelId === channel.id) {
      setEditingChannelId(null);
    }
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
            <CreateChannelForm onSubmit={handleNewChannel} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3 divide-y">
        {channels.map((channel) => (
          <div key={channel.id} className="p-6">
            <ChannelView
              channel={channel}
              onUpdate={handleChannelUpdate}
              onDelete={handleChannelDelete}
              isEditing={channel.id === editingChannelId}
              onEditingChange={(editing) => setEditingChannelId(editing ? channel.id : null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
