import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'; // Assuming Tabs component exists or using standard UI
import { mockTasks, mockUsers, Task } from '../../data/mockData';
import { Plus, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { generateCSV } from '../../utils/reportUtils';

interface TaskManagementProps {
  currentUserId: string;
  currentUserRole?: string;
  currentUserName?: string;
}

const TASKS_STORAGE_KEY = 'hmra_tasks_data';

export const TaskManagement: React.FC<TaskManagementProps> = ({
  currentUserId,
  currentUserRole,
  currentUserName
}) => {
  // Initialize tasks from localStorage or fall back to mockData
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse tasks from localStorage', e);
        return mockTasks;
      }
    }
    return mockTasks;
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as Task['priority'],
    dueDate: '',
  });

  // Reporting State
  const currentDate = new Date();
  const [reportMonth, setReportMonth] = useState(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`);

  // Persist tasks whenever they change
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter(task => {
    // Boss and Laavenya can see all tasks
    if (currentUserRole === 'boss' || currentUserName === 'Laavenya') {
      return true;
    }
    // Others can only see tasks assigned to them or created by them
    return task.assignedTo === currentUserId || task.assignedBy === currentUserId;
  });

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
      assignedBy: currentUserId,
      status: 'pending',
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setTasks([task, ...tasks]);
    toast.success('Task created successfully');
    setIsDialogOpen(false);
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
    });
  };

  const handleUpdateStatus = (id: string, status: Task['status']) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status } : task)));
    toast.success('Task status updated');
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Report Logic
  const getReportData = () => {
    const [year, month] = reportMonth.split('-').map(Number);

    // Filter tasks created in the selected month
    const monthlyTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdDate);
      return taskDate.getFullYear() === year && taskDate.getMonth() === month - 1;
    });

    const totalTasks = monthlyTasks.length;
    const completedTasks = monthlyTasks.filter(t => t.status === 'completed').length;

    return {
      monthlyTasks,
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  const handleDownloadReport = () => {
    const { monthlyTasks } = getReportData();
    const exportData = monthlyTasks.map(task => {
      const assignedUser = mockUsers.find((u) => u.id === task.assignedTo);
      const assignedByUser = mockUsers.find((u) => u.id === task.assignedBy);
      return {
        ID: task.id,
        Title: task.title,
        Description: task.description,
        Priority: task.priority,
        Status: task.status,
        'Assigned To': assignedUser?.name || task.assignedTo,
        'Assigned By': assignedByUser?.name || task.assignedBy,
        'Created Date': task.createdDate,
        'Due Date': task.dueDate
      };
    });

    generateCSV(exportData, `Task_Report_${reportMonth}.csv`);
    toast.success('Report downloaded successfully');
  };

  const { monthlyTasks, totalTasks, completedTasks, completionRate } = getReportData();

  return (
    <div className="space-y-4">
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Task List</TabsTrigger>
          <TabsTrigger value="reports">Monthly Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 mt-4">
          {/* Create Task Button */}
          <div className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Task Title</Label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Enter task title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Enter task description"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Assign To</Label>
                    <Select
                      value={newTask.assignedTo}
                      onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} - {user.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value: Task['priority']) =>
                          setNewTask({ ...newTask, priority: value })
                        }
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

                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateTask} className="flex-1">
                      Create
                    </Button>
                    <Button
                      onClick={() => setIsDialogOpen(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const assignedUser = mockUsers.find((u) => u.id === task.assignedTo);
                const assignedByUser = mockUsers.find((u) => u.id === task.assignedBy);

                return (
                  <Card key={task.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg text-sm">
                          <div>
                            <p className="text-gray-600">Assigned To</p>
                            <p className="font-medium">{assignedUser?.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Assigned By</p>
                            <p className="font-medium">{assignedByUser?.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Due Date</p>
                            <p className="font-medium">{task.dueDate}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Created</p>
                            <p className="font-medium">{task.createdDate}</p>
                          </div>
                        </div>

                        {task.status !== 'completed' && (
                          <div className="flex gap-2">
                            {task.status === 'pending' && (
                              <Button
                                onClick={() => handleUpdateStatus(task.id, 'in-progress')}
                                size="sm"
                                variant="outline"
                              >
                                Start Task
                              </Button>
                            )}
                            {task.status === 'in-progress' && (
                              <Button
                                onClick={() => handleUpdateStatus(task.id, 'completed')}
                                size="sm"
                              >
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="py-12">
                  <p className="text-center text-gray-500">No tasks found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Monthly Task Report
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    type="month"
                    value={reportMonth}
                    onChange={(e) => setReportMonth(e.target.value)}
                    className="w-40"
                  />
                  <Button onClick={handleDownloadReport} variant="outline" disabled={monthlyTasks.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Total Tasks Assigned</p>
                  <p className="text-2xl font-bold">{totalTasks}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-green-600 mb-1">Tasks Completed</p>
                  <p className="text-2xl font-bold text-green-700">{completedTasks}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-blue-600 mb-1">Completion Rate</p>
                  <p className="text-2xl font-bold text-blue-700">{completionRate}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-4">Task Details</h3>
                {monthlyTasks.length > 0 ? (
                  <div className="border rounded-md divide-y">
                    {monthlyTasks.map(task => {
                      const assignedUser = mockUsers.find((u) => u.id === task.assignedTo);
                      return (
                        <div key={task.id} className="p-3 flex justify-between items-center hover:bg-gray-50">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-500">Assigned to: {assignedUser?.name} | Due: {task.dueDate}</p>
                          </div>
                          <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No tasks found for this month.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
