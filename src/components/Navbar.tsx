
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Leaf, Menu, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-zerowaste-primary" />
          <span className="text-xl font-bold text-zerowaste-primary">ZeroWaste</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {user?.role === "donor" && (
                <Button
                  variant="ghost"
                  onClick={() => navigate("/donor")}
                  className="text-zerowaste-text hover:text-zerowaste-primary"
                >
                  Donor Dashboard
                </Button>
              )}
              {user?.role === "receiver" && (
                <Button
                  variant="ghost"
                  onClick={() => navigate("/receiver")}
                  className="text-zerowaste-text hover:text-zerowaste-primary"
                >
                  Receiver Dashboard
                </Button>
              )}
              {user?.role === "admin" && (
                <Button
                  variant="ghost"
                  onClick={() => navigate("/admin")}
                  className="text-zerowaste-text hover:text-zerowaste-primary"
                >
                  Admin Dashboard
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="text-zerowaste-text hover:text-zerowaste-primary"
              >
                Login
              </Button>
              <Button
                onClick={handleRegister}
                className="bg-zerowaste-primary hover:bg-zerowaste-secondary text-white"
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
