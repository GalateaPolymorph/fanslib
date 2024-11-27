import { Calendar, LayoutGrid, Settings } from "lucide-react";

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
