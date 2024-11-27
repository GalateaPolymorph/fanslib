import { Outlet } from "react-router-dom";
import { AppSidebar } from "./components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";

export const Layout = () => {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
