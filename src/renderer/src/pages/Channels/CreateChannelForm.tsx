import {
  BlueSkyIcon,
  FanslyIcon,
  InstagramIcon,
  ManyVidsIcon,
  OnlyFansIcon,
  RedditIcon,
  XIcon,
} from "@renderer/components/icons";
import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { cn } from "@renderer/lib/utils";
import { useState } from "react";
import { CHANNEL_TYPES } from "../../../../lib/database/channels/channelTypes";

const CHANNEL_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  crown: OnlyFansIcon,
  heart: FanslyIcon,
  play: ManyVidsIcon,
  camera: InstagramIcon,
  cloud: BlueSkyIcon,
  twitter: XIcon,
  "message-circle": RedditIcon,
};

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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(CHANNEL_TYPES).map(([key, type]) => {
              const Icon = CHANNEL_ICONS[type.icon];
              const isSelected = formData.typeId === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  className="w-full"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, typeId: key as keyof typeof CHANNEL_TYPES }))
                  }
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      "w-full gap-2 py-1.5 border transition-colors hover:opacity-90 cursor-pointer font-normal",
                      isSelected ? "text-white" : "bg-transparent"
                    )}
                    style={{
                      backgroundColor: isSelected ? type.color : "transparent",
                      borderColor: type.color,
                      color: isSelected && type.color === "#000000" ? "white" : undefined,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{type.name}</span>
                  </Badge>
                </button>
              );
            })}
          </div>
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
