import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { mockUsers, mockLeaveRequests, mockMedicalClaims, mockAttendanceRecords } from '../../data/mockData';
import { Users, Calendar, Wallet, Clock } from 'lucide-react';

export const OverviewPanel: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  
  const stats = {
    totalEmployees: mockUsers.filter((u) => u.role === 'user').length,
    todayAttendance: mockAttendanceRecords.filter((r) => r.date === today).length,
    pendingLeaves: mockLeaveRequests.filter((r) => r.status === 'pending').length,
    pendingClaims: mockMedicalClaims.filter((c) => c.status === 'pending').map((c) => ({
      type: 'Medical Claim',
      user: mockUsers.find((u) => u.id === c.userId)?.name || 'Unknown',
      detail: `RM ${c.amount.toFixed(2)}`,
      date: c.appliedDate,
    })).length,
  };

  const recentActivity = [
    ...mockLeaveRequests.slice(0, 3).map((r) => ({
      type: 'Leave Request',
      user: mockUsers.find((u) => u.id === r.userId)?.name || 'Unknown',
      detail: `${r.type} - ${r.days} days`,
      date: r.appliedDate,
    })),
    ...mockMedicalClaims.slice(0, 2).map((c) => ({
      type: 'Medical Claim',
      user: mockUsers.find((u) => u.id === c.userId)?.name || 'Unknown',
      detail: `RM ${c.amount.toFixed(2)}`,
      date: c.appliedDate,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Today's Attendance</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.todayAttendance}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Pending Leave Requests</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.pendingLeaves}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Pending Claims</CardTitle>
            <Wallet className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.pendingClaims}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{activity.type}</p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{activity.detail}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Employee Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Leave Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockUsers.filter((u) => u.role === 'user').map((user) => (
              <div key={user.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.department} - {user.position}</p>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">AL</p>
                    <p className="font-medium">{user.alQuota - user.alUsed}/{user.alQuota}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">MC</p>
                    <p className="font-medium">{user.mcQuota - user.mcUsed}/{user.mcQuota}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Claims</p>
                    <p className="font-medium">RM {user.medicalClaimQuota - user.medicalClaimUsed}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};