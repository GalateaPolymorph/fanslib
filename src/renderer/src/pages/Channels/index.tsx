import { Button } from "@renderer/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@renderer/components/ui/dialog";
import { useChannels } from "@renderer/contexts/ChannelContext";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Channel } from "../../../../features/channels/entity";
import { ChannelView } from "./ChannelView";
import { CreateChannelForm } from "./CreateChannelForm";

export const ChannelsPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  const { channels, refetch } = useChannels();

  const handleNewChannel = (channel: Channel) => {
    refetch();
    setIsCreateDialogOpen(false);
    setEditingChannelId(channel.id);
  };

  const handleChannelDelete = async (channel: Channel) => {
    await window.api["channel:delete"](channel.id);
    refetch();
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
              onUpdate={refetch}
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
