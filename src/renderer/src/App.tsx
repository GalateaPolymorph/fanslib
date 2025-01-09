import { HashRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/Toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { CategoryProvider } from "./contexts/CategoryContext";
import { ChannelProvider } from "./contexts/ChannelContext";
import { LibraryProvider } from "./contexts/LibraryContext";
import { LibraryPreferencesProvider } from "./contexts/LibraryPreferencesContext";
import { MediaDragProvider } from "./contexts/MediaDragContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ShootProvider } from "./contexts/ShootContext";
import { TagProvider } from "./contexts/TagContext";
import { Layout } from "./Layout";
import { ChannelsPage } from "./pages/Channels";
import { ManagePage } from "./pages/Manage";
import { MediaDetail } from "./pages/MediaDetail";
import { PlanPage } from "./pages/Plan";
import { SettingsPage } from "./pages/Settings";

const App = () => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <CategoryProvider>
          <TagProvider>
            <ChannelProvider>
              <ShootProvider>
                <LibraryPreferencesProvider>
                  <LibraryProvider>
                    <MediaDragProvider>
                      <TooltipProvider delayDuration={0}>
                        <HashRouter>
                          <Routes>
                            <Route path="/" element={<Layout />}>
                              <Route index element={<ManagePage />} />
                              <Route path="content/:mediaId" element={<MediaDetail />} />
                              <Route path="posts" element={<PlanPage />} />
                              <Route path="channels" element={<ChannelsPage />} />
                              <Route path="settings" element={<SettingsPage />} />
                            </Route>
                          </Routes>
                        </HashRouter>
                        <Toaster />
                      </TooltipProvider>
                    </MediaDragProvider>
                  </LibraryProvider>
                </LibraryPreferencesProvider>
              </ShootProvider>
            </ChannelProvider>
          </TagProvider>
        </CategoryProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default App;
