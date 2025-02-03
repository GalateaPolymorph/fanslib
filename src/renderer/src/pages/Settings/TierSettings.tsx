import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@renderer/components/ui/dialog";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { useToast } from "@renderer/components/ui/use-toast";
import { printTier } from "@renderer/lib/tier";
import { Edit2, GripHorizontal, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Tier } from "src/features/tiers/entity";

type TierFormData = {
  name: string;
};

type TierDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TierFormData) => Promise<void>;
  initialData?: TierFormData;
  title: string;
};

const TierDialog = ({ isOpen, onClose, onSubmit, initialData, title }: TierDialogProps) => {
  const [name, setName] = useState(initialData?.name ?? "");
  const { toast } = useToast();

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit({ name });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitForm} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tier name"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

type SortableTierProps = {
  tier: Tier;
  onEdit: () => void;
  onDelete: () => void;
};

const SortableTier = ({ tier, onEdit, onDelete }: SortableTierProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tier.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`w-48 p-4 flex flex-col gap-2 ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-center justify-between">
        <p className="font-medium truncate flex-1">{tier.name}</p>
        <button className="cursor-grab touch-none" {...attributes} {...listeners}>
          <GripHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      <p className="text-sm text-muted-foreground">{printTier(tier)}</p>
      <div className="flex gap-2 justify-end mt-2">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export const TierSettings = () => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadTiers = useCallback(async () => {
    try {
      const loadedTiers = await window.api["tier:getAll"]();
      setTiers(loadedTiers);
    } catch (error) {
      toast({
        title: "Error loading tiers",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    loadTiers();
  }, [loadTiers]);

  const addTier = async (data: TierFormData) => {
    await window.api["tier:create"]({ ...data, level: tiers.length });
    await loadTiers();
    toast({ title: "Tier added successfully" });
  };

  const updateTier = async (data: TierFormData) => {
    if (!editingTier) return;
    await window.api["tier:update"](editingTier.id, data);
    await loadTiers();
    setEditingTier(null);
    toast({ title: "Tier updated successfully" });
  };

  const deleteTier = async (id: number) => {
    try {
      await window.api["tier:delete"](id);
      await loadTiers();
      toast({ title: "Tier deleted successfully" });
    } catch (error) {
      toast({
        title: "Error deleting tier",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tiers.findIndex((t) => t.id === active.id);
    const newIndex = tiers.findIndex((t) => t.id === over.id);

    const reorderedTiers = arrayMove(tiers, oldIndex, newIndex);
    setTiers(reorderedTiers);

    try {
      // Update the level of the moved tier
      const movedTier = reorderedTiers[newIndex];
      await window.api["tier:update"](movedTier.id, { level: newIndex });
      await loadTiers(); // Reload to ensure consistency
    } catch (error) {
      toast({
        title: "Error updating tier order",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      await loadTiers(); // Reload to reset order on error
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tiers</h3>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Tier
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tiers.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {tiers.map((tier) => (
              <SortableTier
                key={tier.id}
                tier={tier}
                onEdit={() => setEditingTier(tier)}
                onDelete={() => deleteTier(tier.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <TierDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={addTier}
        title="Add Tier"
      />

      <TierDialog
        isOpen={!!editingTier}
        onClose={() => setEditingTier(null)}
        onSubmit={updateTier}
        initialData={editingTier ? { name: editingTier.name } : undefined}
        title="Edit Tier"
      />
    </div>
  );
};
