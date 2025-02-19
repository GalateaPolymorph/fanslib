import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { cn } from "@renderer/lib/utils";
import { Check, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { HashtagInput } from "../../components/HashtagInput";
import { useNiches } from "../../contexts/NicheContext";

type EditingNiche = {
  id: number;
  name: string;
  hashtags: string[];
};

export const NicheSettings = () => {
  const [nicheName, setNicheName] = useState("");
  const [editingNiche, setEditingNiche] = useState<EditingNiche | null>(null);
  const { niches, refresh } = useNiches();

  const createNiche = async () => {
    if (!nicheName.trim()) return;

    try {
      await window.api["tag:create"]({ name: nicheName });
      refresh();
      setNicheName("");
    } catch (error) {
      console.error("Failed to create niche", error);
    }
  };

  const updateNicheName = async () => {
    if (!editingNiche) return;

    try {
      await window.api["tag:update"](editingNiche.id, {
        name: editingNiche.name,
        hashtags: editingNiche.hashtags,
      });
      refresh();
      setEditingNiche(null);
    } catch (error) {
      console.error("Failed to update niche", error);
    }
  };

  const deleteNiche = async (id: number) => {
    try {
      await window.api["tag:delete"](id);
      refresh();
    } catch (error) {
      console.error("Failed to delete niche", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <header>
          <h3 className="text-lg font-medium">Niches</h3>
        </header>

        <div className="flex space-x-2">
          <Input
            placeholder="Add a niche"
            value={nicheName}
            onChange={(e) => setNicheName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createNiche()}
          />
          <Button onClick={createNiche}>Create</Button>
        </div>

        <div className="grid">
          {niches.map((niche, i) => (
            <div
              key={niche.id}
              className={cn(
                "grid grid-cols-[1fr_1fr_auto_auto] items-center gap-4 py-2 px-2 rounded-lg",
                editingNiche?.id === niche.id && "items-start",
                i % 2 === 0 && "bg-muted/50"
              )}
            >
              <div className="flex items-center flex-1">
                {editingNiche?.id === niche.id ? (
                  <div className="flex items-center flex-1">
                    <Input
                      value={editingNiche.name}
                      onChange={(e) => setEditingNiche({ ...editingNiche, name: e.target.value })}
                      className="h-8"
                    />
                  </div>
                ) : (
                  <>
                    <Badge shape="tag" size="lg">
                      {niche.name}
                    </Badge>
                  </>
                )}
              </div>

              <div className="flex-1">
                {editingNiche?.id === niche.id ? (
                  <HashtagInput
                    hashtags={editingNiche.hashtags}
                    onChange={(hashtags) => setEditingNiche({ ...editingNiche, hashtags })}
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {niche.hashtags.map((hashtag) => (
                      <Badge key={hashtag.id} variant="secondary">
                        {hashtag.name.startsWith("#") ? hashtag.name : `#${hashtag.name}`}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                {editingNiche?.id !== niche.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      setEditingNiche({
                        id: niche.id,
                        name: niche.name,
                        hashtags: niche.hashtags.map((hashtag) => hashtag.name),
                      })
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {editingNiche?.id === niche.id && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={updateNicheName}>
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => deleteNiche(niche.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
