import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useCreateHashtag } from "../../../hooks/api/useHashtags";

type NewHashtagRowProps = {
  channelCount: number;
  onHashtagCreated: () => void;
};

export const NewHashtagRow = ({ onHashtagCreated }: NewHashtagRowProps) => {
  const [newHashtagName, setNewHashtagName] = useState("");
  const createHashtagMutation = useCreateHashtag();

  const createHashtag = async () => {
    if (!newHashtagName.trim()) return;

    try {
      await createHashtagMutation.mutateAsync(newHashtagName);
      setNewHashtagName("");
      onHashtagCreated();
    } catch (error) {
      console.error("Failed to create hashtag", error);
    }
  };

  const keyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      createHashtag();
    }
  };

  return (
    <div className="p-2 px-4 h-12 flex items-center gap-2 w-full">
      <Input
        value={newHashtagName}
        onChange={(e) => setNewHashtagName(e.target.value)}
        onKeyDown={keyDown}
        placeholder="Add new hashtag..."
        variant="ghost"
        className="h-8"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={createHashtag}
        disabled={!newHashtagName.trim()}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
