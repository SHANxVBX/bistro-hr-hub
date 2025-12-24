import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LogOut, Clock, Calendar, Wallet, ArrowRight, TrendingUp, ClipboardList } from 'lucide-react';
import { AttendancePanel } from './user/AttendancePanel';
import { LeavePanel } from './user/LeavePanel';
import { ClaimsPanel } from './user/ClaimsPanel';
import { TaskManagement } from './admin/TaskManagement';
import { getGreeting, getGreetingEmoji } from '../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';

export const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<'attendance' | 'leave' | 'claims' | 'tasks'>('attendance');

  if (!user) return null;

  const stats = [
    {
      label: 'Annual Leave',
      value: `${user.alQuota - user.alUsed}`,
      total: user.alQuota,
      color: 'bg-blue-600',
      icon: Calendar,
    },
    {
      label: 'Medical Leave',
      value: `${user.mcQuota - user.mcUsed}`,
      total: user.mcQuota,
      color: 'bg-slate-600',
      icon: Calendar,
    },
    {
      label: 'Claims Balance',
      value: `RM ${user.medicalClaimQuota - user.medicalClaimUsed}`,
      total: user.medicalClaimQuota,
      color: 'bg-emerald-600',
      icon: Wallet,
    },
    {
      label: 'Pending Tasks',
      value: '3', // Mock value
      total: 10,
      color: 'bg-indigo-600',
      icon: ClipboardList,
    },
  ];

  const navigationItems = [
    { id: 'attendance' as const, label: 'Attendance', icon: Clock, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'leave' as const, label: 'Leave', icon: Calendar, color: 'bg-slate-600 hover:bg-slate-700' },
    { id: 'claims' as const, label: 'Claims', icon: Wallet, color: 'bg-emerald-600 hover:bg-emerald-700' },
    { id: 'tasks' as const, label: 'Tasks', icon: ClipboardList, color: 'bg-indigo-600 hover:bg-indigo-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2"
              >
                <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-lg shadow-sm" />
                <span className="text-3xl">{getGreetingEmoji()}</span>
                <div>
                  <h1 className="text-xl sm:text-2xl text-slate-800 font-semibold">
                    {getGreeting()}, {user.name}!
                  </h1>
                  <p className="text-sm text-gray-600">{user.position} • {user.department}</p>
                </div>
              </motion.div>
            </div>
            <Button onClick={logout} variant="outline" size="sm" className="shadow-sm">
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className={`h-1 ${stat.color}`} />
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                    <stat.icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-slate-800">{stat.value}</span>
                    <span className="text-sm text-gray-500">/ {stat.total}</span>
                  </div>
                  <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(parseInt(stat.value.replace('RM ', '')) / stat.total) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.4, duration: 0.6 }}
                      className={`h-full ${stat.color}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Navigation Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden rounded-xl p-6 text-center transition-all duration-300 ${isActive
                  ? `${item.color.split(' ')[0]} text-white shadow-lg`
                  : 'bg-white text-gray-700 shadow-sm hover:shadow-md border border-gray-200'
                  }`}
              >
                <div className="relative z-10">
                  <Icon
                    className={`h-8 w-8 mx-auto mb-2 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-600'
                      }`}
                  />
                  <p
                    className={`text-sm sm:text-base font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-900'
                      }`}
                  >
                    {item.label}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'attendance' && <AttendancePanel userId={user.id} />}
            {activeView === 'leave' && <LeavePanel userId={user.id} userName={user.name} />}
            {activeView === 'claims' && <ClaimsPanel userId={user.id} userName={user.name} />}
            {activeView === 'tasks' && (
              <TaskManagement
                currentUserId={user.id}
                currentUserRole={user.role}
                currentUserName={user.name}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};