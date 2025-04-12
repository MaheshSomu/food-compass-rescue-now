
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import FoodDonationCard from "@/components/FoodDonationCard";
import MyRequests from "@/components/MyRequests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useFoodDonations, FoodDonation } from "@/contexts/FoodDonationContext";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Clock, 
  Filter, 
  Leaf, 
  Drumstick, 
  CheckCircle2,
  ListFilter,
  List,
  Map,
  Calendar,
  Package,
  ArrowUpRight 
} from "lucide-react";

const ReceiverDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { donations, updateDonationStatus } = useFoodDonations();
  const navigate = useNavigate();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [foodTypeFilter, setFoodTypeFilter] = useState<string>("all");
  const [onlyShowVeg, setOnlyShowVeg] = useState(false);
  const [maxDistance, setMaxDistance] = useState([10]); // km
  const [onlyShowAvailable, setOnlyShowAvailable] = useState(true);

  // Filtered donations
  const [filteredDonations, setFilteredDonations] = useState<FoodDonation[]>([]);
  
  // Accepted donations by this receiver
  const [acceptedDonations, setAcceptedDonations] = useState<FoodDonation[]>([]);

  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    availableDonations: 0,
    nearbyDonations: 0,
    expiringToday: 0,
    totalSaved: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "receiver") {
      // Redirect non-receivers to appropriate dashboard
      if (user?.role === "donor") {
        navigate("/donor");
      } else if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Filter donations based on criteria
  useEffect(() => {
    if (!donations) return;
    
    let filtered = [...donations];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (donation) =>
          donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by food type
    if (foodTypeFilter !== "all") {
      filtered = filtered.filter((donation) => donation.foodType === foodTypeFilter);
    }
    
    // Filter vegetarian only
    if (onlyShowVeg) {
      filtered = filtered.filter((donation) => donation.foodType === "veg");
    }
    
    // Filter by status (available/pending only)
    if (onlyShowAvailable) {
      filtered = filtered.filter((donation) => donation.status === "pending");
    }
    
    // In a real app, we would filter by distance using geolocation
    // Here we're just simulating it with the slider
    
    // Sort by expiry (closest first)
    filtered.sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());
    
    setFilteredDonations(filtered);
    
    // Set accepted donations
    if (user) {
      const accepted = donations.filter(
        (donation) => 
          donation.status !== "pending" && 
          donation.acceptedBy?.id === user.id
      );
      setAcceptedDonations(accepted);
    }

    // Calculate dashboard stats
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Calculate stats
    const stats = {
      availableDonations: donations.filter(d => d.status === 'pending').length,
      nearbyDonations: Math.min(5, donations.filter(d => d.status === 'pending').length), // Simulated nearby
      expiringToday: donations.filter(d => {
        const expiry = new Date(d.expiry);
        return d.status === 'pending' && expiry >= today && expiry < tomorrow;
      }).length,
      totalSaved: acceptedDonations.length,
    };

    setDashboardStats(stats);
    
  }, [donations, searchTerm, foodTypeFilter, onlyShowVeg, maxDistance, onlyShowAvailable, user]);

  const handleAcceptDonation = async (id: string) => {
    if (!user) return;
    
    try {
      await updateDonationStatus(
        id, 
        "accepted", 
        user.id, 
        user.name, 
        user.organization
      );
      
      toast({
        title: "Donation accepted",
        description: "You have successfully accepted this donation. Please pick it up before it expires.",
      });
    } catch (error) {
      toast({
        title: "Failed to accept donation",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePickupDonation = async (id: string) => {
    try {
      await updateDonationStatus(id, "picked");
      
      toast({
        title: "Pickup confirmed",
        description: "Thank you for picking up this donation!",
      });
    } catch (error) {
      toast({
        title: "Failed to confirm pickup",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-zerowaste-background">
      <DashboardSidebar />
      
      <div className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Receiver Dashboard</h1>
            <p className="text-zerowaste-textLight mt-1">
              Find and manage food donations
            </p>
          </div>
          
          {/* Dashboard Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center pt-6">
                <div className="rounded-full bg-blue-100 p-3 mb-4">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-4xl font-bold text-center mb-2">
                  {dashboardStats.availableDonations}
                </CardTitle>
                <p className="text-muted-foreground text-center">Available Donations</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center justify-center pt-6">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-4xl font-bold text-center mb-2">
                  {dashboardStats.nearbyDonations}
                </CardTitle>
                <p className="text-muted-foreground text-center">Nearby Donations</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center justify-center pt-6">
                <div className="rounded-full bg-orange-100 p-3 mb-4">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-4xl font-bold text-center mb-2">
                  {dashboardStats.expiringToday}
                </CardTitle>
                <p className="text-muted-foreground text-center">Expiring Today</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center justify-center pt-6">
                <div className="rounded-full bg-purple-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-4xl font-bold text-center mb-2">
                  {dashboardStats.totalSaved}
                </CardTitle>
                <p className="text-muted-foreground text-center">Donations Saved</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Food Rescue Impact</CardTitle>
              <CardDescription>
                Track your contribution to reducing food waste
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Food Saved</Label>
                    <span className="text-sm text-muted-foreground">
                      {acceptedDonations.length * 2.5}kg
                    </span>
                  </div>
                  <Progress value={Math.min(100, acceptedDonations.length * 5)} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>CO₂ Prevented</Label>
                    <span className="text-sm text-muted-foreground">
                      {acceptedDonations.length * 4.2}kg
                    </span>
                  </div>
                  <Progress value={Math.min(100, acceptedDonations.length * 8)} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Water Saved</Label>
                    <span className="text-sm text-muted-foreground">
                      {acceptedDonations.length * 100}L
                    </span>
                  </div>
                  <Progress value={Math.min(100, acceptedDonations.length * 10)} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="browse">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="browse" className="flex items-center">
                <ListFilter className="h-4 w-4 mr-2" />
                Browse Donations
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex items-center">
                <List className="h-4 w-4 mr-2" />
                My Requests
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse" className="pt-4">
              <Card className="mb-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center">
                    <Filter className="mr-2 h-5 w-5" />
                    Filter Donations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search</Label>
                      <div className="relative">
                        <Input
                          id="search"
                          placeholder="Search by title, description or location"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                        <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="foodType">Food Type</Label>
                      <Select value={foodTypeFilter} onValueChange={setFoodTypeFilter}>
                        <SelectTrigger id="foodType">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="veg">Vegetarian</SelectItem>
                          <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Maximum Distance</Label>
                      <div className="pt-2">
                        <Slider 
                          value={maxDistance} 
                          onValueChange={setMaxDistance}
                          max={50}
                          step={1}
                          className="pt-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>1 km</span>
                          <span>{maxDistance[0]} km</span>
                          <span>50 km</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="veg-only" 
                        checked={onlyShowVeg}
                        onCheckedChange={setOnlyShowVeg}
                      />
                      <Label htmlFor="veg-only" className="flex items-center">
                        <Leaf className="h-4 w-4 mr-1 text-green-600" />
                        Vegetarian Only
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="available-only" 
                        checked={onlyShowAvailable}
                        onCheckedChange={setOnlyShowAvailable}
                      />
                      <Label htmlFor="available-only">Available Only</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between mb-6">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <List className="h-4 w-4 mr-2" />
                    List View
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Map className="h-4 w-4 mr-2" />
                    Map View
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar
                  </Button>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="px-2 py-1">
                    {filteredDonations.length} found
                  </Badge>
                </div>
              </div>
              
              {filteredDonations.length === 0 ? (
                <Card className="bg-muted">
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <p className="text-muted-foreground mb-4">No donations found matching your criteria.</p>
                    <Button 
                      onClick={() => {
                        setSearchTerm("");
                        setFoodTypeFilter("all");
                        setOnlyShowVeg(false);
                        setMaxDistance([10]);
                        setOnlyShowAvailable(true);
                      }}
                      variant="outline"
                    >
                      Reset Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDonations.map((donation) => (
                    <FoodDonationCard 
                      key={donation.id}
                      donation={donation}
                      onAccept={handleAcceptDonation}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="requests" className="pt-4">
              <MyRequests />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ReceiverDashboard;
