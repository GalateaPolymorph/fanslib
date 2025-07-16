import { cn } from "@renderer/lib/utils";
import { FileText, Filter, Palette, Settings2, Shield, Zap } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

type SettingsNavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

const settingsNavItems: SettingsNavItem[] = [
  {
    title: "General",
    href: "/settings/general",
    icon: Settings2,
    description: "Library and basic preferences",
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
    icon: Palette,
    description: "Theme and display settings",
  },
  {
    title: "Filter Presets",
    href: "/settings/filter-presets",
    icon: Filter,
    description: "Manage saved filter presets",
  },
  {
    title: "Caption Snippets",
    href: "/settings/snippets",
    icon: FileText,
    description: "Manage reusable caption snippets",
  },
  {
    title: "Content Safety",
    href: "/settings/content-safety",
    icon: Shield,
    description: "SFW mode and content filtering",
  },
  {
    title: "Integrations",
    href: "/settings/integrations",
    icon: Zap,
    description: "External services and APIs",
  },
];

export const SettingsLayout = () => {
  const location = useLocation();

  // Default to general settings if on root settings path
  const currentPath = location.pathname === "/settings" ? "/settings/general" : location.pathname;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-84 border-r border-border bg-muted/10 p-4 pt-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold px-3 mb-1">Settings</h2>
          <p className="text-sm text-muted-foreground px-3 mb-10">
            Configure your application preferences
          </p>

          <nav className="space-y-1">
            {settingsNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-14 max-w-5xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
