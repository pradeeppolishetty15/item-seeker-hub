
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, AlertTriangle, CheckSquare, LogOut } from "lucide-react";

const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Admin: {user?.name || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage all aspects of the lost and found system. Review items, handle issues, 
            and validate matched claims.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Uploaded Items</span>
              </CardTitle>
              <CardDescription>
                View and manage all reported lost items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Access the complete database of lost items. Review details, delete invalid 
                entries, and manage the status of each item.
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button 
                className="w-full" 
                onClick={() => navigate("/admin/items")}
              >
                View All Items
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <span>Raised Issues</span>
              </CardTitle>
              <CardDescription>
                Handle user claims and disputes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Review issues raised by users claiming ownership of items. Validate 
                evidence and resolve disputes between parties.
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button 
                className="w-full" 
                onClick={() => navigate("/admin/issues")}
              >
                Manage Issues
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-primary" />
                <span>Matched Items</span>
              </CardTitle>
              <CardDescription>
                Review and confirm ownership matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                View items that have potential matches. Verify claims, confirm matches, 
                and facilitate the return of lost items to their owners.
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button 
                className="w-full" 
                onClick={() => navigate("/admin/matches")}
              >
                Review Matches
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-100 mt-16">
        <div className="container mx-auto py-6 px-4">
          <p className="text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Item Seeker Hub - Admin Console. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboardPage;
