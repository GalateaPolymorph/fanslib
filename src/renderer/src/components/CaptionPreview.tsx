import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip";
import { formatViewCount } from "@renderer/lib/format-views";
import { findHashtags } from "@renderer/lib/hashtags";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Channel } from "src/features/channels/entity";

type CaptionPreviewProps = {
  caption: string;
  channel: Channel;
};

type HashtagStyle = {
  color: string;
  fontWeight: number;
};

const colors = {
  1: "hsl(var(--destructive))",
  2: "hsl(45, 100%, 50%)",
  3: "hsl(142, 76%, 36%)",
  4: "hsl(var(--primary))",
  5: "hsl(320, 100%, 50%)",
};

const getHashtagStyle = (viewCount: number, maxViews: number): HashtagStyle => {
  if (maxViews === 0) return { color: "hsl(var(--muted-foreground))", fontWeight: 300 };

  const percentage = (viewCount / maxViews) * 100;

  if (percentage < 20) {
    return { color: colors[1], fontWeight: 300 }; // Red, light
  } else if (percentage < 40) {
    return { color: colors[2], fontWeight: 300 }; // Yellow, light
  } else if (percentage < 60) {
    return { color: colors[3], fontWeight: 300 }; // Green, light
  } else if (percentage < 80) {
    return { color: colors[4], fontWeight: 700 }; // Blue, bold
  } else {
    return { color: colors[5], fontWeight: 700 }; // Pink, bold
  }
};

const ColorLegend = () => (
  <div className="space-y-2 text-sm">
    <p className="font-medium mb-3">Hashtag colors indicate view count ranges</p>
    <div className="grid gap-1.5">
      <div className="flex items-center gap-2">
        <span
          className="rounded-full size-2 overflow-hidden"
          style={{ backgroundColor: colors[1] }}
        />
        <span>0-20% of max views</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="rounded-full size-2 overflow-hidden"
          style={{ backgroundColor: colors[2] }}
        />
        <span>20-40% of max views</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="rounded-full size-2 overflow-hidden"
          style={{ backgroundColor: colors[3] }}
        />
        <span>40-60% of max views</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="rounded-full size-2 overflow-hidden"
          style={{ backgroundColor: colors[4] }}
        />
        <span>60-80% of max views</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="rounded-full size-2 overflow-hidden"
          style={{ backgroundColor: colors[5] }}
        />
        <span>80-100% of max views</span>
      </div>
    </div>
    <p className="text-xs text-muted-foreground mt-2">
      Percentages are relative to the highest view count among all hashtags for this channel.
    </p>
  </div>
);

export const CaptionPreview = ({ caption, channel }: CaptionPreviewProps) => {
  const [hashtagStats, setHashtagStats] = useState<Record<string, number>>({});
  const [maxChannelViews, setMaxChannelViews] = useState<number>(0);

  useEffect(() => {
    const loadAllHashtagStats = async () => {
      try {
        const hashtagData = await window.api["hashtag:list"]();
        const stats: Record<string, number> = {};
        let maxViews = 0;

        // First pass: collect all stats and find max views
        hashtagData.forEach((hashtag) => {
          const channelStats = hashtag.channelStats.find((s) => s.channelId === channel.id);
          const views = channelStats?.views || 0;
          stats[hashtag.name] = views;
          maxViews = Math.max(maxViews, views);
        });

        setHashtagStats(stats);
        setMaxChannelViews(maxViews);
      } catch (err) {
        console.error("Failed to load hashtag stats:", err);
      }
    };

    loadAllHashtagStats();
  }, [channel.id, caption]);

  if (!caption) return null;

  const hashtags = findHashtags(caption);

  return (
    <div className="p-4 rounded-md border bg-muted relative pr-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground transition-colors absolute right-2 top-2">
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="w-64">
            <ColorLegend />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {hashtags.length > 0 ? (
        <div className="whitespace-pre-wrap">
          {hashtags.reduce<JSX.Element[]>(
            (elements, { hashtag, start, end }, index, array) => [
              ...elements,
              // Add text before hashtag if there is any
              ...(start > (index === 0 ? 0 : array[index - 1].end)
                ? [
                    <span key={`text-${index}`}>
                      {caption.slice(index === 0 ? 0 : array[index - 1].end, start)}
                    </span>,
                  ]
                : []),
              // Add hashtag with tooltip
              <TooltipProvider key={`hashtag-${index}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      style={{
                        ...getHashtagStyle(hashtagStats[hashtag] || 0, maxChannelViews),
                        cursor: "help",
                      }}
                    >
                      {hashtag}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{formatViewCount(hashtagStats[hashtag] || 0)} views</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>,
              // Add remaining text after the last hashtag
              ...(index === array.length - 1 && end < caption.length
                ? [<span key="text-end">{caption.slice(end)}</span>]
                : []),
            ],
            []
          )}
        </div>
      ) : (
        caption
      )}
    </div>
  );
};
