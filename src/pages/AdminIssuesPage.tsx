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
import { toast } from "@/components/ui/use-toast";

const AdminIssuesPage: React.FC = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<ItemIssue[]>([]);
  const [itemsCache, setItemsCache] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState(true);
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
      const issue = issues.find(i => i.id === id);
      if (!issue) return;

      const updatedIssue = await updateIssueStatus(id, status, {
        id: issue.userId,
        name: issue.userName,
        email: issue.userEmail
      });
      
      if (updatedIssue) {
        setIssues(issues.map(issue => 
          issue.id === id ? updatedIssue : issue
        ));

        if (status === 'approved') {
          toast({
            title: "Claim Approved",
            description: "The item has been moved to Matched Items.",
          });
          navigate('/admin/matches');
        }
      }
    } catch (error) {
      console.error("Error updating issue status:", error);
      toast({
        title: "Error",
        description: "Failed to update issue status.",
        variant: "destructive"
      });
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
            <h1 className="text-2xl font-bold text-gray-900">Raised Issues</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Raised Issues</h2>
              <p className="text-gray-600">
                Review and resolve issues raised by users claiming ownership of items.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/admin/matches')}
              variant="outline"
            >
              View Matched Items
            </Button>
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
                      <TableCell>
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
                      <TableCell>
                        <div className="flex flex-col space-y-2">
                          <p className="truncate">{issue.description}</p>
                          {issue.proofImage && issue.proofImage !== "/placeholder.svg" && (
                            <img 
                              src={issue.proofImage} 
                              alt="Proof" 
                              className="max-h-20 rounded-md cursor-pointer"
                              onClick={() => {
                                window.open(issue.proofImage, '_blank');
                              }}
                            />
                          )}
                        </div>
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
                        {issue.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(issue.id, 'rejected')}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(issue.id, 'approved')}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                          </div>
                        )}
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
