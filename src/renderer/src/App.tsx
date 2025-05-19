import { HashRouter, Route, Routes } from "react-router-dom";
import { NotificationListener } from "./components/NotificationListener";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/Toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { CategoryProvider } from "./contexts/CategoryContext";
import { ChannelProvider } from "./contexts/ChannelContext";
import { LibraryProvider } from "./contexts/LibraryContext";
import { LibraryPreferencesProvider } from "./contexts/LibraryPreferencesContext";
import { MediaDragProvider } from "./contexts/MediaDragContext";
import { NicheProvider } from "./contexts/NicheContext";
import { PostDragProvider } from "./contexts/PostDragContext";
import { RedditPostProvider } from "./contexts/RedditPostContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ShootProvider } from "./contexts/ShootContext";
import { Layout } from "./Layout";
import { ChannelsPage } from "./pages/Channels";
import { ManagePage } from "./pages/Manage";
import { MediaDetail } from "./pages/MediaDetail";
import { PlanPage } from "./pages/Plan";
import { PostDetailPage } from "./pages/PostDetail";
import { SettingsPage } from "./pages/Settings";
import { SubredditsPage } from "./pages/Subreddits";
import { TaggingPage } from "./pages/Tagging";
import { AnalyticsPage } from "./pages/Analytics";

const App = () => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <CategoryProvider>
          <NicheProvider>
            <ChannelProvider>
              <ShootProvider>
                <LibraryPreferencesProvider>
                  <LibraryProvider>
                    <MediaDragProvider>
                      <PostDragProvider>
                        <RedditPostProvider>
                          <TooltipProvider delayDuration={0}>
                            <HashRouter>
                              <Routes>
                                <Route path="/" element={<Layout />}>
                                  <Route index element={<ManagePage />} />
                                  <Route path="content/:mediaId" element={<MediaDetail />} />
                                  <Route path="posts" element={<PlanPage />} />
                                  <Route path="posts/:postId" element={<PostDetailPage />} />
                                  <Route path="channels" element={<ChannelsPage />} />
                                  <Route path="subreddits" element={<SubredditsPage />} />
                                  <Route path="tagging" element={<TaggingPage />} />
                                  <Route path="analytics" element={<AnalyticsPage />} />
                                  <Route path="settings" element={<SettingsPage />} />
                                </Route>
                              </Routes>
                            </HashRouter>
                            <NotificationListener />
                            <Toaster />
                          </TooltipProvider>
                        </RedditPostProvider>
                      </PostDragProvider>
                    </MediaDragProvider>
                  </LibraryProvider>
                </LibraryPreferencesProvider>
              </ShootProvider>
            </ChannelProvider>
          </NicheProvider>
        </CategoryProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default App;
