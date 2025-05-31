import { ChannelTypeIcon } from "@renderer/components/ChannelTypeIcon";
import { MediaFilters as MediaFiltersComponent } from "@renderer/components/MediaFilters";
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
import { useCallback, useEffect, useState } from "react";
import { CHANNEL_TYPES } from "../../../../features/channels/channelTypes";
import { Channel } from "../../../../features/channels/entity";
import { ContentScheduleCreateData } from "../../../../features/content-schedules/api-type";
import { ContentSchedule } from "../../../../features/content-schedules/entity";
import type { MediaFilters } from "../../../../features/library/api-type";
import { sanitizeFilterInput } from "../../../../features/library/filter-helpers";
import { ContentScheduleForm } from "./ContentScheduleForm";
import { ContentScheduleList } from "./ContentScheduleList";

type ChannelViewProps = {
  channel: Channel;
  className?: string;
  onUpdate?: (channel: Channel) => void;
  onDelete?: (channel: Channel) => void;
  isEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
};

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
  const [eligibleMediaFilter, setEligibleMediaFilter] = useState<MediaFilters>(() =>
    sanitizeFilterInput(channel.eligibleMediaFilter)
  );
  const [schedules, setSchedules] = useState<ContentSchedule[]>([]);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ContentSchedule | null>(null);

  const loadSchedules = useCallback(async () => {
    const schedules = await window.api["content-schedule:getByChannel"](channel.id);
    setSchedules(schedules);
  }, [channel]);

  useEffect(() => {
    setName(channel.name);
    setDescription(channel.description || "");
    setEligibleMediaFilter(sanitizeFilterInput(channel.eligibleMediaFilter));
    loadSchedules();
  }, [channel, loadSchedules]);

  const handleSave = async () => {
    const updatedChannel = await window.api["channel:update"](channel.id, {
      name,
      description,
      eligibleMediaFilter,
    });

    onUpdate?.(updatedChannel);
    onEditingChange?.(false);
  };

  const handleCancel = () => {
    setName(channel.name);
    setDescription(channel.description || "");
    setEligibleMediaFilter(sanitizeFilterInput(channel.eligibleMediaFilter));
    onEditingChange?.(false);
  };

  const handleAddSchedule = async (schedule: ContentScheduleCreateData) => {
    await window.api["content-schedule:create"]({ ...schedule, channelId: channel.id });
    await loadSchedules();
    setIsAddingSchedule(false);
  };

  const handleUpdateSchedule = async (scheduleId: string, schedule: ContentScheduleCreateData) => {
    await window.api["content-schedule:update"](scheduleId, schedule);
    await loadSchedules();
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = async (schedule: ContentSchedule) => {
    await window.api["content-schedule:delete"](schedule.id);
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
              <MediaFiltersComponent
                value={eligibleMediaFilter}
                onChange={setEligibleMediaFilter}
                showClearButton={false}
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
                    channelId={channel.id}
                    onSubmit={handleAddSchedule}
                    onCancel={() => setIsAddingSchedule(false)}
                  />
                )}

                {editingSchedule && (
                  <ContentScheduleForm
                    channelId={channel.id}
                    schedule={editingSchedule}
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
