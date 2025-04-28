
import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "@/components/RegisterForm";
import { Button } from "@/components/ui/button";

const AdminRegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Registration</h1>
        <p className="text-gray-600">Create an admin account to manage the lost and found system.</p>
      </div>
      
      <RegisterForm isAdmin={true} />
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">Need to register as a regular user?</p>
        <Button 
          variant="outline" 
          onClick={() => navigate("/register")}
        >
          User Registration
        </Button>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
