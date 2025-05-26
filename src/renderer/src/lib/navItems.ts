import { RedditIcon } from "@renderer/components/icons";
import { BarChart3, Beaker, FileText, Hash, LayoutGrid, Settings, Share2 } from "lucide-react";

type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
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
    title: "Subreddits",
    url: "/subreddits",
    icon: RedditIcon,
  },
  {
    title: "Tagging",
    url: "/tagging",
    icon: Hash,
  },
  {
    title: "Tag Demo",
    url: "/tag-demo",
    icon: Beaker,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
