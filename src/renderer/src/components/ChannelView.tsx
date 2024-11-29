import { CategorySelect } from "@renderer/components/CategorySelect";
import { ChannelTypeIcon } from "@renderer/components/ChannelTypeIcon";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Textarea } from "@renderer/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@renderer/components/ui/alert-dialog";
import { cn } from "@renderer/lib/utils";
import { Edit2, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CHANNEL_TYPES } from "../../../lib/database/channels/channelTypes";
import { Channel } from "../../../lib/database/channels/type";

interface ChannelViewProps {
  channel: Channel;
  className?: string;
  onUpdate?: (channel: Channel) => void;
  onDelete?: (channel: Channel) => void;
  isEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
}

export const ChannelView = ({
  channel,
  className,
  onUpdate,
  onDelete,
  isEditing = false,
  onEditingChange,
}: ChannelViewProps) => {
  const [name, setName] = useState(channel.name);
  const [description, setDescription] = useState(channel.description || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    channel.categories?.map((c) => c.slug) || []
  );

  useEffect(() => {
    setName(channel.name);
    setDescription(channel.description || "");
    setSelectedCategories(channel.categories?.map((c) => c.slug) || []);
  }, [channel]);

  const handleSave = async () => {
    await window.api.channel.updateChannel(channel.id, {
      name,
      description,
      categoryIds: selectedCategories,
    });
    
    const updatedChannel = await window.api.channel.getChannel(channel.id);
    if (updatedChannel) {
      onUpdate?.(updatedChannel);
    }
    
    onEditingChange?.(false);
  };

  const handleCancel = () => {
    setName(channel.name);
    setDescription(channel.description || "");
    setSelectedCategories(channel.categories?.map((c) => c.slug) || []);
    onEditingChange?.(false);
  };

  return (
    <div className={cn("group flex items-start gap-3", className)}>
      <ChannelTypeIcon typeId={channel.type.id as keyof typeof CHANNEL_TYPES} />
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
            <CategorySelect
              value={selectedCategories}
              onChange={(categorySlugs) => setSelectedCategories(categorySlugs)}
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Channel</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this channel? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete?.(channel)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
                onClick={() => onEditingChange?.(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            {channel.description && (
              <p className="text-sm text-muted-foreground">{channel.description}</p>
            )}
            {channel.categories && channel.categories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {channel.categories.map((category) => (
                  <div
                    key={category.slug}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: category.color + "20",
                      color: category.color,
                    }}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
