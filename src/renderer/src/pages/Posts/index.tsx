import { addMonths, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { Post } from "../../../../features/posts/entity";
import { SplitViewLayout } from "../../components/SplitViewLayout";
import { Shoots } from "../Content/Shoots/Shoots";
import { PostTimeline } from "./PostTimeline";

export const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      // Fetch posts for the next 3 months
      const startDate = startOfMonth(new Date());
      const endDate = addMonths(startDate, 3);

      // Posts are already enriched with channel and category data
      const allPosts = await window.api["post:getAll"]();

      // Filter posts within the date range
      const filteredPosts = allPosts.filter((post) => {
        const postDate = new Date(post.date);
        return postDate >= startDate && postDate <= endDate;
      });

      setPosts(filteredPosts);
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
        <h1 className="text-2xl font-bold">Posts</h1>
      </div>
      <div className="flex-1 overflow-hidden px-6">
        <PostTimeline posts={posts} onUpdate={fetchPosts} />
      </div>
    </div>
  );

  return (
    <SplitViewLayout
      mainContent={mainContent}
      sideContent={<Shoots />}
      sideContentHeader={<h1 className="text-2xl font-bold">Shoots</h1>}
      mainDefaultSize={50}
      sideDefaultSize={50}
      sideMaxSize={50}
    />
  );
};
