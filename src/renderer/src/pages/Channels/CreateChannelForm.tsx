import { Select, SelectContent, SelectItem, SelectTrigger } from "@radix-ui/react-select";
import { ChannelTypeIcon } from "@renderer/components/ChannelTypeIcon";
import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { useState } from "react";
import { CHANNEL_TYPES } from "../../../../lib/database/channels/channelTypes";

interface CreateChannelFormProps {
  onSubmit: (data: {
    name: string;
    description: string;
    typeId: keyof typeof CHANNEL_TYPES;
  }) => void;
  className?: string;
}

export const CreateChannelForm = ({ onSubmit, className = "" }: CreateChannelFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    typeId: "" as keyof typeof CHANNEL_TYPES,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", description: "", typeId: "" as keyof typeof CHANNEL_TYPES });
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Select>
            <SelectTrigger>
              <Badge
                variant="outline"
                className="w-full gap-2 py-1.5 border transition-colors hover:opacity-90 cursor-pointer font-normal"
              >
                <ChannelTypeIcon typeId={formData.typeId} className="w-5 h-5" />
                <span>{CHANNEL_TYPES[formData.typeId].name}</span>
              </Badge>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CHANNEL_TYPES).map(([id, type]) => (
                <SelectItem
                  key={id}
                  value={id}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, typeId: id as keyof typeof CHANNEL_TYPES }))
                  }
                >
                  <div className="flex items-center gap-2">
                    <ChannelTypeIcon
                      typeId={id as keyof typeof CHANNEL_TYPES}
                      className="w-5 h-5"
                    />
                    <span>{type.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Input
            placeholder="Channel name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Input
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
      </div>
      <Button type="submit" className="mt-4" disabled={!formData.name || !formData.typeId}>
        Create Channel
      </Button>
    </form>
  );
};
