import { PostFilters } from "@renderer/components/PostFilters";
import { useLibrary } from "@renderer/contexts/LibraryContext";
import { MediaSelectionProvider } from "@renderer/contexts/MediaSelectionContext";
import {
  PlanPreferencesProvider,
  usePlanPreferences,
} from "@renderer/contexts/PlanPreferencesContext";
import { useChannels } from "@renderer/hooks/api/useChannels";
import { useCallback, useEffect, useState } from "react";
import { Post } from "../../../../features/posts/entity";
import { Library } from "../../components/Library";
import { Shoots } from "../../components/Shoots/Shoots";
import { SplitViewLayout } from "../../components/SplitViewLayout";
import { TabNavigation, useTabNavigation } from "../../components/TabNavigation";
import { generateVirtualPosts, VirtualPost } from "../../lib/virtual-posts";
import { PlanEmptyState } from "./PlanEmptyState";
import { PlanViewSettings } from "./PlanViewSettings";
import { PostCalendar } from "./PostCalendar/PostCalendar";
import { PostTimeline } from "./PostTimeline";

const PlanPageContent = () => {
  const { data: channels = [] } = useChannels();
  const { preferences, updatePreferences } = usePlanPreferences();
  const [posts, setPosts] = useState<(Post | VirtualPost)[]>([]);

  const { refetch: refetchLibrary } = useLibrary();

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

  const fetchPosts = useCallback(async () => {
    try {
      // Posts are already enriched with channel and category data
      const [filteredPosts, allPosts, schedules] = await Promise.all([
        window.api["post:getAll"]({
          search: preferences.filter.search,
          channels: preferences.filter.channels,
          statuses: preferences.filter.statuses,
          dateRange: preferences.filter.dateRange,
        }),
        window.api["post:getAll"]({
          dateRange: preferences.filter.dateRange,
        }),
        window.api["content-schedule:getAll"](),
      ]);

      const shouldShowDraftPosts =
        !preferences.filter.statuses || preferences.filter.statuses.includes("draft");

      // Generate virtual posts from schedules
      const virtualPosts = shouldShowDraftPosts
        ? generateVirtualPosts(
            schedules.filter(
              (s) =>
                !preferences.filter.channels || preferences.filter.channels?.includes(s.channel.id)
            ),
            allPosts
          )
        : [];

      console.log({
        allPosts,
        dateRange: preferences.filter.dateRange,
      });
      // Combine and sort all posts by date
      const allPostsCombined = [...filteredPosts, ...virtualPosts].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setPosts(allPostsCombined);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, [preferences.filter]);

  const refetchPostsAndLibrary = useCallback(async () => {
    Promise.all([refetchLibrary(), fetchPosts()]);
  }, [refetchLibrary, fetchPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <SplitViewLayout
      id="plan"
      mainContent={
        <div className="h-full w-full overflow-hidden flex flex-col">
          <div className="flex gap-12 flex-col py-6 pl-6 pr-4 flex-none">
            <h1 className="text-2xl font-bold">Plan</h1>
            <div className="flex items-center justify-between gap-4">
              <PostFilters
                value={preferences.filter}
                onFilterChange={(filter) => {
                  updatePreferences({ filter });
                }}
              />
              <PlanViewSettings />
            </div>
          </div>
          <div className="flex-1 overflow-hidden px-6">
            {!channels.length && <PlanEmptyState />}
            {channels.length && preferences.view.viewType === "timeline" && (
              <PostTimeline posts={posts} onUpdate={refetchPostsAndLibrary} />
            )}
            {channels.length && preferences.view.viewType === "calendar" && (
              <PostCalendar posts={posts} onUpdate={refetchPostsAndLibrary} />
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
