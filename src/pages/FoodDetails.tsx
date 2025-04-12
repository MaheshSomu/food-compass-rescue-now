
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useFoodDonations, FoodDonation } from "@/contexts/FoodDonationContext";
import { 
  MapPin, 
  Clock, 
  Info, 
  ChevronLeft, 
  User, 
  Building, 
  Phone, 
  Leaf, 
  Drumstick,
  CheckCircle,
  Calendar
} from "lucide-react";

const FoodDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const { getDonationById, updateDonationStatus } = useFoodDonations();
  const navigate = useNavigate();
  
  const [donation, setDonation] = useState<FoodDonation | undefined>();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!id) {
      navigate("/dashboard");
      return;
    }
    
    const donationData = getDonationById(id);
    if (donationData) {
      setDonation(donationData);
    } else {
      toast({
        title: "Donation not found",
        description: "The donation you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [id, getDonationById, navigate]);

  const handleAcceptDonation = async () => {
    if (!user || !donation) return;
    
    setLoading(true);
    try {
      await updateDonationStatus(
        donation.id, 
        "accepted", 
        user.id, 
        user.name, 
        user.organization
      );
      
      // Update local state
      setDonation(getDonationById(donation.id));
      
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
    } finally {
      setLoading(false);
    }
  };

  const handlePickupDonation = async () => {
    if (!donation) return;
    
    setLoading(true);
    try {
      await updateDonationStatus(donation.id, "picked");
      
      // Update local state
      setDonation(getDonationById(donation.id));
      
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
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDonation = async () => {
    if (!donation) return;
    
    setLoading(true);
    try {
      await updateDonationStatus(donation.id, "verified");
      
      // Update local state
      setDonation(getDonationById(donation.id));
      
      toast({
        title: "Donation verified",
        description: "This donation has been verified as completed.",
      });
    } catch (error) {
      toast({
        title: "Failed to verify donation",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  // Format date 
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString();
  };

  // Calculate time remaining
  const calculateTimeRemaining = () => {
    if (!donation) return null;
    
    const expiryDate = new Date(donation.expiry);
    const now = new Date();
    const timeRemaining = expiryDate.getTime() - now.getTime();
    
    if (timeRemaining <= 0) {
      return 'Expired';
    }
    
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(timeRemaining / (1000 * 60));
      return `${minutes} minutes remaining`;
    }
    
    return `${hours} hours remaining`;
  };

  if (!donation) {
    return null;
  }

  const isReceiverAccepted = isAuthenticated && 
    user?.role === 'receiver' && 
    donation.status === 'accepted' && 
    donation.acceptedBy?.id === user.id;
  
  const isDonorAndAccepted = isAuthenticated && 
    user?.role === 'donor' && 
    user.id === donation.donorId && 
    donation.status === 'picked';

  return (
    <div className="min-h-screen flex flex-col bg-zerowaste-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="ghost" className="mb-2" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{donation.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-zerowaste-textLight">{donation.donorOrganization || donation.donorName}</p>
                <Badge className={getStatusColor(donation.status)}>
                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                </Badge>
              </div>
            </div>
            
            {isAuthenticated && user?.role === 'receiver' && donation.status === 'pending' && (
              <Button 
                className="mt-4 md:mt-0 bg-zerowaste-primary hover:bg-zerowaste-secondary"
                onClick={handleAcceptDonation}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Accept Donation'}
              </Button>
            )}
            
            {isReceiverAccepted && (
              <Button 
                className="mt-4 md:mt-0 bg-zerowaste-primary hover:bg-zerowaste-secondary"
                onClick={handlePickupDonation}
                disabled={loading}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {loading ? 'Processing...' : 'Confirm Pickup'}
              </Button>
            )}
            
            {isDonorAndAccepted && (
              <Button 
                className="mt-4 md:mt-0 bg-zerowaste-primary hover:bg-zerowaste-secondary"
                onClick={handleVerifyDonation}
                disabled={loading}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {loading ? 'Processing...' : 'Verify Donation Complete'}
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video rounded-md overflow-hidden bg-muted mb-6">
                  <img
                    src={donation.images[0] || '/placeholder.svg'}
                    alt={donation.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-zerowaste-textLight">{donation.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-zerowaste-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-zerowaste-textLight">{donation.location.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-zerowaste-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Expiry Time</h3>
                      <p className="text-zerowaste-textLight">{formatDate(donation.expiry)}</p>
                      <p className={`text-sm ${donation.status === 'expired' ? 'text-red-500' : 'text-amber-600'} font-medium`}>
                        {calculateTimeRemaining()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-zerowaste-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Quantity</h3>
                      <p className="text-zerowaste-textLight">{donation.quantity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    {donation.foodType === 'veg' ? (
                      <Leaf className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <Drumstick className="h-5 w-5 text-amber-600 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-medium">Food Type</h3>
                      <p className="text-zerowaste-textLight">
                        {donation.foodType === 'veg' ? 'Vegetarian' : 'Non-vegetarian'}, 
                        {donation.perishable ? ' Perishable' : ' Non-perishable'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Status Timeline</h2>
                  <div className="relative pl-6 border-l border-muted-foreground/30 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[25px] p-1 rounded-full bg-yellow-100 border-2 border-yellow-300">
                        <PlusCircle className="h-3 w-3 text-yellow-600" />
                      </div>
                      <h3 className="font-medium">Posted</h3>
                      <p className="text-sm text-muted-foreground">{formatDate(donation.createdAt)}</p>
                      <p className="text-sm">Donation was created by {donation.donorName}.</p>
                    </div>
                    
                    {donation.status !== 'pending' && donation.acceptedBy && (
                      <div className="relative">
                        <div className="absolute -left-[25px] p-1 rounded-full bg-blue-100 border-2 border-blue-300">
                          <Calendar className="h-3 w-3 text-blue-600" />
                        </div>
                        <h3 className="font-medium">Accepted</h3>
                        <p className="text-sm text-muted-foreground">{formatDate(donation.updatedAt)}</p>
                        <p className="text-sm">
                          Accepted by {donation.acceptedBy.name} 
                          {donation.acceptedBy.organization && ` (${donation.acceptedBy.organization})`}.
                        </p>
                      </div>
                    )}
                    
                    {(donation.status === 'picked' || donation.status === 'verified') && (
                      <div className="relative">
                        <div className="absolute -left-[25px] p-1 rounded-full bg-purple-100 border-2 border-purple-300">
                          <CheckCircle className="h-3 w-3 text-purple-600" />
                        </div>
                        <h3 className="font-medium">Picked Up</h3>
                        <p className="text-sm text-muted-foreground">{formatDate(donation.updatedAt)}</p>
                        <p className="text-sm">
                          Food was picked up by {donation.acceptedBy?.name}.
                        </p>
                      </div>
                    )}
                    
                    {donation.status === 'verified' && (
                      <div className="relative">
                        <div className="absolute -left-[25px] p-1 rounded-full bg-green-100 border-2 border-green-300">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <h3 className="font-medium">Verified</h3>
                        <p className="text-sm text-muted-foreground">{formatDate(donation.updatedAt)}</p>
                        <p className="text-sm">
                          Donation was verified as complete.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Donor Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-zerowaste-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Name</h3>
                      <p className="text-zerowaste-textLight">{donation.donorName}</p>
                    </div>
                  </div>
                  
                  {donation.donorOrganization && (
                    <div className="flex items-start gap-2">
                      <Building className="h-5 w-5 text-zerowaste-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Organization</h3>
                        <p className="text-zerowaste-textLight">{donation.donorOrganization}</p>
                      </div>
                    </div>
                  )}
                  
                  {donation.status === 'accepted' && user?.id === donation.acceptedBy?.id && (
                    <div className="flex items-start gap-2">
                      <Phone className="h-5 w-5 text-zerowaste-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Contact</h3>
                        <p className="text-zerowaste-textLight">+1 (555) 123-4567</p>
                        <p className="text-xs text-muted-foreground">
                          Contact information is available after accepting the donation
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator className="my-6" />
                
                {donation.acceptedBy && donation.status !== 'pending' && (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Receiver Information</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <User className="h-5 w-5 text-zerowaste-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium">Name</h3>
                          <p className="text-zerowaste-textLight">{donation.acceptedBy.name}</p>
                        </div>
                      </div>
                      
                      {donation.acceptedBy.organization && (
                        <div className="flex items-start gap-2">
                          <Building className="h-5 w-5 text-zerowaste-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Organization</h3>
                            <p className="text-zerowaste-textLight">{donation.acceptedBy.organization}</p>
                          </div>
                        </div>
                      )}
                      
                      {donation.donorId === user?.id && (
                        <div className="flex items-start gap-2">
                          <Phone className="h-5 w-5 text-zerowaste-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Contact</h3>
                            <p className="text-zerowaste-textLight">+1 (555) 987-6543</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    asChild
                  >
                    <Link to={`/dashboard`}>
                      Back to Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlusCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 8v8M8 12h8"/>
  </svg>
);

export default FoodDetails;
