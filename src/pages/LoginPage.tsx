
import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Item Seeker Hub</h1>
        <p className="text-gray-600">Find what you've lost or help others find theirs.</p>
      </div>
      
      <LoginForm />
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">Are you an admin?</p>
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin/login")}
        >
          Go to Admin Login
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
