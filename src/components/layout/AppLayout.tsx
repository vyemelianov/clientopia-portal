
import { SidebarNav } from "./SidebarNav";
import { useAuth } from "@/context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRole } from "@/types";
import { Wifi } from "lucide-react";

interface AppLayoutProps {
  requiredRole?: UserRole | UserRole[];
}

export default function AppLayout({ requiredRole }: AppLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role access if requiredRole is specified
  if (
    requiredRole &&
    user &&
    ((Array.isArray(requiredRole) && !requiredRole.includes(user.role)) ||
      (!Array.isArray(requiredRole) && user.role !== requiredRole))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Wifi className="h-6 w-6 text-sidebar-primary mr-2" />
            <span className="font-semibold">ClientNet Portal</span>
          </div>
          <ScrollArea className="flex-1 px-4 py-4">
            <SidebarNav />
          </ScrollArea>
        </div>
      </div>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
