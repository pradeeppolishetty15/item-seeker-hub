
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { searchItems, LostItem } from "@/services/itemsService";
import { ArrowLeft, Search } from "lucide-react";

const ViewLostItemPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [timestamp, setTimestamp] = useState("");
  const [description, setDescription] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LostItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    try {
      const results = await searchItems(timestamp, description);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error("Error searching items:", error);
    } finally {
      setIsSearching(false);
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
            <h1 className="text-2xl font-bold text-gray-900">Find Lost Items</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="text-center">Search for Lost Items</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timestamp">When was it lost?</Label>
                <Input
                  id="timestamp"
                  type="date"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description of the object</Label>
                <Input
                  id="description"
                  placeholder="Type of object, color, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {hasSearched && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            
            {searchResults.length === 0 ? (
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-gray-600">
                    No items found matching your search criteria.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {searchResults.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 bg-gray-100">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-4">
                        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Color</p>
                            <p>{item.color}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Brand</p>
                            <p>{item.brand}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Lost on</p>
                            <p>{new Date(item.timestamp).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Location</p>
                            <p>{item.location}</p>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="flex justify-end">
                          <Button 
                            onClick={() => navigate(`/item/${item.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewLostItemPage;
