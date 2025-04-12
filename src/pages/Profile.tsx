
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { User, AtSign, Building, MapPin, Phone, Shield } from "lucide-react";

const Profile = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Initialize form with user data
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setOrganization(user.organization || "");
      
      // In a real app, these would come from the user profile
      setAddress("123 Main Street, New York, NY 10001");
      setPhone("+1 (555) 123-4567");
    }
  }, [isAuthenticated, user, navigate]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    }, 1000);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const roleLabel = user.role === 'donor' ? 'Donor' : user.role === 'receiver' ? 'Receiver' : 'Admin';

  return (
    <div className="flex min-h-screen bg-zerowaste-background">
      <DashboardSidebar />
      
      <div className="flex-1 p-6">
        <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-zerowaste-textLight mt-1">
              Manage your personal information and account settings
            </p>
          </div>
          
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your personal details and organization information
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">{user.name}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                        <Badge variant="outline">
                          <Shield className="h-3 w-3 mr-1" />
                          {roleLabel}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-zerowaste-primary" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center">
                          <AtSign className="h-4 w-4 mr-1 text-zerowaste-primary" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organization" className="flex items-center">
                        <Building className="h-4 w-4 mr-1 text-zerowaste-primary" />
                        Organization (Optional)
                      </Label>
                      <Input
                        id="organization"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-zerowaste-primary" />
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-zerowaste-primary" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-zerowaste-primary hover:bg-zerowaste-secondary"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and account security
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleChangePassword}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        required
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to log out from all devices?")) {
                          toast({
                            title: "Logged out from all devices",
                            description: "You have been logged out from all devices successfully.",
                          });
                        }
                      }}
                    >
                      Log Out All Devices
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-zerowaste-primary hover:bg-zerowaste-secondary"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible actions related to your account
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                          logout();
                          navigate("/");
                          toast({
                            title: "Account deleted",
                            description: "Your account has been deleted successfully.",
                          });
                        }
                      }}
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Updated Badge component to accept className prop
const Badge = ({ 
  children, 
  variant = "default",
  className = "" // Added className with default empty string
}: { 
  children: React.ReactNode; 
  variant?: "outline" | "default";
  className?: string; // Added className prop type
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "bg-transparent border border-zerowaste-primary text-zerowaste-primary";
      default:
        return "bg-zerowaste-primary text-white";
    }
  };
  
  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getVariantClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default Profile;
