import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/Toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { CategoryProvider } from "./contexts/CategoryContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { Layout } from "./Layout";
import { ChannelsPage } from "./pages/Channels";
import { ContentPage } from "./pages/Content";
import { PostDetail } from "./pages/PostDetail";
import { PostsPage } from "./pages/Posts";
import { SettingsPage } from "./pages/Settings";

const App = () => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <CategoryProvider>
          <TooltipProvider delayDuration={0}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<ContentPage />} />
                  <Route path="posts" element={<PostsPage />} />
                  <Route path="posts/:postId" element={<PostDetail />} />
                  <Route path="channels" element={<ChannelsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
            <Toaster />
          </TooltipProvider>
        </CategoryProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default App;
