
import React, { useState, useEffect } from "react";
import { useFoodDonations, FoodDonation } from "@/contexts/FoodDonationContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Clock, 
  Leaf, 
  Drumstick, 
  CheckCircle2,
  Phone,
  Info,
  AlertCircle
} from "lucide-react";

const MyRequests = () => {
  const { user } = useAuth();
  const { donations, updateDonationStatus } = useFoodDonations();
  const [isLoading, setIsLoading] = useState(false);
  
  // Manually create some accepted donations for the current user for demonstration purposes
  useEffect(() => {
    const initializeAcceptedDonations = async () => {
      if (user && donations.length > 0) {
        // Check if any donations are already accepted by the user
        const userDonations = donations.filter(
          d => d.status === "accepted" && d.acceptedBy?.id === user.id
        );
        
        // If no donations are accepted by the user, accept one for demo purposes
        if (userDonations.length === 0) {
          setIsLoading(true);
          try {
            // Find first pending donation
            const pendingDonation = donations.find(d => d.status === "pending");
            if (pendingDonation) {
              await updateDonationStatus(
                pendingDonation.id, 
                "accepted", 
                user.id, 
                user.name, 
                user.organization
              );
              
              // Also create one completed donation for demonstration
              const secondPending = donations.filter(d => d.status === "pending" && d.id !== pendingDonation.id)[0];
              if (secondPending) {
                await updateDonationStatus(
                  secondPending.id, 
                  "accepted", 
                  user.id, 
                  user.name, 
                  user.organization
                );
                
                await updateDonationStatus(secondPending.id, "picked");
              }
            }
          } catch (error) {
            console.error("Failed to initialize demo data:", error);
          } finally {
            setIsLoading(false);
          }
        }
      }
    };
    
    initializeAcceptedDonations();
  }, [user, donations, updateDonationStatus]);
  
  // Get all donations accepted by the current user
  const acceptedDonations = user 
    ? donations.filter(
        (donation) => 
          (donation.status === "accepted" || donation.status === "picked") && 
          donation.acceptedBy?.id === user.id
      )
    : [];

  // Group donations by status
  const pendingPickup = acceptedDonations.filter(donation => donation.status === "accepted");
  const completedPickups = acceptedDonations.filter(donation => donation.status === "picked");

  const handlePickupDonation = async (id: string) => {
    try {
      await updateDonationStatus(id, "picked");
    } catch (error) {
      console.error("Failed to confirm pickup:", error);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-muted">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Clock className="h-16 w-16 text-muted-foreground animate-pulse mb-4" />
          <p className="text-muted-foreground mb-2 text-center">
            Loading your requests...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (acceptedDonations.length === 0) {
    return (
      <Card className="bg-muted">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Info className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2 text-center">
            You haven't accepted any food donations yet.
          </p>
          <p className="text-muted-foreground mb-4 text-center">
            Browse available donations and accept them to help reduce food waste.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {pendingPickup.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Pending Pickup</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingPickup.map((donation) => (
              <Card key={donation.id} className="relative overflow-hidden border-l-4 border-l-blue-500">
                <div className="absolute top-0 right-0 m-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    Ready for pickup
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
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-zerowaste-primary" />
                      <span className="text-muted-foreground">
                        Contact: {donation.donorName} ({donation.donorOrganization || "Individual"})
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-zerowaste-primary hover:bg-zerowaste-secondary"
                    onClick={() => handlePickupDonation(donation.id)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Confirm Pickup
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {completedPickups.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Completed Pickups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedPickups.map((donation) => (
              <Card key={donation.id} className="relative overflow-hidden border-l-4 border-l-green-500">
                <div className="absolute top-0 right-0 m-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                    Picked up
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
                        Picked up: {new Date(donation.updatedAt).toLocaleString()}
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
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-zerowaste-primary" />
                      <span className="text-muted-foreground">
                        From: {donation.donorName} ({donation.donorOrganization || "Individual"})
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
