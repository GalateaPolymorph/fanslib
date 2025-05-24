import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { useNiches, useUpdateNiche } from "@renderer/hooks";
import { cn } from "@renderer/lib/utils";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";
import { HashtagInput } from "../../../components/HashtagInput";
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
  const { data: niches = [], isLoading, refetch } = useNiches();
  const updateNicheMutation = useUpdateNiche();

  const updateNiche = async (niche: EditingNiche) => {
    if (!niche) return;

    try {
      await updateNicheMutation.mutateAsync({
        nicheId: niche.id,
        updates: {
          name: niche.name,
          hashtags: niche.hashtags,
        },
      });
      setEditingNiche(null);
      onNicheUpdated?.();
    } catch (error) {
      console.error("Failed to update niche", error);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading niches...</div>;
  }

  return (
    <div className="space-y-4">
      <header>
        <h3 className="text-lg font-medium">Niches</h3>
      </header>

      <div className="rounded-md border">
        {niches.map((niche, i) => (
          <div className="grid grid-cols-[1fr_4fr_auto]" key={niche.id}>
            <div
              className={cn("min-h-14 p-2 flex w-full items-center", i % 2 === 0 && "bg-muted/50")}
            >
              {editingNiche?.id === niche.id ? (
                <div className="flex gap-2 items-center w-full">
                  <Input
                    value={editingNiche.name}
                    onChange={(e) =>
                      setEditingNiche({
                        ...editingNiche,
                        name: e.target.value,
                      })
                    }
                    className="h-8"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => updateNiche(editingNiche)}
                    disabled={updateNicheMutation.isPending}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 items-center w-full">
                  <Badge variant="secondary">{niche.name}</Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() =>
                      setEditingNiche({
                        id: niche.id,
                        name: niche.name,
                        hashtags: niche.hashtags.map((h) => h.name),
                      })
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

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
                onNicheDeleted={() => {
                  refetch();
                  onNicheUpdated?.();
                }}
              />
            </div>
          </div>
        ))}
        <NewNicheRow
          onNicheCreated={() => {
            refetch();
            onNicheUpdated?.();
          }}
        />
      </div>
    </div>
  );
};
