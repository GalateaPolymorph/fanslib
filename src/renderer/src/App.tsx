import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/Toaster";
import { SettingsProvider } from "./contexts/SettingsContext";
import { Layout } from "./Layout";
import { CalendarPage } from "./pages/Calendar";
import { ChannelsPage } from "./pages/Channels";
import { ContentPage } from "./pages/Content";
import { SettingsPage } from "./pages/Settings";

const App = () => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<ContentPage />} />
              <Route path="channels" element={<ChannelsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default App;
