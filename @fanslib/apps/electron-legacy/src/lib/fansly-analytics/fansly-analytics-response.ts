export type FanslyAnalyticsStats = {
  type: number; // 0 = FYP, 1 = Followers
  views: number;
  previewViews: number;
  interactionTime: number;
  previewInteractionTime: number;
  uniqueViewers: number;
  previewUniqueViewers: number;
};

export type FanslyAnalyticsDatapoint = {
  timestamp: number;
  stats: FanslyAnalyticsStats[];
};

export type FanslyTopFypTag = {
  tagId: string;
  views: number;
  previewViews: number;
  interactionTime: number;
  previewInteractionTime: number;
};

export type FanslyAnalyticsDataset = {
  period: number;
  dateBefore: number;
  dateAfter: number;
  datapointLimit: number;
  datapoints: FanslyAnalyticsDatapoint[];
  topFypTags: FanslyTopFypTag[];
  datasetMediaOfferId: string;
};

export type FanslyAnalyticsResponse = {
  success: boolean;
  response: {
    dataset: FanslyAnalyticsDataset;
    aggregationData: {
      accountMedia: Array<{
        id: string;
        likeCount: number;
        media: {
          id: string;
          type: number;
          width: number;
          height: number;
          duration?: number;
        };
      }>;
      tags: Array<{
        id: string;
        tag: string;
        viewCount: number;
      }>;
    };
  };
};
