import { addMonths, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { Post } from "../../../../features/posts/entity";
import { Library } from "../../components/Library";
import { Shoots } from "../../components/Shoots/Shoots";
import { SplitViewLayout } from "../../components/SplitViewLayout";
import { generateVirtualPosts, VirtualPost } from "../../lib/virtual-posts";
import { PostTimeline } from "./PostTimeline";

type SideContentView = "shoots" | "library";

export const PlanPage = () => {
  const [posts, setPosts] = useState<(Post | VirtualPost)[]>([]);
  const [sideContentView, setSideContentView] = useState<SideContentView>("shoots");

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

  const mainContent = (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between py-6 pl-6 pr-4 flex-none">
        <h1 className="text-2xl font-bold">Plan</h1>
      </div>
      <div className="flex-1 overflow-hidden px-6">
        <PostTimeline posts={posts} onUpdate={fetchPosts} />
      </div>
    </div>
  );

  const sideContentHeader = (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setSideContentView("shoots")}
        className={`text-2xl font-bold ${
          sideContentView === "shoots"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground/80"
        }`}
      >
        Shoots
      </button>
      <button
        onClick={() => setSideContentView("library")}
        className={`text-2xl font-bold ${
          sideContentView === "library"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground/80"
        }`}
      >
        Library
      </button>
    </div>
  );

  const sideContent = sideContentView === "shoots" ? <Shoots /> : <Library showHeader={false} />;

  return (
    <SplitViewLayout
      mainContent={mainContent}
      sideContent={sideContent}
      sideContentHeader={sideContentHeader}
    />
  );
};
