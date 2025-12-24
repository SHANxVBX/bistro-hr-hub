import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* User Routes */}
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Placeholder routes for other roles - to be expanded */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/finance-dashboard"
              element={
                <ProtectedRoute allowedRoles={['finance']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/boss-dashboard"
              element={
                <ProtectedRoute allowedRoles={['boss']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maintainer-dashboard"
              element={
                <ProtectedRoute allowedRoles={['maintainer']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
