
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Upload } from "lucide-react";

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Item Seeker Hub</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hello, {user?.name || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Item Seeker Hub</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A place where you can report lost items and find things that have been lost.
            Our platform connects people who have lost items with those who have found them.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Search className="w-6 h-6 text-primary" />
                <span>View Lost Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Looking for something you've lost? Search through our database of found items to 
                see if someone has found what you're looking for.
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button 
                className="w-full" 
                onClick={() => navigate("/view-lost-item")}
              >
                Find Your Item
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Upload className="w-6 h-6 text-primary" />
                <span>Report Lost Item</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Have you lost something? Report details about your lost item so we can help you 
                find it or notify you if someone finds it.
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button 
                className="w-full" 
                onClick={() => navigate("/report-lost-item")}
              >
                Report an Item
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-100 mt-16">
        <div className="container mx-auto py-6 px-4">
          <p className="text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Item Seeker Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
