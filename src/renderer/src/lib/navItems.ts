import { RedditIcon } from "@renderer/components/icons";
import { FileText, Hash, LayoutGrid, Settings, Share2 } from "lucide-react";

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
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
