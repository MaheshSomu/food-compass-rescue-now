
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import FoodDonationCard from "@/components/FoodDonationCard";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useFoodDonations, FoodDonation } from "@/contexts/FoodDonationContext";
import { toast } from "@/components/ui/use-toast";
import { 
  MapPin, 
  Clock, 
  Filter, 
  Leaf, 
  Drumstick, 
  CheckCircle2 
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
            <h1 className="text-3xl font-bold">Find Food</h1>
            <p className="text-zerowaste-textLight mt-1">
              Browse available food donations near you
            </p>
          </div>
          
          <Tabs defaultValue="map">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="pt-4">
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Food Donations Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted h-[50vh] rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Map view will be implemented with Google Maps or OpenStreetMap integration.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Nearby Donations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonations.slice(0, 3).map((donation) => (
                  <FoodDonationCard 
                    key={donation.id}
                    donation={donation}
                    onAccept={handleAcceptDonation}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="pt-4">
              <Card className="mb-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium">
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
              
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Available Donations</h2>
                <Badge variant="outline" className="px-2 py-1">
                  {filteredDonations.length} found
                </Badge>
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
              
              {acceptedDonations.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold mt-10 mb-4">Your Accepted Donations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {acceptedDonations.map((donation) => (
                      <Card key={donation.id} className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 m-2">
                          <Badge className="bg-blue-500">
                            {donation.status === "accepted" ? "Ready for pickup" : "Picked up"}
                          </Badge>
                        </div>
                        <CardContent className="pt-6">
                          <h3 className="font-semibold text-lg mb-2">{donation.title}</h3>
                          <div className="space-y-2 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-zerowaste-primary" />
                              <span className="text-muted-foreground">{donation.location.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-zerowaste-primary" />
                              <span className="text-muted-foreground">
                                Expires: {new Date(donation.expiry).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {donation.foodType === 'veg' ? (
                                <Leaf className="h-4 w-4 text-green-600" />
                              ) : (
                                <Drumstick className="h-4 w-4 text-amber-600" />
                              )}
                              <span className="text-muted-foreground">
                                {donation.foodType === 'veg' ? 'Vegetarian' : 'Non-vegetarian'}
                              </span>
                            </div>
                          </div>
                          
                          {donation.status === "accepted" && (
                            <Button 
                              className="w-full bg-zerowaste-primary hover:bg-zerowaste-secondary"
                              onClick={() => handlePickupDonation(donation.id)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Confirm Pickup
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ReceiverDashboard;
