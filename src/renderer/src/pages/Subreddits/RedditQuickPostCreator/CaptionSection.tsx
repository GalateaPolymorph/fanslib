import { Textarea } from "@renderer/components/ui/Textarea";
import { useRedditQuickPostContext } from "./RedditQuickPostContext";

export const CaptionSection = () => {
  const { postState, updateCaption } = useRedditQuickPostContext();

  const { caption, media, isLoading } = postState;

  if (!media) {
    return (
      <div className="p-6 rounded-lg border">
        <p className="text-lg text-gray-400">Waiting for media selection</p>
      </div>
    );
  }

  if (!caption && isLoading) {
    return (
      <div className="p-6 rounded-lg border">
        <p className="text-lg text-gray-600">Generating caption...</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Textarea
            value={caption}
            onChange={(e) => updateCaption(e.target.value)}
            placeholder="Enter your caption..."
            className="text-lg leading-relaxed font-medium min-h-[100px] resize-none"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};
