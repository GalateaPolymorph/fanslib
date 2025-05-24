import { Progress } from "../ui/progress";

export type BulkFetchProgress = {
  current: number;
  total: number;
  currentPost?: {
    id: string;
    caption: string;
  };
};

export type BulkFetchResult = {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
  errors: Array<{
    postId: string;
    caption: string;
    error: string;
  }>;
};

type BulkFetchProgressProps = {
  fetchProgress: BulkFetchProgress | null;
  fetchResult: BulkFetchResult | null;
};

export const BulkAnalyticsFetchProgress = ({
  fetchProgress,
  fetchResult,
}: BulkFetchProgressProps) => {
  if (!fetchProgress && !fetchResult) return null;

  return (
    <>
      {fetchProgress && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <div>
              <span>Fetching analytics data...</span>
              {fetchProgress.currentPost && (
                <div className="text-xs mt-1 truncate max-w-md">
                  Processing: {fetchProgress.currentPost.caption}
                </div>
              )}
            </div>
            <span>{Math.round((fetchProgress.current / fetchProgress.total) * 100)}%</span>
          </div>
          <Progress value={(fetchProgress.current / fetchProgress.total) * 100} />
          <div className="text-xs text-muted-foreground mt-1">
            {fetchProgress.current} of {fetchProgress.total} posts
          </div>
        </div>
      )}

      {fetchResult && (
        <div className="mb-4 space-y-2">
          <div className="text-sm text-muted-foreground">
            Bulk fetch complete: {fetchResult.successful} successful, {fetchResult.failed} failed
            {fetchResult.skipped > 0 &&
              `, ${fetchResult.skipped} skipped (already had complete data)`}
            {fetchResult.total > 0 && ` out of ${fetchResult.total} posts processed`}
          </div>
          {fetchResult.errors.length > 0 && (
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                Show errors ({fetchResult.errors.length})
              </summary>
              <div className="mt-2 space-y-1 bg-muted/50 p-2 rounded text-destructive max-h-32 overflow-y-auto">
                {fetchResult.errors.map((error, index) => (
                  <div key={index}>
                    <span className="font-medium">{error.caption}</span>: {error.error}
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </>
  );
};
