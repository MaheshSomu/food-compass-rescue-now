
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Leaf, ArrowRight, Utensils, Users, ArrowUpRight, MapPin } from "lucide-react";

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect logged in users to their respective dashboards
    if (isAuthenticated && user) {
      if (user.role === "donor") {
        navigate("/donor");
      } else if (user.role === "receiver") {
        navigate("/receiver");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-zerowaste-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-bold text-zerowaste-text mb-6">
              Reduce Food Waste, Feed Those in Need
            </h1>
            <p className="text-lg text-zerowaste-textLight mb-8">
              ZeroWaste connects food donors with those who need it most through an 
              intelligent geo-based food rescue platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-zerowaste-primary hover:bg-zerowaste-secondary text-white font-medium py-6 text-lg"
                size="lg"
                asChild
              >
                <Link to="/register">
                  Join as Donor
                  <Utensils className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                variant="outline"
                className="border-zerowaste-primary text-zerowaste-primary hover:bg-zerowaste-primary/10 font-medium py-6 text-lg"
                size="lg"
                asChild
              >
                <Link to="/register">
                  Join as Receiver 
                  <Users className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-zerowaste-accent/20 rounded-full z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-zerowaste-primary/20 rounded-full z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a1?q=80&w=1000&auto=format&fit=crop"
                alt="Food Donation" 
                className="w-full h-auto rounded-lg shadow-lg z-10 relative"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-zerowaste-text">
            How ZeroWaste Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-zerowaste-background rounded-lg">
              <div className="w-12 h-12 bg-zerowaste-primary/20 rounded-full flex items-center justify-center mb-4">
                <Utensils className="h-6 w-6 text-zerowaste-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zerowaste-text">For Donors</h3>
              <p className="text-zerowaste-textLight mb-4">
                Easily post surplus food with details and images. 
                Track your donation from posting to pickup.
              </p>
              <Link 
                to="/register" 
                className="inline-flex items-center text-zerowaste-primary hover:underline"
              >
                Start Donating <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="p-6 bg-zerowaste-background rounded-lg">
              <div className="w-12 h-12 bg-zerowaste-primary/20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-zerowaste-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zerowaste-text">For Recipients</h3>
              <p className="text-zerowaste-textLight mb-4">
                Browse available food on interactive maps.
                Filter by distance and food type to find what you need.
              </p>
              <Link 
                to="/register" 
                className="inline-flex items-center text-zerowaste-primary hover:underline"
              >
                Find Food <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="p-6 bg-zerowaste-background rounded-lg">
              <div className="w-12 h-12 bg-zerowaste-primary/20 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-zerowaste-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zerowaste-text">Geo-Intelligence</h3>
              <p className="text-zerowaste-textLight mb-4">
                Real-time maps show available food near you.
                Smart routing helps optimize pickup routes.
              </p>
              <Link 
                to="/register" 
                className="inline-flex items-center text-zerowaste-primary hover:underline"
              >
                View Map <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section with Additional Food Images */}
      <section className="py-16 px-4 bg-zerowaste-primary/10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-zerowaste-text">Our Impact</h2>
          
          <div className="grid sm:grid-cols-3 gap-8 mb-12">
            <div className="p-6 text-center">
              <h3 className="text-4xl font-bold text-zerowaste-primary mb-2">5,000+</h3>
              <p className="text-zerowaste-textLight">Meals Rescued</p>
            </div>
            
            <div className="p-6 text-center">
              <h3 className="text-4xl font-bold text-zerowaste-primary mb-2">2,500+</h3>
              <p className="text-zerowaste-textLight">People Fed</p>
            </div>
            
            <div className="p-6 text-center">
              <h3 className="text-4xl font-bold text-zerowaste-primary mb-2">3.2 tons</h3>
              <p className="text-zerowaste-textLight">CO₂ Emissions Prevented</p>
            </div>
          </div>
          
          {/* Food Donation Images Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=500&auto=format&fit=crop" 
                alt="Food donation item" 
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1608032364895-84e0dcca9fa1?q=80&w=500&auto=format&fit=crop" 
                alt="Food donation item" 
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=500&auto=format&fit=crop" 
                alt="Food donation item" 
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=500&auto=format&fit=crop" 
                alt="Food donation item" 
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-zerowaste-text">Ready to Make a Difference?</h2>
          <p className="text-lg text-zerowaste-textLight mb-8 max-w-2xl mx-auto">
            Join our community of food rescuers today and help reduce food waste while feeding those in need.
          </p>
          <Button 
            className="bg-zerowaste-primary hover:bg-zerowaste-secondary text-white font-medium"
            size="lg"
            asChild
          >
            <Link to="/register">
              Get Started
              <ArrowUpRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 flex items-center">
              <Leaf className="h-6 w-6 text-zerowaste-primary mr-2" />
              <span className="font-bold text-lg text-zerowaste-primary">ZeroWaste</span>
            </div>
            
            <div className="text-sm text-zerowaste-textLight">
              &copy; {new Date().getFullYear()} ZeroWaste. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
