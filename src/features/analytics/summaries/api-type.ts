import { Post } from "../../posts/entity";

export type AnalyticsSummaryParams = {
  startDate: string;
  endDate: string;
};

export type AnalyticsSummary = {
  engagementTrend: number; // percentage change
  averageEngagementPercent: number; // average percentage of videos watched
  totalViews: number; // total views in the timeframe
  viewsTrend: number; // percentage change in views
  topPerformerIds: string[];
  topPerformers: {
    id: string;
    caption: string;
    views: number;
    engagement: number;
    post: Post;
  }[];
  topPerformersByViews: {
    id: string;
    caption: string;
    views: number;
    post: Post;
  }[];
};

export type SummariesHandlers = {
  getAnalyticsSummary: (_: unknown, params?: AnalyticsSummaryParams) => Promise<AnalyticsSummary>;
};