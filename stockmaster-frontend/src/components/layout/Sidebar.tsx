import { NavLink } from "@/components/NavLink";
import { 
  LayoutDashboard, 
  Package, 
  History, 
  TrendingUp, 
  Settings,
  ClipboardList,
  Truck,
  FileEdit,
  ArrowLeftRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { 
    title: "Operations", 
    icon: ClipboardList, 
    path: "/operations",
    subItems: [
      { title: "Receipts", icon: Truck, path: "/operations/receipts" },
      { title: "Deliveries", icon: Package, path: "/operations/deliveries" },
      { title: "Adjustments", icon: FileEdit, path: "/operations/adjustments" },
    ]
  },
  { title: "Stock List", icon: Package, path: "/stock" },
  { title: "Stock History", icon: History, path: "/history" },
  { title: "Move History", icon: ArrowLeftRight, path: "/moves" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export const Sidebar = ({ open }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        open ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Package className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {open && (
            <span className="font-semibold text-sidebar-foreground">
              StockMaster
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <div key={item.path}>
            <NavLink
              to={item.path}
              end={!item.subItems}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !open && "justify-center"
              )}
              activeClassName="bg-sidebar-accent text-sidebar-primary"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {open && <span>{item.title}</span>}
            </NavLink>
            
            {open && item.subItems && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-sidebar-border pl-4">
                {item.subItems.map((subItem) => (
                  <NavLink
                    key={subItem.path}
                    to={subItem.path}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                  >
                    <subItem.icon className="h-4 w-4" />
                    <span>{subItem.title}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};
