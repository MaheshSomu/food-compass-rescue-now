
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import FoodDonationCard from "@/components/FoodDonationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useFoodDonations, FoodDonation } from "@/contexts/FoodDonationContext";
import { PlusCircle, CheckCircle, Calendar, Clock, ArrowRight } from "lucide-react";

const DonorDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { userDonations, addDonation } = useFoodDonations();
  const navigate = useNavigate();

  // Form state for new donation
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [foodType, setFoodType] = useState<"veg" | "non-veg">("veg");
  const [perishable, setPerishable] = useState(true);
  const [expiryHours, setExpiryHours] = useState("24");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "donor") {
      // Redirect non-donors to appropriate dashboard
      if (user?.role === "receiver") {
        navigate("/receiver");
      } else if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Mock location data - in real app would use geocoding API
      const newDonation: Omit<FoodDonation, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
        donorId: user.id,
        donorName: user.name,
        donorOrganization: user.organization,
        title,
        description,
        quantity,
        foodType,
        perishable,
        expiry: new Date(Date.now() + parseInt(expiryHours) * 60 * 60 * 1000).toISOString(),
        images: ['/placeholder.svg'],
        location: {
          lat: 40.712776 + (Math.random() * 0.1 - 0.05),
          lng: -74.005974 + (Math.random() * 0.1 - 0.05),
          address
        }
      };
      
      await addDonation(newDonation);
      
      // Reset form
      setTitle("");
      setDescription("");
      setQuantity("");
      setFoodType("veg");
      setPerishable(true);
      setExpiryHours("24");
      setAddress("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter donations by status
  const pendingDonations = userDonations.filter(d => d.status === 'pending');
  const acceptedDonations = userDonations.filter(d => d.status === 'accepted');
  const completedDonations = userDonations.filter(d => ['picked', 'verified'].includes(d.status));

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-zerowaste-background">
      <DashboardSidebar />
      
      <div className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Donor Dashboard</h1>
            <p className="text-zerowaste-textLight mt-1">
              Manage your food donations and help reduce waste
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <PlusCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-2xl font-bold">{pendingDonations.length}</span>
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
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-2xl font-bold">{acceptedDonations.length}</span>
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
                  <span className="text-2xl font-bold">{completedDonations.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Donations Management */}
          <Tabs defaultValue="add">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="add">Add Donation</TabsTrigger>
              <TabsTrigger value="manage">Manage Donations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="add" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Post New Food Donation</CardTitle>
                  <CardDescription>
                    Fill out the details about the food you'd like to donate
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleAddDonation}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Food Title</Label>
                      <Input
                        id="title"
                        placeholder="E.g., Fresh Vegetables, Leftover Pasta"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the food in detail - ingredients, quantity, etc."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          placeholder="E.g., 5 kg, 3 boxes"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Window (Hours)</Label>
                        <Input
                          id="expiry"
                          type="number"
                          min="1"
                          value={expiryHours}
                          onChange={(e) => setExpiryHours(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Food Type</Label>
                      <RadioGroup 
                        defaultValue="veg" 
                        value={foodType}
                        onValueChange={(value) => setFoodType(value as "veg" | "non-veg")}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="veg" id="veg" />
                          <Label htmlFor="veg">Vegetarian</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="non-veg" id="non-veg" />
                          <Label htmlFor="non-veg">Non-Vegetarian</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Perishable</Label>
                      <RadioGroup 
                        defaultValue="true" 
                        value={perishable ? "true" : "false"}
                        onValueChange={(value) => setPerishable(value === "true")}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="perishable-yes" />
                          <Label htmlFor="perishable-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="perishable-no" />
                          <Label htmlFor="perishable-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Pickup Address</Label>
                      <Input
                        id="address"
                        placeholder="Enter the full address where the food can be picked up"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Upload Image (Optional)</Label>
                      <Input type="file" accept="image/*" />
                      <p className="text-xs text-muted-foreground">
                        Upload an image of the food to help receivers identify it.
                      </p>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-zerowaste-primary hover:bg-zerowaste-secondary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Posting Donation..." : "Post Donation"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="manage" className="pt-4 space-y-6">
              {userDonations.length === 0 ? (
                <Card className="bg-muted">
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <p className="text-muted-foreground mb-4">You haven't posted any donations yet.</p>
                    <Button 
                      onClick={() => document.querySelector('[value="add"]')?.dispatchEvent(new Event('click'))}
                      className="bg-zerowaste-primary hover:bg-zerowaste-secondary"
                    >
                      Post Your First Donation
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {pendingDonations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Pending Donations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingDonations.map((donation) => (
                          <FoodDonationCard 
                            key={donation.id} 
                            donation={donation}
                            showActions={false}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {acceptedDonations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Accepted Donations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {acceptedDonations.map((donation) => (
                          <FoodDonationCard 
                            key={donation.id} 
                            donation={donation}
                            showActions={false}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {completedDonations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Completed Donations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedDonations.map((donation) => (
                          <FoodDonationCard 
                            key={donation.id} 
                            donation={donation}
                            showActions={false}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
