import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { HashtagViewInput } from "./HashtagViewInput";

type NewHashtagRowProps = {
  channelCount: number;
  onHashtagCreated: () => void;
};

export const NewHashtagRow = ({ channelCount, onHashtagCreated }: NewHashtagRowProps) => {
  const [newHashtagName, setNewHashtagName] = useState("");

  const createHashtag = async () => {
    if (!newHashtagName.trim()) return;

    try {
      await window.api["hashtag:create"](newHashtagName);
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
    <>
      <td>
        <div className="flex items-center gap-2">
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
      </td>
      {Array.from({ length: channelCount }).map((_, index) => (
        <td key={index}>
          <HashtagViewInput initialValue={0} onViewCountChange={() => {}} disabled />
        </td>
      ))}
      <td />
    </>
  );
};
