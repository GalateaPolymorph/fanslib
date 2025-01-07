import { FileText, LayoutGrid, Settings, Share2 } from "lucide-react";

type NavItem = {
  title: string;
  url: string;
  icon: any;
};

export const navItems: NavItem[] = [
  {
    title: "Manage",
    url: "/",
    icon: LayoutGrid,
  },
  {
    title: "Plan",
    url: "/posts",
    icon: FileText,
  },
  {
    title: "Channels",
    url: "/channels",
    icon: Share2,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
