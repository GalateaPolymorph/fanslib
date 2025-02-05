import { useChannels } from "@renderer/contexts/ChannelContext";
import { MediaSelectionProvider } from "@renderer/contexts/MediaSelectionContext";
import { addMonths, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { Post } from "../../../../features/posts/entity";
import { Library } from "../../components/Library";
import { Shoots } from "../../components/Shoots/Shoots";
import { SplitViewLayout } from "../../components/SplitViewLayout";
import { TabNavigation, useTabNavigation } from "../../components/TabNavigation";
import { PlanPreferencesProvider, usePlanPreferences } from "../../contexts/PlanPreferencesContext";
import { generateVirtualPosts, VirtualPost } from "../../lib/virtual-posts";
import { PlanEmptyState } from "./PlanEmptyState";
import { PlanViewSettings } from "./PlanViewSettings";
import { PostCalendar } from "./PostCalendar/PostCalendar";
import { PostTimeline } from "./PostTimeline";

const PlanPageContent = () => {
  const { channels } = useChannels();
  const { preferences } = usePlanPreferences();
  const [posts, setPosts] = useState<(Post | VirtualPost)[]>([]);

  const tabs = [
    {
      id: "shoots" as const,
      label: "Shoots",
      content: <Shoots />,
    },
    {
      id: "library" as const,
      label: "Library",
      content: <Library showHeader={false} />,
    },
  ];

  const { activeTabId, activeTab, updateActiveTab } = useTabNavigation({
    tabs,
    storageKey: "plan-side-content-view",
    defaultTabId: "shoots",
  });

  const fetchPosts = async () => {
    try {
      // Fetch posts for the next 3 months
      const startDate = startOfMonth(new Date());
      const endDate = addMonths(startDate, 3);

      // Posts are already enriched with channel and category data
      const [allPosts, schedules] = await Promise.all([
        window.api["post:getAll"](),
        window.api["content-schedule:getAll"](),
      ]);

      // Filter posts within the date range
      const filteredPosts = allPosts.filter((post) => {
        const postDate = new Date(post.date);
        return postDate >= startDate && postDate <= endDate;
      });

      // Generate virtual posts from schedules
      const virtualPosts = generateVirtualPosts(schedules, filteredPosts);

      // Combine and sort all posts by date
      const allPostsCombined = [...filteredPosts, ...virtualPosts].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setPosts(allPostsCombined);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <SplitViewLayout
      id="plan"
      mainContent={
        <div className="h-full w-full overflow-hidden flex flex-col">
          <div className="flex items-center justify-between py-6 pl-6 pr-4 flex-none">
            <h1 className="text-2xl font-bold">Plan</h1>
            <PlanViewSettings />
          </div>
          <div className="flex-1 overflow-hidden px-6">
            {!channels.length && <PlanEmptyState />}
            {channels.length && preferences.view.viewType === "timeline" && (
              <PostTimeline posts={posts} onUpdate={fetchPosts} />
            )}
            {channels.length && preferences.view.viewType === "calendar" && (
              <PostCalendar posts={posts} onUpdate={fetchPosts} />
            )}
          </div>
        </div>
      }
      sideContent={activeTab?.content}
      sideContentHeader={
        <TabNavigation tabs={tabs} activeTabId={activeTabId} onTabChange={updateActiveTab} />
      }
    />
  );
};

export const PlanPage = () => (
  <PlanPreferencesProvider>
    <MediaSelectionProvider media={[]}>
      <PlanPageContent />
    </MediaSelectionProvider>
  </PlanPreferencesProvider>
);
