import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockLeaveRequests, mockUsers, mockAttendanceRecords, mockTasks, LeaveRequest, Task } from '../data/mockData';
import { LogOut, Check, X, FileText, Calendar, Users, TrendingUp, ArrowRight, ClipboardList, ListTodo, Plus, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getGreeting, getGreetingEmoji } from '../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';
import { StaffDatabase } from './shared/StaffDatabase';

export const BossDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);
  const [tasks, setTasks] = useState(mockTasks);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as Task['priority'],
    dueDate: '',
  });
  const [activeView, setActiveView] = useState<'leave-approval' | 'attendance' | 'leave-summary' | 'staff-db' | 'tasks'>('leave-approval');

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      assignedBy: user?.id || '',
      status: 'pending',
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setTasks([task, ...tasks]);
    toast.success('Task assigned successfully');
    setIsTaskDialogOpen(false);
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.success('Task deleted');
  };

  const handleApproveLeave = (id: string) => {
    setLeaveRequests(
      leaveRequests.map((req) =>
        req.id === id
          ? { ...req, status: 'approved' as const, approvedBy: user?.id, approvedDate: new Date().toISOString().split('T')[0] }
          : req
      )
    );
    toast.success('Leave request approved');
  };

  const handleRejectLeave = (id: string) => {
    setLeaveRequests(
      leaveRequests.map((req) =>
        req.id === id
          ? { ...req, status: 'rejected' as const, approvedBy: user?.id, approvedDate: new Date().toISOString().split('T')[0] }
          : req
      )
    );
    toast.success('Leave request rejected');
  };

  const pendingLeaves = leaveRequests.filter((r) => r.status === 'pending');

  const getStatusColor = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case 'AL':
        return 'Annual Leave';
      case 'MC':
        return 'Medical Leave';
      case 'EL':
        return 'Emergency Leave';
      default:
        return type;
    }
  };

  if (!user) return null;

  const stats = [
    {
      label: 'Total Employees',
      value: mockUsers.filter((u) => u.role === 'user').length,
      color: 'bg-blue-600',
      icon: Users,
    },
    {
      label: "Today's Attendance",
      value: mockAttendanceRecords.filter(
        (r) => r.date === new Date().toISOString().split('T')[0]
      ).length,
      color: 'bg-emerald-600',
      icon: TrendingUp,
    },
    {
      label: 'Pending Approvals',
      value: pendingLeaves.length,
      color: 'bg-amber-600',
      icon: Calendar,
    },
  ];

  const navigationItems = [
    { id: 'leave-approval' as const, label: 'Leave Approval', icon: Check, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'tasks' as const, label: 'Task Management', icon: ListTodo, color: 'bg-orange-600 hover:bg-orange-700' },
    { id: 'attendance' as const, label: 'Attendance', icon: Users, color: 'bg-slate-600 hover:bg-slate-700' },
    { id: 'leave-summary' as const, label: 'Leave Summary', icon: Calendar, color: 'bg-emerald-600 hover:bg-emerald-700' },
    { id: 'staff-db' as const, label: 'Staff Database', icon: ClipboardList, color: 'bg-violet-600 hover:bg-violet-700' },
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
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-lg shadow-sm" />
              <span className="text-4xl">{getGreetingEmoji()}</span>
              <div>
                <h1 className="text-xl sm:text-3xl text-slate-800 font-semibold">
                  {getGreeting()}, {user.name}!
                </h1>
                <p className="text-sm text-gray-600">CEO • Mallar Bistro</p>
              </div>
            </motion.div>
            <Button onClick={logout} variant="outline" size="sm" className="shadow-sm">
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`h-2 ${stat.color}`} />
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <stat.icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                    className="text-4xl"
                  >
                    {stat.value}
                  </motion.div>
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
          className="grid grid-cols-3 gap-3 sm:gap-4"
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 ${isActive
                  ? 'shadow-xl ring-2 ring-slate-500'
                  : 'bg-white shadow-md hover:shadow-lg'
                  }`}
              >
                <div
                  className={`absolute inset-0 ${item.color} transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                />
                <div className="relative z-10">
                  <Icon
                    className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-600'
                      }`}
                  />
                  <p
                    className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-900'
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
            {activeView === 'leave-approval' && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-slate-700 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Leave Requests for Approval
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {pendingLeaves.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <div className="text-6xl mb-4">✅</div>
                        <p className="text-gray-500">No pending leave requests</p>
                      </motion.div>
                    ) : (
                      pendingLeaves.map((request, index) => {
                        const employee = mockUsers.find((u) => u.id === request.userId);
                        return (
                          <motion.div
                            key={request.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="border-2 hover:border-slate-400 transition-all duration-300 overflow-hidden">
                              <div className="h-1 bg-slate-600" />
                              <CardContent className="pt-6 space-y-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-lg font-semibold">{employee?.name}</p>
                                    <p className="text-sm text-gray-600">
                                      {employee?.department} • {employee?.position}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {getLeaveTypeLabel(request.type)}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl">
                                  <div>
                                    <p className="text-xs text-gray-600">Start Date</p>
                                    <p className="font-semibold">{request.startDate}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600">End Date</p>
                                    <p className="font-semibold">{request.endDate}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600">Duration</p>
                                    <p className="font-semibold">{request.days} day(s)</p>
                                  </div>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-xl">
                                  <p className="text-xs text-gray-600 mb-1">Reason</p>
                                  <p className="text-sm">{request.reason}</p>
                                </div>

                                {request.documentUrl && (
                                  <div className="flex items-center gap-2 text-sm text-blue-600 p-3 bg-blue-50 rounded-lg">
                                    <FileText className="h-4 w-4" />
                                    <span>{request.documentUrl}</span>
                                  </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                  <Button
                                    onClick={() => handleApproveLeave(request.id)}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                    size="lg"
                                  >
                                    <Check className="mr-2 h-5 w-5" />
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => handleRejectLeave(request.id)}
                                    variant="destructive"
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                    size="lg"
                                  >
                                    <X className="mr-2 h-5 w-5" />
                                    Reject
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeView === 'attendance' && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-slate-700 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Today's Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {mockAttendanceRecords
                      .filter((r) => r.date === new Date().toISOString().split('T')[0])
                      .map((record, index) => {
                        const employee = mockUsers.find((u) => u.id === record.userId);
                        return (
                          <motion.div
                            key={record.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="border hover:border-slate-400 transition-all">
                              <CardContent className="pt-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-semibold">{employee?.name}</p>
                                    <p className="text-sm text-gray-600">
                                      {employee?.department}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3 sm:gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-600">In:</span>{' '}
                                      <span className="font-medium">{record.checkIn || '-'}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Out:</span>{' '}
                                      <span className="font-medium">{record.checkOut || '-'}</span>
                                    </div>
                                    <Badge variant="outline">{record.status}</Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeView === 'leave-summary' && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-slate-700 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Employee Leave Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {mockUsers
                      .filter((u) => u.role === 'user')
                      .map((employee, index) => (
                        <motion.div
                          key={employee.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border hover:border-slate-400 transition-all">
                            <CardContent className="pt-4">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                  <p className="font-semibold">{employee.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {employee.department} • {employee.position}
                                  </p>
                                </div>
                                <div className="flex gap-6 text-sm">
                                  <div className="text-center">
                                    <p className="text-xs text-gray-600">AL Used</p>
                                    <p className="text-lg font-semibold">
                                      {employee.alUsed}/{employee.alQuota}
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-gray-600">MC Used</p>
                                    <p className="text-lg font-semibold">
                                      {employee.mcUsed}/{employee.mcQuota}
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-gray-600">AL Left</p>
                                    <p className="text-lg font-semibold text-green-600">
                                      {employee.alQuota - employee.alUsed}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeView === 'staff-db' && (
              <StaffDatabase />
            )}

            {activeView === 'tasks' && (
              <div className="space-y-6">
                {/* Task Creation Header */}
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Task Management</h2>
                  <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Assign New Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign New Task</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Task Title</Label>
                          <Input
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            placeholder="e.g., Update Inventory"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            placeholder="Enter task details..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Assign To</Label>
                            <Select
                              value={newTask.assignedTo}
                              onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select staff" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockUsers
                                  .filter(u => u.role !== 'boss')
                                  .map(u => (
                                    <SelectItem key={u.id} value={u.id}>{u.name} ({u.role})</SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select
                              value={newTask.priority}
                              onValueChange={(value: Task['priority']) => setNewTask({ ...newTask, priority: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Due Date</Label>
                          <Input
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          />
                        </div>
                        <Button onClick={handleCreateTask} className="w-full bg-orange-600 hover:bg-orange-700">
                          Assign Task
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Task Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {['pending', 'in-progress', 'completed'].map((status) => {
                    const statusTasks = tasks.filter(t => t.status === status);
                    const bgColor =
                      status === 'pending' ? 'bg-amber-50' :
                        status === 'in-progress' ? 'bg-blue-50' :
                          'bg-green-50';
                    const titleColor =
                      status === 'pending' ? 'text-amber-800' :
                        status === 'in-progress' ? 'text-blue-800' :
                          'text-green-800';

                    return (
                      <Card key={status} className={bgColor + " border-0"}>
                        <CardHeader className="pb-2">
                          <CardTitle className={`text-base font-bold capitalize flex items-center gap-2 ${titleColor}`}>
                            {status === 'in-progress' ? <Clock className="w-4 h-4" /> :
                              status === 'pending' ? <AlertCircle className="w-4 h-4" /> :
                                <Check className="w-4 h-4" />}
                            {status.replace('-', ' ')}
                            <Badge variant="secondary" className="ml-auto bg-white/50">{statusTasks.length}</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {statusTasks.length === 0 ? (
                            <div className="text-center py-4 text-gray-400 text-sm italic">
                              No {status.replace('-', ' ')} tasks
                            </div>
                          ) : (
                            statusTasks.map(task => {
                              const assignee = mockUsers.find(u => u.id === task.assignedTo);
                              return (
                                <motion.div
                                  key={task.id}
                                  layout
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-gray-800 leading-tight">{task.title}</h3>
                                    <Badge className={
                                      task.priority === 'high' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                                        task.priority === 'medium' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
                                          'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }>
                                      {task.priority}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>

                                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      <span>{assignee?.name || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      <span>{task.dueDate}</span>
                                    </div>
                                  </div>
                                  <div className='flex justify-end pt-2'>
                                    <Button variant="ghost" size="sm" className="h-6 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                                  </div>
                                </motion.div>
                              );
                            })
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};