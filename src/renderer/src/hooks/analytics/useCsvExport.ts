import { format } from "date-fns";
import { useCallback } from "react";
import { FanslyPostWithAnalytics } from "../../../../features/analytics/post-analytics/api-type";

export const useCsvExport = () => {
  const exportToCsv = useCallback((posts: FanslyPostWithAnalytics[]) => {
    const headers = [
      "Date",
      "Caption",
      "Post URL",
      "Statistics URL",
      "Views",
      "Avg. Engagement (s)",
      "Engagement %",
      "Video Length (s)",
      "Hashtags",
    ];

    const csvData = posts.map((post) => [
      format(new Date(post.date), "yyyy-MM-dd"),
      post.caption,
      post.postUrl || "N/A",
      post.statisticsUrl || "N/A",
      post.totalViews,
      post.averageEngagementSeconds.toFixed(1),
      post.averageEngagementPercent.toFixed(1),
      post.videoLength,
      post.hashtags.join(", "),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fansly-analytics-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return { exportToCsv };
};
