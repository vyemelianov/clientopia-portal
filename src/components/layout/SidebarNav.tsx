
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { 
  BarChart3, 
  Home, 
  LogOut, 
  Package, 
  Settings, 
  ShoppingCart, 
  Users, 
  Wallet 
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarNavProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["client", "sales", "admin"],
  },
  {
    title: "Profile",
    href: "/profile",
    icon: Settings,
    roles: ["client", "sales", "admin"],
  },
  {
    title: "My Package",
    href: "/my-package",
    icon: Package,
    roles: ["client"],
  },
  {
    title: "Top-ups",
    href: "/top-ups",
    icon: Wallet,
    roles: ["client"],
  },
  {
    title: "Purchase Package",
    href: "/purchase",
    icon: ShoppingCart,
    roles: ["client"],
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users,
    roles: ["sales", "admin"],
  },
  {
    title: "Register Client",
    href: "/register-client",
    icon: Users,
    roles: ["sales"],
  },
  {
    title: "Sales Team",
    href: "/sales",
    icon: BarChart3,
    roles: ["admin"],
  },
];

export function SidebarNav({ className }: SidebarNavProps) {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const filteredNavItems = navItems.filter((item) => 
    item.roles.includes(user.role)
  );

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {filteredNavItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )
          }
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </NavLink>
      ))}

      <button
        onClick={() => logout()}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground mt-auto"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </nav>
  );
}
