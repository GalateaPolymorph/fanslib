import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Get system theme preference as fallback
const getSystemTheme = (): Theme => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light"; // Default fallback
};

// Apply theme to DOM immediately
const applyTheme = (theme: Theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with system preference to reduce flash
  const [theme, setTheme] = useState<Theme>(() => getSystemTheme());
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false);

  // Apply initial theme immediately
  useEffect(() => {
    applyTheme(theme);
  }, []);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const settings = await window.api["settings:load"]();
        const loadedTheme = settings.theme as Theme;

        // Only update if different from current theme to prevent unnecessary re-renders
        if (loadedTheme !== theme) {
          setTheme(loadedTheme);
          applyTheme(loadedTheme);
        } else {
          // Ensure DOM is in sync even if theme is the same
          applyTheme(loadedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme from settings:", error);
        // Keep current theme (system preference) as fallback
        applyTheme(theme);
      } finally {
        setHasLoadedSettings(true);
      }
    };

    loadTheme();
  }, [theme]);

  useEffect(() => {
    // Update document class when theme changes after initial load
    if (hasLoadedSettings) {
      applyTheme(theme);
    }
  }, [theme, hasLoadedSettings]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
