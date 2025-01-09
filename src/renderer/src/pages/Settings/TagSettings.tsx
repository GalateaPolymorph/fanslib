import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useTags } from "../../contexts/TagContext";

type EditingTag = {
  id: number;
  name: string;
  hashtags: string[];
};

export const TagSettings = () => {
  const { tags, refresh } = useTags();
  const [tagName, setTagName] = useState("");
  const [editingTag, setEditingTag] = useState<EditingTag | null>(null);
  const [newHashtag, setNewHashtag] = useState("");

  const handleCreateTag = async () => {
    if (!tagName) return;

    try {
      await window.api["tag:create"]({ name: tagName });
      await refresh();
      setTagName("");
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  };

  const handleUpdateName = async () => {
    if (!editingTag) return;

    try {
      await window.api["tag:update"](editingTag.id, {
        name: editingTag.name,
        hashtags: editingTag.hashtags,
      });
      await refresh();
      setEditingTag(null);
    } catch (error) {
      console.error("Failed to update tag:", error);
    }
  };

  const deleteTag = async (id: number) => {
    try {
      await window.api["tag:delete"](id);
      await refresh();
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  const addHashtag = (tag: EditingTag) => {
    if (!newHashtag.trim()) return;
    setEditingTag({
      ...tag,
      hashtags: [...tag.hashtags, newHashtag.trim()],
    });
    setNewHashtag("");
  };

  const removeHashtag = (tag: EditingTag, hashtagToRemove: string) => {
    setEditingTag({
      ...tag,
      hashtags: tag.hashtags.filter((h) => h !== hashtagToRemove),
    });
  };

  const displayHashtag = (hashtag: string) => {
    return hashtag.startsWith("#") ? hashtag : `#${hashtag}`;
  };

  return (
    <div className="space-y-4">
      <header>
        <h3 className="text-lg font-medium">Tags</h3>
      </header>

      <div className="flex space-x-2">
        <Input
          placeholder="Add a tag"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
        />
        <Button onClick={handleCreateTag}>Create</Button>
      </div>

      <div className="grid gap-2">
        {tags.map((tag) => (
          <div key={tag.id} className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-4 py-2 ">
            {editingTag?.id === tag.id ? (
              <>
                <Input
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                  className="h-8"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleUpdateName();
                    }
                  }}
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={newHashtag}
                      onChange={(e) => setNewHashtag(e.target.value.replace("#", ""))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addHashtag(editingTag);
                        }
                      }}
                      className="h-8"
                      placeholder="Add hashtag (# will be added automatically)"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => addHashtag(editingTag)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  {editingTag.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {editingTag.hashtags.map((hashtag) => (
                        <Badge
                          key={hashtag}
                          variant="secondary"
                          className="flex items-center gap-1 h-6"
                        >
                          {displayHashtag(hashtag)}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeHashtag(editingTag, hashtag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => void handleUpdateName()}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="inline-flex items border justify-self-start px-3 rounded-full">
                  {tag.name}
                </div>
                <div className="flex flex-wrap gap-1">
                  {tag.hashtags && tag.hashtags.length > 0 ? (
                    tag.hashtags.map((hashtag) => (
                      <Badge key={hashtag} variant="secondary" className="text-xs font-normal">
                        {displayHashtag(hashtag)}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No hashtags</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setEditingTag({
                      id: tag.id,
                      name: tag.name,
                      hashtags: tag.hashtags || [],
                    })
                  }
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-destructive"
              onClick={() => deleteTag(tag.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
