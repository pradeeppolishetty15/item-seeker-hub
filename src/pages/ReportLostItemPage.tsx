
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addItem } from "@/services/itemsService";
import { ArrowLeft, Upload } from "lucide-react";

const ReportLostItemPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("/placeholder.svg"); // Default placeholder image
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, you would handle file upload to a server
    // For now, we'll just set a placeholder image
    if (e.target.files && e.target.files[0]) {
      setImage("/placeholder.svg");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate("/login");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addItem({
        name,
        description,
        color,
        brand,
        uniqueId,
        timestamp,
        location,
        image,
        reportedBy: {
          id: user.id,
          name: user.name || user.email,
          email: user.email
        }
      });
      
      navigate("/home");
    } catch (error) {
      console.error("Error reporting item:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={() => navigate("/home")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Report Lost Item</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Submit Lost Item Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Image of Item</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500">
                  Upload a clear photo of your lost item to help others identify it.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Name of Item</Label>
                <Input
                  id="name"
                  placeholder="e.g., Blue Nike Backpack"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    placeholder="e.g., Blue"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Nike"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description of object</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about your item (size, distinctive features, etc.)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="uniqueId">Unique Identification (if any)</Label>
                <Input
                  id="uniqueId"
                  placeholder="e.g., Serial number, personalization, or distinctive mark"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timestamp">When was it lost?</Label>
                  <Input
                    id="timestamp"
                    type="date"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Where was it lost?</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Central Park, Main Street"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Report Lost Item
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ReportLostItemPage;
