
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import FoodDonationCard from "@/components/FoodDonationCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useFoodDonations } from "@/contexts/FoodDonationContext";
import { Utensils, Users, CookingPot, CalendarClock } from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { donations } = useFoodDonations();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Redirect to role-specific dashboard if available
  useEffect(() => {
    if (user) {
      if (user.role === "donor") {
        navigate("/donor");
      } else if (user.role === "receiver") {
        navigate("/receiver");
      } else if (user.role === "admin") {
        navigate("/admin");
      }
    }
  }, [user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Only remaining users with no specific role end up here
  return (
    <div className="flex min-h-screen bg-zerowaste-background">
      <DashboardSidebar />
      
      <div className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome to ZeroWaste</h1>
            <p className="text-zerowaste-textLight mt-1">
              Help reduce food waste and feed those in need
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Utensils className="h-5 w-5 text-zerowaste-primary mr-2" />
                  <span className="text-2xl font-bold">{donations.length}</span>
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
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-zerowaste-primary mr-2" />
                  <span className="text-2xl font-bold">421</span>
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
                <div className="flex items-center">
                  <CookingPot className="h-5 w-5 text-zerowaste-primary mr-2" />
                  <span className="text-2xl font-bold">210 kg</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CalendarClock className="h-5 w-5 text-zerowaste-primary mr-2" />
                  <span className="text-2xl font-bold">
                    {donations.filter(d => d.status === 'pending').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Donations */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Food Donations</h2>
              <Button 
                variant="outline" 
                className="text-zerowaste-primary border-zerowaste-primary hover:bg-zerowaste-primary/10"
              >
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.slice(0, 3).map((donation) => (
                <FoodDonationCard 
                  key={donation.id} 
                  donation={donation}
                  showActions={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
