
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Auth Pages
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminRegisterPage from "@/pages/AdminRegisterPage";

// User Pages
import HomePage from "@/pages/HomePage";
import ViewLostItemPage from "@/pages/ViewLostItemPage";
import ReportLostItemPage from "@/pages/ReportLostItemPage";
import ItemDetailPage from "@/pages/ItemDetailPage";

// Admin Pages
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminItemsPage from "@/pages/AdminItemsPage";
import AdminIssuesPage from "@/pages/AdminIssuesPage";
import AdminMatchesPage from "@/pages/AdminMatchesPage";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/register" element={<AdminRegisterPage />} />
            
            {/* Protected user routes */}
            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/view-lost-item" element={
              <ProtectedRoute>
                <ViewLostItemPage />
              </ProtectedRoute>
            } />
            <Route path="/report-lost-item" element={
              <ProtectedRoute>
                <ReportLostItemPage />
              </ProtectedRoute>
            } />
            <Route path="/item/:id" element={
              <ProtectedRoute>
                <ItemDetailPage />
              </ProtectedRoute>
            } />
            
            {/* Protected admin routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/items" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminItemsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/issues" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminIssuesPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/matches" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminMatchesPage />
              </ProtectedRoute>
            } />
            
            {/* Redirect root to login or home */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
