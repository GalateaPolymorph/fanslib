import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { cn } from "@renderer/lib/utils";
import { Check, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { HashtagInput } from "../../components/HashtagInput";
import { useSettings } from "../../contexts/SettingsContext";
import { useTags } from "../../contexts/TagContext";

type EditingTag = {
  id: number;
  name: string;
  hashtags: string[];
};

export const TagSettings = () => {
  const [tagName, setTagName] = useState("");
  const [editingTag, setEditingTag] = useState<EditingTag | null>(null);
  const { tags, refresh } = useTags();
  const { settings, saveSettings } = useSettings();

  const handleCreateTag = async () => {
    if (!tagName.trim()) return;

    try {
      await window.api["tag:create"]({ name: tagName });
      refresh();
      setTagName("");
    } catch (error) {
      console.error("Failed to create tag", error);
    }
  };

  const handleUpdateName = async () => {
    if (!editingTag) return;

    try {
      await window.api["tag:update"](editingTag.id, {
        name: editingTag.name,
        hashtags: editingTag.hashtags,
      });
      refresh();
      setEditingTag(null);
    } catch (error) {
      console.error("Failed to update tag", error);
    }
  };

  const deleteTag = async (id: number) => {
    try {
      await window.api["tag:delete"](id);
      refresh();
    } catch (error) {
      console.error("Failed to delete tag", error);
    }
  };

  const updateDefaultHashtags = (hashtags: string[]) => {
    saveSettings({ defaultHashtags: hashtags });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <header>
          <h3 className="text-lg font-medium">Default Hashtags</h3>
          <p className="text-sm text-muted-foreground">
            These hashtags will be automatically added to all media.
          </p>
        </header>
        <HashtagInput
          hashtags={settings?.defaultHashtags ?? []}
          onChange={updateDefaultHashtags}
          placeholder="Add a default hashtag"
        />
      </div>

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

        <div className="grid">
          {tags.map((tag, i) => (
            <div
              key={tag.id}
              className={cn(
                "grid grid-cols-[1fr_1fr_auto_auto] items-center gap-4 py-2 px-2 rounded-lg",
                editingTag?.id === tag.id && "items-start",
                i % 2 === 0 && "bg-muted/50"
              )}
            >
              <div className="flex items-center flex-1">
                {editingTag?.id === tag.id ? (
                  <div className="flex items-center flex-1">
                    <Input
                      value={editingTag.name}
                      onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                      className="h-8"
                    />
                  </div>
                ) : (
                  <>
                    <Badge shape="tag" size="lg">
                      {tag.name}
                    </Badge>
                  </>
                )}
              </div>

              <div className="flex-1">
                {editingTag?.id === tag.id ? (
                  <HashtagInput
                    hashtags={editingTag.hashtags}
                    onChange={(hashtags) => setEditingTag({ ...editingTag, hashtags })}
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tag.hashtags.map((hashtag) => (
                      <Badge key={hashtag} variant="secondary">
                        {hashtag.startsWith("#") ? hashtag : `#${hashtag}`}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {editingTag?.id !== tag.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      setEditingTag({
                        id: tag.id,
                        name: tag.name,
                        hashtags: tag.hashtags,
                      })
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {editingTag?.id === tag.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleUpdateName}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => deleteTag(tag.id)}>
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
