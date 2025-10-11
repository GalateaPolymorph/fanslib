import { Button } from "@renderer/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/Dialog";
import { Input } from "@renderer/components/ui/Input";
import { ScrollArea } from "@renderer/components/ui/ScrollArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/Select";
import { Textarea } from "@renderer/components/ui/Textarea";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { useChannels } from "@renderer/hooks/api/useChannels";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, FileText, Globe, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { CaptionSnippet } from "src/features/snippets/entity";

type SnippetFormData = {
  name: string;
  content: string;
  channelId?: string;
};

const SnippetForm = ({
  initialData,
  onSubmit,
  onCancel,
  channels,
}: {
  initialData?: CaptionSnippet;
  onSubmit: (data: SnippetFormData) => Promise<void>;
  onCancel: () => void;
  channels: any[];
}) => {
  const [formData, setFormData] = useState<SnippetFormData>({
    name: initialData?.name || "",
    content: initialData?.content || "",
    channelId: initialData?.channelId || undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onCancel();
    } catch (error) {
      console.error("Error saving snippet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Snippet name..."
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Channel (optional)</label>
        <Select
          value={formData.channelId || "global"}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              channelId: value === "global" ? undefined : value,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Global (All Channels)</SelectItem>
            {channels.map((channel) => (
              <SelectItem key={channel.id} value={channel.id}>
                {channel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Content</label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
          placeholder="Snippet content..."
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.name.trim() || !formData.content.trim()}
        >
          {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export const SnippetSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: channels = [] } = useChannels();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<CaptionSnippet | null>(null);

  const { data: snippets = [] } = useQuery({
    queryKey: ["snippets", "all"],
    queryFn: () => window.api["snippet:getAllSnippets"](),
  });

  const createMutation = useMutation({
    mutationFn: (data: SnippetFormData) => window.api["snippet:createSnippet"](data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
      toast({
        title: "Snippet created",
        description: "Your snippet has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating snippet",
        description: error.message || "Failed to create snippet",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SnippetFormData }) =>
      window.api["snippet:updateSnippet"](id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
      toast({
        title: "Snippet updated",
        description: "Your snippet has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating snippet",
        description: error.message || "Failed to update snippet",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => window.api["snippet:deleteSnippet"](id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
      toast({
        title: "Snippet deleted",
        description: "Your snippet has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting snippet",
        description: error.message || "Failed to delete snippet",
        variant: "destructive",
      });
    },
  });

  const globalSnippets = snippets.filter((s) => !s.channelId);
  const channelSnippets = snippets.filter((s) => s.channelId);
  const groupedChannelSnippets = channelSnippets.reduce(
    (acc, snippet) => {
      if (!snippet.channelId) return acc;
      if (!acc[snippet.channelId]) {
        acc[snippet.channelId] = [];
      }
      acc[snippet.channelId].push(snippet);
      return acc;
    },
    {} as Record<string, CaptionSnippet[]>
  );

  const handleDeleteSnippet = async (snippet: CaptionSnippet) => {
    if (confirm(`Are you sure you want to delete "${snippet.name}"?`)) {
      deleteMutation.mutate(snippet.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <FileText /> Caption Snippets
        </h1>
        <p className="text-muted-foreground">
          Create and manage reusable caption snippets for faster post creation
        </p>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Your Snippets</h3>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Snippet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Snippet</DialogTitle>
              </DialogHeader>
              <SnippetForm
                channels={channels}
                onSubmit={async (data) => {
                  await createMutation.mutateAsync(data);
                }}
                onCancel={() => setShowCreateDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-[500px] border rounded-lg p-4">
          <div className="space-y-6">
            {/* Global Snippets */}
            {globalSnippets.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-4 w-4" />
                  <h4 className="font-medium">Global Snippets</h4>
                </div>
                <div className="space-y-2">
                  {globalSnippets.map((snippet) => (
                    <div
                      key={snippet.id}
                      className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm">{snippet.name}</h5>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {snippet.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Used {snippet.usageCount} times
                          </p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingSnippet(snippet)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteSnippet(snippet)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Channel-Specific Snippets */}
            {Object.entries(groupedChannelSnippets).map(([channelId, channelSnippets]) => {
              const channel = channels.find((c) => c.id === channelId);
              return (
                <div key={channelId}>
                  <h4 className="font-medium mb-3">
                    {channel?.name || "Unknown Channel"} Snippets
                  </h4>
                  <div className="space-y-2">
                    {channelSnippets.map((snippet) => (
                      <div
                        key={snippet.id}
                        className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm">{snippet.name}</h5>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {snippet.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Used {snippet.usageCount} times
                            </p>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditingSnippet(snippet)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteSnippet(snippet)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {snippets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No snippets created yet.</p>
                <p className="text-sm">Create your first snippet to get started!</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Edit Dialog */}
        <Dialog open={!!editingSnippet} onOpenChange={() => setEditingSnippet(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Snippet</DialogTitle>
            </DialogHeader>
            {editingSnippet && (
              <SnippetForm
                initialData={editingSnippet}
                channels={channels}
                onSubmit={async (data) => {
                  await updateMutation.mutateAsync({ id: editingSnippet.id, data });
                }}
                onCancel={() => setEditingSnippet(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
