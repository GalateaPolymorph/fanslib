import { Calendar, LayoutGrid, Settings, Share2 } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: any;
}

export const navItems: NavItem[] = [
  {
    title: "Content",
    url: "/",
    icon: LayoutGrid,
  },
  {
    title: "Channels",
    url: "/channels",
    icon: Share2,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
