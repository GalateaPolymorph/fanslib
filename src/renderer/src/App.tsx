import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createBrowserRouter, createHashRouter } from "react-router-dom";
import { NotificationListener } from "./components/NotificationListener";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/Toaster";
import { TooltipProvider } from "./components/ui/Tooltip";
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
import { AppearanceSettings } from "./pages/Settings/AppearanceSettings";
import { ContentSafetySettings } from "./pages/Settings/ContentSafetySettings";
import { FilterPresetSettings } from "./pages/Settings/FilterPresetSettings";
import { GeneralSettings } from "./pages/Settings/GeneralSettings";
import { IntegrationsSettings } from "./pages/Settings/IntegrationsSettings";
import { SettingsLayout } from "./pages/Settings/SettingsLayout";
import { SnippetSettings } from "./pages/Settings/SnippetSettings";
import { SubredditsPage } from "./pages/Subreddits";
import { TaggingPage } from "./pages/Tagging";

const routes = [
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
        element: <SettingsLayout />,
        children: [
          {
            index: true,
            element: <GeneralSettings />,
          },
          {
            path: "general",
            element: <GeneralSettings />,
          },
          {
            path: "appearance",
            element: <AppearanceSettings />,
          },
          {
            path: "content-safety",
            element: <ContentSafetySettings />,
          },
          {
            path: "integrations",
            element: <IntegrationsSettings />,
          },
          {
            path: "filter-presets",
            element: <FilterPresetSettings />,
          },
          {
            path: "snippets",
            element: <SnippetSettings />,
          },
        ],
      },
    ],
  },
];

// Use hash router for production (file:// URLs) and browser router for development
const router =
  process.env.NODE_ENV === "production" ? createHashRouter(routes) : createBrowserRouter(routes);

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
