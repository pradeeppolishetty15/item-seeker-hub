import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllItems, updateItemStatus, LostItem } from "@/services/itemsService";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const AdminMatchesPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [matchedItems, setMatchedItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await getAllItems();
        setMatchedItems(items.filter(item => item.status === 'matched'));
      } catch (error) {
        console.error("Error fetching matched items:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, []);

  const handleConfirmMatch = async (id: string) => {
    try {
      const updatedItem = await updateItemStatus(id, 'claimed');
      if (updatedItem) {
        setMatchedItems(matchedItems.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Error confirming match:", error);
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
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Matched Items</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Card className="p-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Matched Items</h2>
            <p className="text-gray-600">
              Review items that have been matched with their owners and confirm claims.
            </p>
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading matched items...</p>
          </div>
        ) : matchedItems.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No matched items at this time.</p>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Claimed By</TableHead>
                    <TableHead>Match Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matchedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p>{item.name}</p>
                            <p className="text-xs text-gray-500">{item.brand}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex flex-col space-y-2">
                          <p className="truncate">{item.description}</p>
                          {item.proofImage && item.proofImage !== "/placeholder.svg" && (
                            <img 
                              src={item.proofImage} 
                              alt="Proof" 
                              className="max-h-20 rounded-md cursor-pointer"
                              onClick={() => {
                                window.open(item.proofImage, '_blank');
                              }}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p>{item.reportedBy.name}</p>
                        <p className="text-xs text-gray-500">{item.reportedBy.email}</p>
                      </TableCell>
                      <TableCell>
                        {/* In a real app, this would show the claimant */}
                        <p>John Smith</p>
                        <p className="text-xs text-gray-500">john.smith@example.com</p>
                      </TableCell>
                      <TableCell>
                        {/* In a real app, this would show the match date */}
                        {new Date().toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleConfirmMatch(item.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Match
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminMatchesPage;
