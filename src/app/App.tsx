import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { FinanceDashboard } from './components/FinanceDashboard';
import { BossDashboard } from './components/BossDashboard';
import { MaintainerDashboard } from './components/MaintainerDashboard';
import { Toaster } from './components/ui/sonner';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  // Route based on user role
  switch (user.role) {
    case 'maintainer':
      return <MaintainerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'finance':
      return <FinanceDashboard />;
    case 'boss':
      return <BossDashboard />;
    case 'user':
      return <UserDashboard />;
    default:
      return <Login />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}
