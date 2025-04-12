
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

type UserRole = 'donor' | 'receiver' | 'admin' | null;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>('donor');
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await register(name, email, password, role, organization);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (value: string) => {
    setRole(value as UserRole);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zerowaste-background">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-zerowaste-primary/20 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-zerowaste-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Join ZeroWaste and start making a difference
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name or organization name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>I want to register as</Label>
                <RadioGroup defaultValue="donor" value={role || 'donor'} onValueChange={handleRoleChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="donor" id="donor" />
                    <Label htmlFor="donor">Food Donor (Restaurant, Caterer, Individual)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="receiver" id="receiver" />
                    <Label htmlFor="receiver">Food Receiver (NGO, Shelter, Volunteer)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {role && (
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization Name (Optional)</Label>
                  <Input
                    id="organization"
                    placeholder="Your organization or business name"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-zerowaste-primary hover:bg-zerowaste-secondary"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              
              <p className="text-sm text-center text-zerowaste-textLight">
                Already have an account?{" "}
                <Link to="/login" className="text-zerowaste-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
