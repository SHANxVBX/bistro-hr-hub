import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { LogOut, LayoutDashboard, Users, Calendar, Wallet, ClipboardList, ArrowRight } from 'lucide-react';
import { OverviewPanel } from './admin/OverviewPanel';
import { AttendanceManagement } from './admin/AttendanceManagement';
import { LeaveManagement } from './admin/LeaveManagement';
import { ClaimsManagement } from './admin/ClaimsManagement';
import { TaskManagement } from './admin/TaskManagement';
import { PersonalTodo } from './admin/PersonalTodo';
import { StaffRegistration } from './admin/StaffRegistration';
import { AnnualLeaveBreakdown } from './admin/AnnualLeaveBreakdown';
import { StaffDatabase } from './shared/StaffDatabase';
import { getGreeting, getGreetingEmoji } from '../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'attendance' | 'leave' | 'claims' | 'registration' | 'annual-leave' | 'staff-db'>('overview');

  if (!user) return null;

  const navigationItems = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: LayoutDashboard,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Dashboard summary'
    },
    {
      id: 'registration' as const,
      label: 'Staff Registration',
      icon: Users, // Reusing Users icon or import UserPlus if available
      color: 'bg-indigo-600 hover:bg-indigo-700',
      description: 'Register new employees'
    },
    {
      id: 'attendance' as const,
      label: 'Attendance',
      icon: Users,
      color: 'bg-slate-600 hover:bg-slate-700',
      description: 'Track employee attendance'
    },
    {
      id: 'leave' as const,
      label: 'Leave Requests',
      icon: Calendar,
      color: 'bg-emerald-600 hover:bg-emerald-700',
      description: 'View leave applications'
    },
    {
      id: 'annual-leave' as const,
      label: 'Annual Leave (AL)',
      icon: Calendar,
      color: 'bg-teal-600 hover:bg-teal-700',
      description: 'Leave breakdown & reports'
    },
    {
      id: 'claims' as const,
      label: 'Medical Claims',
      icon: Wallet,
      color: 'bg-amber-600 hover:bg-amber-700',
      description: 'Process claims'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-lg shadow-sm" />
              <span className="text-4xl">{getGreetingEmoji()}</span>
              <div>
                <h1 className="text-2xl sm:text-3xl text-slate-800 font-semibold">
                  {getGreeting()}, {user.name}!
                </h1>
                <p className="text-sm text-gray-600">HR Admin • Mallar Bistro</p>
              </div>
            </motion.div>
            <Button onClick={logout} variant="outline" size="sm" className="shadow-sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Todo */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <PersonalTodo userId={user.id} />
            <TaskManagement
              currentUserId={user.id}
              currentUserRole={user.role}
              currentUserName={user.name}
            />
          </motion.div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Navigation Cards */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index + 0.4 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300 ${isActive
                      ? `${item.color.split(' ')[0]} text-white shadow-lg`
                      : 'bg-white text-gray-700 shadow-sm hover:shadow-md border border-gray-200'
                      }`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <Icon
                          className={`h-8 w-8 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-600'
                            }`}
                        />
                        <ArrowRight
                          className={`h-5 w-5 transition-all duration-300 ${isActive ? 'text-white translate-x-0 opacity-100' : 'text-gray-400 -translate-x-2 opacity-0'
                            }`}
                        />
                      </div>
                      <h3
                        className={`text-lg font-semibold mb-1 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-900'
                          }`}
                      >
                        {item.label}
                      </h3>
                      <p
                        className={`text-sm transition-colors duration-300 ${isActive ? 'text-white/90' : 'text-gray-600'
                          }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Content Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeView === 'overview' && <OverviewPanel />}
                {activeView === 'registration' && <StaffRegistration />}
                {activeView === 'attendance' && <AttendanceManagement />}
                {activeView === 'leave' && <LeaveManagement />}
                {activeView === 'annual-leave' && <AnnualLeaveBreakdown />}
                {activeView === 'staff-db' && <StaffDatabase />}
                {activeView === 'claims' && <ClaimsManagement />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};