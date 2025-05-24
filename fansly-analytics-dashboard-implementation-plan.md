# Fansly Analytics Dashboard Implementation Plan

This document outlines the detailed implementation plan for creating a comprehensive analytics dashboard to help content creators optimize their content performance on Fansly.

## 1. KPI Overview Cards

### Frontend Implementation

- Create new component: `src/renderer/src/components/analytics/KpiOverviewCards.tsx`
- Implement cards for:
  - Engagement Score (with trend indicator)
  - Top Performers (highest view count and engagement)
  - Engagement-to-Views Correlation

### Backend/API Changes

- Add new API endpoint in `src/features/analytics/api.ts`:
  ```typescript
  getAnalyticsSummary: async (_) => {
    // Calculate summary metrics from existing data
    // Return engagement trends, top performer IDs, correlation stats
  };
  ```
- Update types in `src/features/analytics/api-type.ts`:
  ```typescript
  export type AnalyticsSummary = {
    overallEngagementScore: number;
    engagementTrend: number; // percentage change
    topPerformerIds: string[];
    engagementToViewsCorrelation: number;
  };
  ```
- Add to methods array:

  ```typescript
  export const methods = [
    // existing methods
    "getAnalyticsSummary",
  ] as const;
  ```

### Integration

- Modify `src/renderer/src/pages/Analytics/FanslyAnalyticsDashboard.tsx` to include the KPI overview section at the top

## 2. Key Visualizations

### Frontend Implementation

- Create visualization components:
  - `src/renderer/src/components/analytics/charts/EngagementViewsChart.tsx` (Scatter plot)
  - `src/renderer/src/components/analytics/charts/OptimalLengthChart.tsx` (Line/bar chart)
  - `src/renderer/src/components/analytics/charts/HashtagPerformanceHeatmap.tsx` (Heatmap)
  - `src/renderer/src/components/analytics/charts/TimePerformanceHeatmap.tsx` (Heatmap)
- Implement using Recharts or Chart.js library (add as dependency if not already present)

### Backend/API Changes

- Add new API endpoints in `src/features/analytics/api.ts`:

  ```typescript
  getHashtagAnalytics: async (_) => {
    // Aggregate performance metrics by hashtag
    // Return hashtag -> performance metrics mapping
  };

  getTimeAnalytics: async (_) => {
    // Analyze performance by posting time/day
    // Return time period -> performance metrics mapping
  };
  ```

- Update types in `src/features/analytics/api-type.ts`:

  ```typescript
  export type HashtagAnalytics = {
    hashtag: string;
    postCount: number;
    avgViews: number;
    avgEngagement: number;
  }[];

  export type TimeAnalytics = {
    timePeriod: string; // e.g., "Monday 12-2pm"
    postCount: number;
    avgViews: number;
    avgEngagement: number;
  }[];
  ```

- Add to methods array

### Integration

- Add charts section to `FanslyAnalyticsDashboard.tsx`
- Implement responsive layout with grid system for optimal viewing

## 3. Content Pattern Analysis

### Frontend Implementation

- Create content analysis component:
  - `src/renderer/src/components/analytics/content/ContentPatternAnalyzer.tsx`
- Implement natural language processing utilities in `src/renderer/src/lib/nlp.ts` for caption analysis

### Backend/API Changes

- Create new API endpoint in `src/features/analytics/api.ts`:

  ```typescript
  getContentPatterns: async (_) => {
    // Analyze captions for common themes and correlate with performance
  };
  ```

### Integration

- Add content analysis section to dashboard
- Implement toggle controls to switch between different analysis views

## 4. Actionable Insights Panel

### Insight Generation Methodology

The insights generation will follow these specific algorithmic approaches:

1. **Optimal Video Length Analysis**:

   - Group posts by video length ranges (0-6s, 6-8s, 8-10s, 10s+)
   - Calculate average engagement rate and views for each group
   - Identify the length range with highest engagement and views
   - Statistical significance test to validate findings (t-test)
   - Confidence score based on sample size and statistical significance

2. **Hashtag Performance Analysis**:

   - Extract all hashtags from post captions
   - Calculate per-hashtag metrics (frequency, avg views, avg engagement)
   - Compare against baseline (non-hashtag posts)
   - Apply correlation analysis between hashtag presence and performance
   - Rank hashtags by engagement impact score

3. **Content Theme Detection**:

   - Apply text analysis to captions using NLP
   - Cluster posts by key terms and themes
   - Calculate theme-specific performance metrics
   - Identify highest performing themes
   - Generate similarity matrix between themes and engagement

4. **Posting Time Optimization**:
   - Segment posts by day of week and time of day
   - Calculate time-specific performance metrics
   - Identify high-performance posting windows
   - Generate heat map of optimal posting times

### Frontend Implementation

- Create insights components:
  - `src/renderer/src/components/analytics/insights/InsightsPanel.tsx` (container)
  - `src/renderer/src/components/analytics/insights/OptimalVideoLengthInsight.tsx`
  - `src/renderer/src/components/analytics/insights/HashtagRecommendation.tsx`
  - `src/renderer/src/components/analytics/insights/ContentThemeRecommendation.tsx`
  - `src/renderer/src/components/analytics/insights/PostTimingRecommendation.tsx`
