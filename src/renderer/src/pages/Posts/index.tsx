import { addMonths, isSameDay, startOfMonth } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Post } from "../../../../lib/database/posts/type";
import { Calendar } from "../../components/Calendar";
import { DayDetail } from "../../components/DayDetail";
import { Button } from "../../components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { useToast } from "../../components/ui/use-toast";

export const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      // Fetch posts for the next 3 months
      const startDate = startOfMonth(new Date());
      const endDate = addMonths(startDate, 3);

      // Posts are already enriched with channel and category data
      const allPosts = await window.api.posts.getScheduledPosts();

      // Filter posts within the date range
      const filteredPosts = allPosts.filter((post) => {
        const postDate = new Date(post.scheduledDate);
        return postDate >= startDate && postDate <= endDate;
      });

      setPosts(filteredPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSync = async () => {
    try {
      setSyncing(true);
      await window.api.contentSchedule.syncAllSchedules();
      await fetchPosts();
      toast({
        title: "Success",
        description: "All schedules have been synchronized",
      });
    } catch (error) {
      console.error("Error syncing schedules:", error);
      toast({
        title: "Error",
        description: "Failed to sync schedules",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const selectedDayPosts = selectedDate
    ? posts.filter((post) => isSameDay(new Date(post.scheduledDate), selectedDate))
    : [];

  return (
    <div className="h-full w-full overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={75} minSize={30} className="flex flex-col h-full">
          <div className="flex items-center justify-between py-6 pl-6 pr-4 flex-none">
            <h1 className="text-2xl font-bold">Posts</h1>
            <Button variant="outline" onClick={handleSync} disabled={syncing}>
              {syncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sync Schedules
            </Button>
          </div>
          <div className="flex-1 overflow-auto px-6">
            <Calendar
              posts={posts}
              loading={loading}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        </ResizablePanel>

        {selectedDate && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={20} className="flex flex-col h-full">
              <DayDetail
                date={selectedDate}
                posts={selectedDayPosts}
                onClose={() => setSelectedDate(null)}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};
