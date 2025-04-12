
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import FoodDonationCard from "@/components/FoodDonationCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useFoodDonations } from "@/contexts/FoodDonationContext";
import { 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle, 
  Utensils, 
  Leaf, 
  CookingPot,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const AdminDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { donations } = useFoodDonations();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "admin") {
      // Redirect non-admins to appropriate dashboard
      if (user?.role === "donor") {
        navigate("/donor");
      } else if (user?.role === "receiver") {
        navigate("/receiver");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Calculate stats
  const totalDonations = donations.length;
  const pendingDonations = donations.filter(d => d.status === 'pending').length;
  const acceptedDonations = donations.filter(d => d.status === 'accepted').length;
  const completedDonations = donations.filter(d => ['picked', 'verified'].includes(d.status)).length;
  
  // Calculate estimate of people fed and kg saved
  const estimatedPeopleFed = completedDonations * 10; // Estimation: each donation feeds 10 people
  const estimatedKgSaved = completedDonations * 5; // Estimation: each donation saves 5kg of food

  return (
    <div className="flex min-h-screen bg-zerowaste-background">
      <DashboardSidebar />
      
      <div className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-zerowaste-textLight mt-1">
              Monitor and manage the ZeroWaste platform
            </p>
          </div>
          
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Utensils className="h-5 w-5 text-zerowaste-primary mr-2" />
                    <span className="text-2xl font-bold">{totalDonations}</span>
                  </div>
                  <Badge variant="success">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  People Fed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-zerowaste-primary mr-2" />
                    <span className="text-2xl font-bold">{estimatedPeopleFed}</span>
                  </div>
                  <Badge variant="success">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +18%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Food Rescued
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CookingPot className="h-5 w-5 text-zerowaste-primary mr-2" />
                    <span className="text-2xl font-bold">{estimatedKgSaved} kg</span>
                  </div>
                  <Badge variant="success">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +15%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  CO₂ Emissions Saved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Leaf className="h-5 w-5 text-zerowaste-primary mr-2" />
                    <span className="text-2xl font-bold">{(estimatedKgSaved * 2.5).toFixed(1)} kg</span>
                  </div>
                  <Badge variant="success">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +22%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Donation Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-2xl font-bold">{pendingDonations}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Accepted Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Utensils className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-2xl font-bold">{acceptedDonations}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-2xl font-bold">{completedDonations}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Analytics Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Analytics Overview</CardTitle>
                  <CardDescription>
                    Food rescue metrics for the past 30 days
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Full Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">
                  Analytics chart will be implemented with recharts library.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Admin Management Tabs */}
          <Tabs defaultValue="donations">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="donations" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Donations</h2>
                <Button variant="outline">
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {donations.slice(0, 6).map((donation) => (
                  <FoodDonationCard 
                    key={donation.id} 
                    donation={donation}
                    showActions={false}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Platform Users</h2>
                <Button variant="outline">
                  Add User
                </Button>
              </div>
              
              <div className="bg-muted rounded-md p-8 flex items-center justify-center">
                <p className="text-muted-foreground">
                  User management interface will be implemented here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Badge component for showing stats trends
const Badge = ({ 
  children, 
  variant = "default" 
}: { 
  children: React.ReactNode; 
  variant?: "success" | "danger" | "default" 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800";
      case "danger":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getVariantClasses()}`}>
      {children}
    </div>
  );
};

export default AdminDashboard;
