import { format } from "date-fns";
import { Calendar, Clock, ExternalLink, Eye } from "lucide-react";
import { FanslyPostWithAnalytics } from "../../../../features/analytics/api-type";
import { formatNumber } from "../../../../lib/fansly-analytics";
import { cn } from "../../lib/utils";
import { MediaTile } from "../MediaTile/MediaTile";
import { Badge } from "../ui/Badge";
import { Status } from "../ui/Status";

export type AnalyticsPostTileProps = {
  post: FanslyPostWithAnalytics;
  className?: string;
};

export const AnalyticsPostTile = ({ post, className }: AnalyticsPostTileProps) => {
  const stripHashtags = (text: string) => {
    return text.replace(/#\w+/g, "").replace(/\s+/g, " ").trim();
  };

  const hasAnalytics =
    post.totalViews > 0 || post.averageEngagementSeconds > 0 || post.averageEngagementPercent > 0;

  return (
    <div className={cn("bg-card rounded-lg border p-4 space-y-4", className)}>
      <div className="flex gap-4">
        {/* Media Tile */}
        <div className="flex-shrink-0">
          {post.media ? (
            <MediaTile
              media={post.media}
              allMedias={[post.media]}
              index={0}
              className="w-32 h-32"
              withDuration={post.videoLength > 0}
              withTypeIcon={false}
              withSelection={false}
              withNavigation={false}
              withPreview={false}
              withPostsPopover={false}
              withFileName={false}
              cover={true}
            />
          ) : (
            <div className="w-32 h-32 bg-muted rounded-md flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No media</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Header with date and actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {format(new Date(post.date), "MMM d, yyyy")}
            </div>
            <div className="flex items-center gap-2">
              {post.postUrl ? (
                <a
                  href={post.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Post
                </a>
              ) : (
                <Status variant="error" size="sm">
                  No Post URL
                </Status>
              )}
              {post.statisticsUrl ? (
                <a
                  href={post.statisticsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Stats
                </a>
              ) : (
                <Status variant="error" size="lg">
                  No Stats URL
                </Status>
              )}
            </div>
          </div>

          {/* Caption */}
          <div className="text-sm leading-relaxed">
            <p className="line-clamp-3">{stripHashtags(post.caption)}</p>
          </div>

          {/* Hashtags */}
          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.hashtags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Analytics metrics */}
          {hasAnalytics ? (
            <div className="grid grid-cols-3 gap-4 pt-2 border-t">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-lg font-semibold">{formatNumber(post.totalViews)}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-lg font-semibold">
                    {post.averageEngagementSeconds.toFixed(1)}s
                  </p>
                  <p className="text-xs text-muted-foreground">Avg. Engagement</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {post.averageEngagementPercent.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Engagement %</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t">
              <Status variant="neutral" size="sm">
                No analytics data available
              </Status>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
