
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Info, Leaf, Drumstick } from "lucide-react";
import { FoodDonation } from "@/contexts/FoodDonationContext";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FoodDonationCardProps {
  donation: FoodDonation;
  onAccept?: (id: string) => void;
  showActions?: boolean;
}

const FoodDonationCard: React.FC<FoodDonationCardProps> = ({ 
  donation, 
  onAccept,
  showActions = true
}) => {
  const [loading, setLoading] = useState(false);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'picked':
        return 'bg-purple-100 text-purple-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAccept = async () => {
    if (onAccept) {
      setLoading(true);
      try {
        await onAccept(donation.id);
      } finally {
        setLoading(false);
      }
    }
  };

  // Calculate time remaining
  const expiryDate = new Date(donation.expiry);
  const now = new Date();
  const timeRemaining = expiryDate.getTime() - now.getTime();
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  
  // Determine urgency
  const isUrgent = hoursRemaining <= 6 && hoursRemaining > 0;
  
  // Food donation image mapping based on ID or food type
  const getFoodImage = () => {
    const imageMap: Record<string, string> = {
      '1': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=500&auto=format&fit=crop',
      '2': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=500&auto=format&fit=crop',
      '3': 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=500&auto=format&fit=crop',
    };
    
    if (imageMap[donation.id]) {
      return imageMap[donation.id];
    }
    
    // Fallback based on food type
    if (donation.foodType === 'veg') {
      return 'https://images.unsplash.com/photo-1608032364895-84e0dcca9fa1?q=80&w=500&auto=format&fit=crop';
    } else {
      return 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=500&auto=format&fit=crop';
    }
  };
  
  return (
    <Card className={`food-donation-card ${isUrgent ? 'border-red-400' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{donation.title}</CardTitle>
          <Badge className={getStatusColor(donation.status)}>
            {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
          </Badge>
        </div>
        <CardDescription>{donation.donorOrganization || donation.donorName}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="aspect-video rounded-md overflow-hidden bg-muted mb-4">
          <AspectRatio ratio={16/9}>
            <img
              src={getFoodImage()}
              alt={donation.title}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-zerowaste-primary" />
            <span className="text-muted-foreground">{donation.location.address}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className={`h-4 w-4 ${isUrgent ? 'text-red-500' : 'text-zerowaste-primary'}`} />
            <span className={`${isUrgent ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
              {hoursRemaining <= 0 
                ? 'Expired' 
                : `${hoursRemaining} hours remaining`}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {donation.foodType === 'veg' ? (
              <Leaf className="h-4 w-4 text-green-600" />
            ) : (
              <Drumstick className="h-4 w-4 text-amber-600" />
            )}
            <span className="text-muted-foreground">
              {donation.foodType === 'veg' ? 'Vegetarian' : 'Non-vegetarian'}, 
              {donation.perishable ? ' Perishable' : ' Non-perishable'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-zerowaste-primary" />
            <span className="text-muted-foreground">Quantity: {donation.quantity}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" asChild>
          <Link to={`/food/${donation.id}`}>View Details</Link>
        </Button>
        
        {showActions && donation.status === 'pending' && onAccept && (
          <Button 
            className="bg-zerowaste-primary hover:bg-zerowaste-secondary"
            onClick={handleAccept}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Accept Donation'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FoodDonationCard;