- Implement insight generation algorithms in `src/renderer/src/lib/insights.ts`:

  ```typescript
  // Core analysis functions
  export const analyzeVideoLengthPerformance = (posts: FanslyPostWithAnalytics[]) => {
    // Group by length ranges, calculate metrics, find optimal range
  };

  export const analyzeHashtagPerformance = (posts: FanslyPostWithAnalytics[]) => {
    // Extract hashtags, calculate per-tag metrics, rank by impact
  };

  export const analyzeContentThemes = (posts: FanslyPostWithAnalytics[]) => {
    // Apply NLP processing, identify themes, calculate performance
  };

  export const analyzePostingTimes = (posts: FanslyPostWithAnalytics[]) => {
    // Group by time slots, calculate performance metrics per slot
  };

  // Helper functions
  export const calculateConfidenceScore = (
    sampleSize: number,
    variance: number,
    effectSize: number
  ) => {
    // Calculate statistical confidence score (0-1)
  };

  export const generateActionableRecommendation = (
    insightType: string,
    data: any,
    threshold: number
  ) => {
    // Convert raw insight data into human-readable recommendation
  };
  ```

### Backend/API Changes

- Add new API endpoint in `src/features/analytics/api.ts`:

  ```typescript
  generateInsights: async (_) => {
    const dataSource = await db();
    const posts = await dataSource
      .getRepository(Post)
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.fanslyAnalyticsAggregate", "analytics")
      .getMany();

    // Apply insight generation algorithms
    const videoLengthInsight = generateVideoLengthInsight(posts);
    const hashtagInsights = generateHashtagInsights(posts);
    const contentThemeInsights = generateContentThemeInsights(posts);
    const postTimingInsights = generatePostTimingInsights(posts);

    return [
      videoLengthInsight,
      ...hashtagInsights,
      ...contentThemeInsights,
      ...postTimingInsights,
    ].sort((a, b) => b.confidence - a.confidence);
  };

  // Implementation of individual insight generators
  const generateVideoLengthInsight = (posts) => {
    // Group posts by length, find ideal range, calculate confidence
    // Return structured insight object
  };

  const generateHashtagInsights = (posts) => {
    // Analyze hashtag performance, identify top performers
    // Return array of insights for best hashtags
  };

  // Similar implementations for other insight types
  ```

- Update types in `src/features/analytics/api-type.ts`:

  ```typescript
  export type ActionableInsight = {
    type: "videoLength" | "hashtag" | "contentTheme" | "postTiming";
    confidence: number; // 0-1 scale based on statistical significance
    recommendation: string; // Human-readable recommendation
    supportingData: {
      // Common fields
      sampleSize: number;
      timeRange: string; // e.g., "Last 30 days"

      // Type-specific fields
      [key: string]: any; // Additional data to render the insight
    };
  };

  export type VideoLengthInsight = ActionableInsight & {
    supportingData: {
      optimalRange: [number, number]; // seconds
      performanceByRange: {
        range: string;
        avgViews: number;
        avgEngagement: number;
        sampleSize: number;
      }[];
    };
  };

  export type HashtagInsight = ActionableInsight & {
    supportingData: {
      hashtag: string;
      performanceBoost: number; // percentage
      usageCount: number;
      comparisonData: {
        withHashtag: { avgViews: number; avgEngagement: number };
        withoutHashtag: { avgViews: number; avgEngagement: number };
      };
    };
  };

  // Similar type definitions for other insight types
  ```

### Integration

- Add insights panel to dashboard with collapsible sections for each insight category
- Implement priority sorting for insights based on confidence score
- Add visual indicators for confidence level (color coding, icons)
- Implement "Apply Insight" buttons that prefill content creation forms with recommended parameters

## Main Dashboard Layout Implementation

- Create main dashboard component:
  ```
  src/renderer/src/pages/Analytics/FanslyAnalyticsDashboard.tsx
  ```
- Implement layout with tabs or sections for each feature area
- Update routing in `App.tsx` to include the new dashboard route
- Add navigation from the existing analytics grid to the new dashboard

## Dependencies

New dependencies to add to `package.json`:

- Recharts or Chart.js for data visualization
- Natural language processing library (e.g., compromise)

## Future Enhancements

- Export insights and recommendations to PDF
- Email/notification system for performance alerts
- A/B testing functionality
- Performance prediction capabilities
- Integration with content scheduling tools
- Competitor analytics comparison

Further KPIs
Here are several alternative KPIs we could implement with the data we currently have available:

1. View-to-Duration Ratio
   This KPI measures views per second of content, helping identify your most efficient content length. For short content, this ratio helps balance reach against production time.
   Implementation: Total views ÷ video duration in seconds
   Value: Shows which content length gets you the most viewer attention for time invested. Higher values indicate more efficient content.
2. Hashtag Performance Index
   Analysis of which hashtags correlate with higher view and engagement metrics.
   Implementation: We can analyze existing posts with hashtags (from post.caption) and calculate average views/engagement across posts using specific tags.
   Value: Directly informs which topics and categories perform best on Fansly, helping content planning.
3. Content Decay Rate
   How quickly your content stops receiving new views after posting.
   Implementation: Compare views at different time intervals after posting to identify the typical "shelf life" of your content.
   Value: Helps optimize posting frequency and timing. If content has a short decay rate, you know to post more frequently.
4. Time-to-Peak Analysis
   How long it takes for content to reach its peak view count.
   Implementation: Calculate the average time to reach 80% of total views across posts.
   Value: Helps predict content performance earlier and understand the platform's distribution patterns.
5. Engagement Density
   Average seconds of engagement divided by total seconds of content - a density metric showing how "packed" with engaging moments your content is.
   Implementation: Total engagement seconds ÷ total content seconds
   Value: Particularly useful for short-form content where every second counts. Helps identify if you're stretching content too long.
   Any of these would be valuable additions to your analytics dashboard and could be implemented with the data structures we currently have. Which one seems most valuable to your content strategy?
