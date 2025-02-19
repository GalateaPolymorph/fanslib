import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

type NewNicheRowProps = {
  onNicheCreated: () => void;
};

export const NewNicheRow = ({ onNicheCreated }: NewNicheRowProps) => {
  const [nicheName, setNicheName] = useState("");

  const createNiche = async () => {
    if (!nicheName.trim()) return;

    try {
      await window.api["niche:create"]({ name: nicheName });
      setNicheName("");
      onNicheCreated();
    } catch (error) {
      console.error("Failed to create niche", error);
    }
  };

  const keyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      createNiche();
    }
  };

  return (
    <div className="flex h-12 justify-between items-center gap-4 py-2 px-4">
      <Input
        value={nicheName}
        onChange={(e) => setNicheName(e.target.value)}
        onKeyDown={keyDown}
        placeholder="Add new niche..."
        variant="ghost"
        className="h-8"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={createNiche}
        disabled={!nicheName.trim()}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
