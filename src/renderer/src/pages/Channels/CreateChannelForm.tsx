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
    typeId: "onlyfans" as keyof typeof CHANNEL_TYPES,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      description: "",
      typeId: "onlyfans" as keyof typeof CHANNEL_TYPES,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(CHANNEL_TYPES).map(([id, type]) => (
            <Badge
              key={id}
              variant="outline"
              className="gap-2 py-1.5 transition-colors hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: formData.typeId === id ? type.color : "transparent",
                borderColor: type.color,
                color: formData.typeId === id ? "white" : type.color,
              }}
              onClick={() =>
                setFormData((prev) => ({ ...prev, typeId: id as keyof typeof CHANNEL_TYPES }))
              }
            >
              <ChannelTypeIcon
                typeId={id as keyof typeof CHANNEL_TYPES}
                color={formData.typeId === id ? "white" : type.color}
                className="w-5 h-5"
              />
              <span>{type.name}</span>
            </Badge>
          ))}
        </div>
        <div className="grid gap-2">
          <Input
            placeholder="Channel name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <Button type="submit" disabled={!formData.name || !formData.typeId}>
          Create Channel
        </Button>
      </div>
    </form>
  );
};
