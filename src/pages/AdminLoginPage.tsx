
import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
        <p className="text-gray-600">Login to manage lost and found items.</p>
      </div>
      
      <LoginForm isAdmin={true} />
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">Not an admin?</p>
        <Button 
          variant="outline" 
          onClick={() => navigate("/login")}
        >
          Go to User Login
        </Button>
      </div>
    </div>
  );
};

export default AdminLoginPage;
