
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Leaf,
  Home,
  Map,
  PlusCircle,
  ClipboardList,
  Settings,
  User,
  Users,
  BarChart3,
  LogOut,
} from "lucide-react";

const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center pl-4 h-14 border-b">
        <Leaf className="h-6 w-6 text-sidebar-primary mr-2" />
        <span className="font-bold text-lg">ZeroWaste</span>
        <div className="ml-auto">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Common Links for All Users */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive("/dashboard") || location.pathname === "/"}>
                  <Link to="/dashboard">
                    <Home className="h-5 w-5 mr-2" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive("/profile")}>
                  <Link to="/profile">
                    <User className="h-5 w-5 mr-2" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Donor Specific Links */}
              {user?.role === "donor" && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild data-active={isActive("/donor")}>
                      <Link to="/donor">
                        <ClipboardList className="h-5 w-5 mr-2" />
                        <span>My Donations</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild data-active={isActive("/donor/add")}>
                      <Link to="/donor">
                        <PlusCircle className="h-5 w-5 mr-2" />
                        <span>Add Donation</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              
              {/* Receiver Specific Links */}
              {user?.role === "receiver" && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild data-active={isActive("/receiver")}>
                      <Link to="/receiver">
                        <Map className="h-5 w-5 mr-2" />
                        <span>Find Food</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild data-active={isActive("/receiver/requests")}>
                      <Link to="/receiver">
                        <ClipboardList className="h-5 w-5 mr-2" />
                        <span>My Requests</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              
              {/* Admin Specific Links */}
              {user?.role === "admin" && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild data-active={isActive("/admin")}>
                      <Link to="/admin">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        <span>Analytics</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild data-active={isActive("/admin/users")}>
                      <Link to="/admin">
                        <Users className="h-5 w-5 mr-2" />
                        <span>Users</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild data-active={isActive("/admin/donations")}>
                      <Link to="/admin">
                        <ClipboardList className="h-5 w-5 mr-2" />
                        <span>Donations</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOut className="h-5 w-5 mr-2" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
