import { ChannelTypeIcon } from "@renderer/components/ChannelTypeIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@renderer/components/ui/alert-dialog";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Textarea } from "@renderer/components/ui/textarea";
import { cn } from "@renderer/lib/utils";
import { Edit2, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CHANNEL_TYPES } from "../../../../lib/database/channels/channelTypes";
import { Channel } from "../../../../lib/database/channels/type";
import { ContentSchedule } from "../../../../lib/database/content-schedules/type";
import { ContentScheduleForm } from "./ContentScheduleForm";
import { ContentScheduleList } from "./ContentScheduleList";

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
  const [schedules, setSchedules] = useState<ContentSchedule[]>([]);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ContentSchedule | null>(null);

  useEffect(() => {
    setName(channel.name);
    setDescription(channel.description || "");
    loadSchedules();
  }, [channel]);

  const loadSchedules = async () => {
    const schedules = await window.api.contentSchedule.getContentSchedulesForChannel(channel.id);
    setSchedules(schedules);
  };

  const handleSave = async () => {
    await window.api.channel.updateChannel(channel.id, {
      name,
      description,
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
    onEditingChange?.(false);
  };

  const handleAddSchedule = async (schedule: Omit<ContentSchedule, "id" | "channelId">) => {
    await window.api.contentSchedule.createContentSchedule({ ...schedule, channelId: channel.id });
    await loadSchedules();
    setIsAddingSchedule(false);
  };

  const handleUpdateSchedule = async (
    scheduleId: string,
    schedule: Omit<ContentSchedule, "id" | "channelId">
  ) => {
    await window.api.contentSchedule.updateContentSchedule(scheduleId, {
      ...schedule,
      channelId: channel.id,
    });
    await loadSchedules();
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = async (schedule: ContentSchedule) => {
    await window.api.contentSchedule.deleteContentSchedule(schedule.id);
    await loadSchedules();
  };

  return (
    <div className={cn("group flex items-start gap-3", className)}>
      <ChannelTypeIcon typeId={channel.type.id as keyof typeof CHANNEL_TYPES} />
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
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
            </div>
            <div>
              <div className="sticky top-4 space-y-4">
                <div className="flex flex-col gap-2 items-start">
                  <Button size="sm" onClick={handleSave} className="min-w-36">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel} className="min-w-36">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="min-w-36">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Channel</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this channel? This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete?.(channel)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="group/header">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-medium truncate">{channel.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover/header:opacity-100 transition-opacity"
                  onClick={() => onEditingChange?.(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              {channel.description && (
                <p className="text-sm text-muted-foreground mt-1">{channel.description}</p>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex flex-col gap-4 justify-between">
                {isAddingSchedule && (
                  <ContentScheduleForm
                    existingSchedules={schedules}
                    onSubmit={handleAddSchedule}
                    onCancel={() => setIsAddingSchedule(false)}
                  />
                )}

                {editingSchedule && (
                  <ContentScheduleForm
                    schedule={editingSchedule}
                    existingSchedules={schedules}
                    onSubmit={(schedule) => handleUpdateSchedule(editingSchedule.id, schedule)}
                    onCancel={() => setEditingSchedule(null)}
                  />
                )}

                {!isAddingSchedule && !editingSchedule && (
                  <ContentScheduleList
                    schedules={schedules}
                    onEdit={setEditingSchedule}
                    onDelete={handleDeleteSchedule}
                  />
                )}

                {!isAddingSchedule && !editingSchedule && (
                  <Button size="sm" variant="outline" onClick={() => setIsAddingSchedule(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Schedule
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
