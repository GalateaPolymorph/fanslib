import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { cn } from "@renderer/lib/utils";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";
import { HashtagInput } from "../../../components/HashtagInput";
import { useNiches } from "../../../contexts/NicheContext";
import { DeleteNicheButton } from "./DeleteNicheButton";
import { NewNicheRow } from "./NewNicheRow";

type EditingNiche = {
  id: number;
  name: string;
  hashtags: string[];
};

type NicheTableProps = {
  onNicheUpdated?: () => void;
};

export const NicheTable = ({ onNicheUpdated }: NicheTableProps) => {
  const [editingNiche, setEditingNiche] = useState<EditingNiche | null>(null);
  const { niches, refresh } = useNiches();

  const updateNiche = async (niche: EditingNiche) => {
    if (!niche) return;
    console.log("updating", niche);

    try {
      await window.api["niche:update"](niche.id, {
        name: niche.name,
        hashtags: niche.hashtags,
      });
      refresh();
      setEditingNiche(null);
      onNicheUpdated?.();
    } catch (error) {
      console.error("Failed to update niche", error);
    }
  };

  return (
    <div className="space-y-4">
      <header>
        <h3 className="text-lg font-medium">Niches</h3>
      </header>

      <div className="rounded-md border">
        {niches.map((niche, i) => (
          <div className="grid grid-cols-[1fr_4fr_auto]" key={niche.id}>
            {editingNiche?.id === niche.id ? (
              <div
                className={cn(
                  "min-h-14 p-2 pl-4 flex items-center justify-between gap-2",
                  i % 2 === 0 && "bg-muted/50"
                )}
              >
                <Input
                  value={editingNiche.name}
                  onChange={(e) => setEditingNiche({ ...editingNiche, name: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && updateNiche(editingNiche)}
                  className="h-8"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateNiche(editingNiche)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  "min-h-14 p-2 pl-4 flex items-center justify-between group",
                  i % 2 === 0 && "bg-muted/50"
                )}
              >
                <Badge size="lg">{niche.name}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="group-hover:opacity-100 transition-opacity opacity-0 h-8 w-8"
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
              </div>
            )}

            <div
              className={cn("min-h-14 p-2 flex w-full items-center", i % 2 === 0 && "bg-muted/50")}
            >
              <HashtagInput
                hashtags={niche.hashtags.map((h) => h.name)}
                onChange={(hashtags) => {
                  updateNiche({ ...niche, ...editingNiche, hashtags });
                }}
              />
            </div>

            <div
              className={cn(
                "min-h-14 p-2 pr-4 flex w-full items-center",
                i % 2 === 0 && "bg-muted/50"
              )}
            >
              <DeleteNicheButton
                nicheId={niche.id}
                nicheName={niche.name}
                onNicheDeleted={refresh}
              />
            </div>
          </div>
        ))}
        <NewNicheRow onNicheCreated={refresh} />
      </div>
    </div>
  );
};
