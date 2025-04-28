
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAllIssues, getItemById, updateIssueStatus, ItemIssue } from "@/services/itemsService";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const AdminIssuesPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [issues, setIssues] = useState<ItemIssue[]>([]);
  const [itemsCache, setItemsCache] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<ItemIssue | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const issuesData = await getAllIssues();
        setIssues(issuesData);
        
        // Fetch items for each issue
        const itemIds = [...new Set(issuesData.map(issue => issue.itemId))];
        const items: {[key: string]: any} = {};
        
        for (const itemId of itemIds) {
          const item = await getItemById(itemId);
          if (item) {
            items[itemId] = item;
          }
        }
        
        setItemsCache(items);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIssues();
  }, []);

  const handleUpdateStatus = async (id: string, status: ItemIssue["status"]) => {
    setIsUpdating(true);
    try {
      const updatedIssue = await updateIssueStatus(id, status);
      if (updatedIssue) {
        setIssues(issues.map(issue => 
          issue.id === id ? updatedIssue : issue
        ));
        setSelectedIssue(null);
      }
    } catch (error) {
      console.error("Error updating issue status:", error);
    } finally {
      setIsUpdating(false);
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
            <h1 className="text-2xl font-bold text-gray-900">Manage Issues</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Card className="p-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Raised Issues</h2>
            <p className="text-gray-600">
              Review and resolve issues raised by users claiming ownership of items.
            </p>
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No issues have been reported yet.</p>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Claim Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Claimed By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                            {itemsCache[issue.itemId] && (
                              <img 
                                src={itemsCache[issue.itemId].image} 
                                alt={itemsCache[issue.itemId].name} 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p>{itemsCache[issue.itemId]?.name || "Unknown Item"}</p>
                            <p className="text-xs text-gray-500">{itemsCache[issue.itemId]?.brand || ""}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate">{issue.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          issue.status === 'pending' 
                            ? 'outline'
                            : issue.status === 'approved'
                            ? 'default'
                            : 'destructive'
                        }>
                          {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p>{issue.userName}</p>
                        <p className="text-xs text-gray-500">{issue.userEmail}</p>
                      </TableCell>
                      <TableCell>
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setSelectedIssue(issue)}
                            >
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            {selectedIssue && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>Review Claim</DialogTitle>
                                  <DialogDescription>
                                    Review the claim for item "{itemsCache[selectedIssue.itemId]?.name || "Unknown Item"}"
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="py-4">
                                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="sm:w-1/3">
                                      <img 
                                        src={itemsCache[selectedIssue.itemId]?.image || "/placeholder.svg"} 
                                        alt={itemsCache[selectedIssue.itemId]?.name || "Item"} 
                                        className="rounded-md w-full h-auto object-cover"
                                      />
                                    </div>
                                    <div className="sm:w-2/3">
                                      <h3 className="font-medium mb-2">{itemsCache[selectedIssue.itemId]?.name || "Unknown Item"}</h3>
                                      <p className="text-sm text-gray-600 mb-2">{itemsCache[selectedIssue.itemId]?.description}</p>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                          <span className="text-gray-500">Brand:</span> {itemsCache[selectedIssue.itemId]?.brand}
                                        </div>
                                        <div>
                                          <span className="text-gray-500">Color:</span> {itemsCache[selectedIssue.itemId]?.color}
                                        </div>
                                        <div>
                                          <span className="text-gray-500">Reported by:</span> {itemsCache[selectedIssue.itemId]?.reportedBy.name}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                                    <h4 className="font-medium mb-2">Claim Details</h4>
                                    <p className="text-sm mb-4">{selectedIssue.description}</p>
                                    
                                    <div className="text-sm">
                                      <p><span className="text-gray-500">Claimed by:</span> {selectedIssue.userName}</p>
                                      <p><span className="text-gray-500">Contact email:</span> {selectedIssue.userEmail}</p>
                                      <p><span className="text-gray-500">Date submitted:</span> {new Date(selectedIssue.createdAt).toLocaleString()}</p>
                                    </div>
                                  </div>
                                  
                                  {selectedIssue.proof && (
                                    <div className="mb-4">
                                      <h4 className="font-medium mb-2">Proof Provided</h4>
                                      <img 
                                        src={selectedIssue.proof} 
                                        alt="Proof" 
                                        className="rounded-md max-h-48 object-contain"
                                      />
                                    </div>
                                  )}
                                </div>
                                
                                <DialogFooter>
                                  <div className="flex w-full justify-between">
                                    <Button
                                      variant="destructive"
                                      disabled={isUpdating || selectedIssue.status !== 'pending'}
                                      onClick={() => handleUpdateStatus(selectedIssue.id, 'rejected')}
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject Claim
                                    </Button>
                                    <Button
                                      className="bg-green-600 hover:bg-green-700"
                                      disabled={isUpdating || selectedIssue.status !== 'pending'}
                                      onClick={() => handleUpdateStatus(selectedIssue.id, 'approved')}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve Claim
                                    </Button>
                                  </div>
                                </DialogFooter>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
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

export default AdminIssuesPage;
