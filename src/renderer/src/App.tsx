import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { NotificationListener } from "./components/NotificationListener";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/Toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AnalyticsProvider } from "./contexts/AnalyticsContext";
import { LibraryProvider } from "./contexts/LibraryContext";
import { LibraryPreferencesProvider } from "./contexts/LibraryPreferencesContext";
import { MediaDragProvider } from "./contexts/MediaDragContext";
import { PostDragProvider } from "./contexts/PostDragContext";
import { RedditPostProvider } from "./contexts/RedditPostContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ShootProvider } from "./contexts/ShootContext";
import { Layout } from "./Layout";
import { Analytics } from "./pages/Analytics";
import { ChannelsPage } from "./pages/Channels";
import { ManagePage } from "./pages/Manage";
import { MediaDetail } from "./pages/MediaDetail";
import { PlanPage } from "./pages/Plan";
import { PostDetailPage } from "./pages/PostDetail";
import { SettingsPage } from "./pages/Settings";
import { SubredditsPage } from "./pages/Subreddits";
import { TaggingPage } from "./pages/Tagging";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ManagePage />,
      },
      {
        path: "/content/:mediaId",
        element: <MediaDetail />,
      },
      {
        path: "/posts",
        element: <PlanPage />,
      },
      {
        path: "/posts/:postId",
        element: <PostDetailPage />,
      },
      {
        path: "/channels",
        element: <ChannelsPage />,
      },
      {
        path: "/subreddits",
        element: <SubredditsPage />,
      },
      {
        path: "/tagging",
        element: <TaggingPage />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => {
  return (
    <AnalyticsProvider>
      <ThemeProvider>
        <SettingsProvider>
          <QueryClientProvider client={queryClient}>
            <ShootProvider>
              <LibraryPreferencesProvider>
                <LibraryProvider>
                  <MediaDragProvider>
                    <PostDragProvider>
                      <RedditPostProvider>
                        <TooltipProvider delayDuration={0}>
                          <RouterProvider router={router} />
                          <ReactQueryDevtools initialIsOpen={false} />
                          <NotificationListener />
                          <Toaster />
                        </TooltipProvider>
                      </RedditPostProvider>
                    </PostDragProvider>
                  </MediaDragProvider>
                </LibraryProvider>
              </LibraryPreferencesProvider>
            </ShootProvider>
          </QueryClientProvider>
        </SettingsProvider>
      </ThemeProvider>
    </AnalyticsProvider>
  );
};

export default App;
