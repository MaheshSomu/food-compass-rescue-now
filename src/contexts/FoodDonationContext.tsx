
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

export interface FoodDonation {
  id: string;
  donorId: string;
  donorName: string;
  donorOrganization?: string;
  title: string;
  description: string;
  quantity: string;
  foodType: 'veg' | 'non-veg';
  perishable: boolean;
  expiry: string;
  images: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'pending' | 'accepted' | 'picked' | 'verified' | 'expired';
  createdAt: string;
  updatedAt: string;
  acceptedBy?: {
    id: string;
    name: string;
    organization?: string;
  };
}

interface FoodDonationContextType {
  donations: FoodDonation[];
  userDonations: FoodDonation[];
  addDonation: (donation: Omit<FoodDonation, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDonationStatus: (id: string, status: FoodDonation['status'], receiverId?: string, receiverName?: string, receiverOrg?: string) => Promise<void>;
  getDonationById: (id: string) => FoodDonation | undefined;
}

const FoodDonationContext = createContext<FoodDonationContextType | undefined>(undefined);

// Sample mock data
const MOCK_DONATIONS: FoodDonation[] = [
  {
    id: '1',
    donorId: '1',
    donorName: 'Green Restaurant',
    donorOrganization: 'Green Restaurant',
    title: 'Fresh Vegetables',
    description: 'Assorted fresh vegetables from our kitchen. Includes tomatoes, lettuce, and carrots.',
    quantity: '5 kg',
    foodType: 'veg',
    perishable: true,
    expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    images: [
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=500&auto=format&fit=crop'
    ],
    location: {
      lat: 40.712776,
      lng: -74.005974,
      address: '123 Main St, New York, NY 10001'
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    donorId: '1',
    donorName: 'Green Restaurant',
    donorOrganization: 'Green Restaurant',
    title: 'Leftover Pasta',
    description: 'Unused pasta from today\'s service. Still fresh and packaged properly.',
    quantity: '3 kg',
    foodType: 'veg',
    perishable: true,
    expiry: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
    images: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=500&auto=format&fit=crop'
    ],
    location: {
      lat: 40.732776,
      lng: -74.015974,
      address: '456 Park Ave, New York, NY 10002'
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    donorId: '4',
    donorName: 'Family Cafe',
    donorOrganization: 'Family Cafe',
    title: 'Bread and Pastries',
    description: 'End-of-day bread and pastries. Still fresh.',
    quantity: '2 kg',
    foodType: 'veg',
    perishable: true,
    expiry: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(), // 36 hours from now
    images: [
      'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=500&auto=format&fit=crop'
    ],
    location: {
      lat: 40.752776,
      lng: -74.025974,
      address: '789 Broadway, New York, NY 10003'
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const FoodDonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [donations, setDonations] = useState<FoodDonation[]>(MOCK_DONATIONS);
  const [userDonations, setUserDonations] = useState<FoodDonation[]>([]);
  
  // In a real app, we would fetch user donations from an API
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const { id } = JSON.parse(user);
      setUserDonations(donations.filter(donation => donation.donorId === id));
    }
  }, [donations]);

  const addDonation = async (donation: Omit<FoodDonation, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const now = new Date().toISOString();
      const newDonation: FoodDonation = {
        ...donation,
        id: (donations.length + 1).toString(),
        status: 'pending',
        createdAt: now,
        updatedAt: now
      };
      
      setDonations(prev => [...prev, newDonation]);
      
      toast({
        title: "Donation added",
        description: "Your food donation has been posted successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to add donation",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const updateDonationStatus = async (
    id: string, 
    status: FoodDonation['status'], 
    receiverId?: string, 
    receiverName?: string, 
    receiverOrg?: string
  ) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDonations(prev => 
        prev.map(donation => {
          if (donation.id === id) {
            const updated = { 
              ...donation, 
              status, 
              updatedAt: new Date().toISOString() 
            };
            
            if (status === 'accepted' && receiverId && receiverName) {
              updated.acceptedBy = {
                id: receiverId,
                name: receiverName,
                organization: receiverOrg
              };
            }
            
            return updated;
          }
          return donation;
        })
      );
      
      toast({
        title: "Status updated",
        description: `Donation status updated to ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const getDonationById = (id: string) => {
    return donations.find(donation => donation.id === id);
  };

  return (
    <FoodDonationContext.Provider 
      value={{ 
        donations, 
        userDonations, 
        addDonation, 
        updateDonationStatus, 
        getDonationById 
      }}
    >
      {children}
    </FoodDonationContext.Provider>
  );
};

export const useFoodDonations = () => {
  const context = useContext(FoodDonationContext);
  if (context === undefined) {
    throw new Error('useFoodDonations must be used within a FoodDonationProvider');
  }
  return context;
};
