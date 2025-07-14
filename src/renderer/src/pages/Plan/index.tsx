import { PostFilters } from "@renderer/components/PostFilters";
import { PageContainer } from "@renderer/components/ui/PageContainer/PageContainer";
import { PageHeader } from "@renderer/components/ui/PageHeader/PageHeader";
import { SectionHeader } from "@renderer/components/ui/SectionHeader/SectionHeader";
import { useLibrary } from "@renderer/contexts/LibraryContext";
import { MediaSelectionProvider } from "@renderer/contexts/MediaSelectionContext";
import {
  PlanPreferencesProvider,
  usePlanPreferences,
} from "@renderer/contexts/PlanPreferencesContext";
import { useScrollPosition } from "@renderer/hooks";
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
  const [isPostsLoaded, setIsPostsLoaded] = useState(false);

  const { refetch: refetchLibrary } = useLibrary();

  // Persist scroll position only for calendar view and after posts are loaded
  const shouldRestoreScroll = preferences.view.viewType === "calendar" && isPostsLoaded;
  const scrollRef = useScrollPosition<HTMLDivElement>(shouldRestoreScroll);

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
    setIsPostsLoaded(false);
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

      // Combine and sort all posts by date
      const allPostsCombined = [...filteredPosts, ...virtualPosts].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setPosts(allPostsCombined);
      setIsPostsLoaded(true);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setIsPostsLoaded(true);
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
        <PageContainer padding="none" className="h-full w-full overflow-hidden flex flex-col">
          <PageHeader
            title="Plan"
            description="Schedule and organize your content publication timeline"
            className="py-6 pl-6 pr-4 flex-none"
          />
          <div className="px-6 pb-4">
            <SectionHeader title="" spacing="default" actions={<PlanViewSettings />} />
            <div className="mt-2">
              <PostFilters
                value={preferences.filter}
                onFilterChange={(filter) => {
                  updatePreferences({ filter });
                }}
              />
            </div>
          </div>
          <div className="flex-1 overflow-hidden px-6">
            {!channels.length && <PlanEmptyState />}
            {channels.length && preferences.view.viewType === "timeline" && (
              <PostTimeline posts={posts} onUpdate={refetchPostsAndLibrary} />
            )}
            {channels.length && preferences.view.viewType === "calendar" && (
              <PostCalendar posts={posts} onUpdate={refetchPostsAndLibrary} scrollRef={scrollRef} />
            )}
          </div>
        </PageContainer>
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
