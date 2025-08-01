import { Button } from "@renderer/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@renderer/components/ui/Dialog";
import { PageContainer } from "@renderer/components/ui/PageContainer/PageContainer";
import { PageHeader } from "@renderer/components/ui/PageHeader/PageHeader";
import { useChannels, useDeleteChannel } from "@renderer/hooks/api/useChannels";
import { CreateChannelForm } from "@renderer/pages/Channels/CreateChannelForm";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Channel } from "../../../../features/channels/entity";
import { ChannelView } from "./ChannelView";

export const ChannelsPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  const { data: channels = [], refetch } = useChannels();
  const deleteChannelMutation = useDeleteChannel();

  const handleNewChannel = (channel: Channel) => {
    refetch();
    setIsCreateDialogOpen(false);
    setEditingChannelId(channel.id);
  };

  const handleChannelDelete = async (channel: Channel) => {
    await deleteChannelMutation.mutateAsync(channel.id);
    if (editingChannelId === channel.id) {
      setEditingChannelId(null);
    }
  };

  const handleChannelUpdate = () => {
    refetch();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Channels"
        description="Manage your content distribution channels"
        actions={
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
        }
      />

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
    </PageContainer>
  );
};
