import { X } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type HashtagInputProps = {
  hashtags: string[];
  onChange: (hashtags: string[]) => void;
  placeholder?: string;
};

export const HashtagInput = ({
  hashtags,
  onChange,
  placeholder = "Add a hashtag",
}: HashtagInputProps) => {
  const [newHashtag, setNewHashtag] = useState("");

  const addHashtag = () => {
    if (!newHashtag.trim()) return;
    onChange([...hashtags, newHashtag.trim()]);
    setNewHashtag("");
  };

  const removeHashtag = (hashtagToRemove: string) => {
    onChange(hashtags.filter((h) => h !== hashtagToRemove));
  };

  const displayHashtag = (hashtag: string) => {
    return hashtag.startsWith("#") ? hashtag : `#${hashtag}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input
          placeholder={placeholder}
          value={newHashtag}
          onChange={(e) => setNewHashtag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHashtag()}
        />
        <Button onClick={addHashtag}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {hashtags.map((hashtag) => (
          <Badge key={hashtag} variant="secondary" className="pr-1.5">
            <span className="mr-1">{displayHashtag(hashtag)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeHashtag(hashtag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
