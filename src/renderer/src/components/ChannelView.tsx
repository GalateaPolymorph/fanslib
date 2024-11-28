import { ChannelTypeIcon } from "@renderer/components/ChannelTypeIcon";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Textarea } from "@renderer/components/ui/textarea";
import { cn } from "@renderer/lib/utils";
import { Edit2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CHANNEL_TYPES } from "../../../lib/database/channels/channelTypes";
import { Channel } from "../../../lib/database/channels/type";

interface ChannelViewProps {
  channel: Channel;
  className?: string;
  onUpdate?: (channel: Channel) => void;
}

export const ChannelView = ({ channel, className, onUpdate }: ChannelViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(channel.name);
  const [description, setDescription] = useState(channel.description || "");

  useEffect(() => {
    setName(channel.name);
    setDescription(channel.description || "");
  }, [channel]);

  const handleSave = async () => {
    await window.api.channel.updateChannel(channel.id, { name, description });
    onUpdate?.({ ...channel, name, description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(channel.name);
    setDescription(channel.description || "");
    setIsEditing(false);
  };

  return (
    <div className={cn("group flex items-start gap-3", className)}>
      <ChannelTypeIcon typeId={channel.typeId as keyof typeof CHANNEL_TYPES} />
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-medium"
              placeholder="Channel name"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm resize-none"
              placeholder="Channel description (optional)"
              rows={2}
            />
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-medium truncate">{channel.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            {channel.description && (
              <p className="text-sm text-muted-foreground">{channel.description}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};
