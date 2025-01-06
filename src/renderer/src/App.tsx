import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import { Layout } from "./Layout";
import { ChannelsPage } from "./pages/Channels";
import { ContentPage } from "./pages/Content";
import { MediaDetail } from "./pages/MediaDetail";
import { PostsPage } from "./pages/Posts";
import { SettingsPage } from "./pages/Settings";

const App = () => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <CategoryProvider>
          <ChannelProvider>
            <ShootProvider>
              <LibraryPreferencesProvider>
                <LibraryProvider>
                  <MediaDragProvider>
                    <TooltipProvider delayDuration={0}>
                      <BrowserRouter>
                        <Routes>
                          <Route path="/" element={<Layout />}>
                            <Route index element={<ContentPage />} />
                            <Route path="content/:mediaId" element={<MediaDetail />} />
                            <Route path="posts" element={<PostsPage />} />
                            <Route path="channels" element={<ChannelsPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                          </Route>
                        </Routes>
                      </BrowserRouter>
                      <Toaster />
                    </TooltipProvider>
                  </MediaDragProvider>
                </LibraryProvider>
              </LibraryPreferencesProvider>
            </ShootProvider>
          </ChannelProvider>
        </CategoryProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default App;
