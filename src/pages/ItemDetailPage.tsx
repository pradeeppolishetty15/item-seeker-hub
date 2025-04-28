
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getItemById, createIssue } from "@/services/itemsService";
import { ArrowLeft, User, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [issueDescription, setIssueDescription] = useState("");
  const [issueProof, setIssueProof] = useState("/placeholder.svg");
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        const itemData = await getItemById(id);
        setItem(itemData);
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [id]);

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !item) return;
    
    setIsSubmittingIssue(true);
    
    try {
      await createIssue({
        itemId: item.id,
        userId: user.id,
        userName: user.name || user.email,
        userEmail: user.email,
        description: issueDescription,
        proof: issueProof
      });
      
      setIsDialogOpen(false);
      // In a real app, you might want to refresh the item data or redirect
    } catch (error) {
      console.error("Error submitting issue:", error);
    } finally {
      setIsSubmittingIssue(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <CardTitle className="mb-2">Item Not Found</CardTitle>
              <p className="text-gray-600 mb-4">
                The item you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate("/view-lost-item")}>
                Go Back to Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={() => navigate("/view-lost-item")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Item Details</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6">
                <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
                <p className="text-gray-600 mb-6">{item.description}</p>
                
                <div className="grid grid-cols-2 gap-y-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Color</h3>
                    <p>{item.color}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                    <p>{item.brand}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">When Lost</h3>
                    <p>{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Where Lost</h3>
                    <p>{item.location}</p>
                  </div>
                  {item.uniqueId && (
                    <div className="col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">Unique Identification</h3>
                      <p>{item.uniqueId}</p>
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <h3 className="text-sm font-medium text-gray-500">Reported by</h3>
                  </div>
                  <p>{item.reportedBy.name}</p>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">Raise Issue / Claim Item</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Raise Issue or Claim Item</DialogTitle>
                      <DialogDescription>
                        If you believe this is your item, provide additional information to support your claim.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleIssueSubmit}>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label htmlFor="issueDescription">Describe Your Claim</Label>
                          <Textarea
                            id="issueDescription"
                            placeholder="Explain why you believe this is your item and provide any specific details that can verify your claim..."
                            value={issueDescription}
                            onChange={(e) => setIssueDescription(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="proofImage">Upload Proof (if available)</Label>
                          <Input
                            id="proofImage"
                            type="file"
                            accept="image/*"
                            className="cursor-pointer"
                          />
                          <p className="text-xs text-gray-500">
                            Upload a receipt, additional photos, or any other evidence that supports your claim.
                          </p>
                        </div>
                      </div>
                      
                      <DialogFooter className="mt-4">
                        <Button
                          type="submit"
                          disabled={isSubmittingIssue}
                        >
                          {isSubmittingIssue ? "Submitting..." : "Submit Claim"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ItemDetailPage;
