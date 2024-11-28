import { Outlet } from "react-router-dom";
import { AppSidebar } from "./components/Sidebar";
import { SidebarProvider } from "./components/ui/sidebar";

export const Layout = () => {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 w-full">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
