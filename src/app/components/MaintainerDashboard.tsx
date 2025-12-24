import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockUsers, User, Role } from '../data/mockData';
import { LogOut, Plus, Edit, Settings, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { OverviewPanel } from './admin/OverviewPanel';
import { AttendanceManagement } from './admin/AttendanceManagement';
import { LeaveManagement } from './admin/LeaveManagement';
import { ClaimsManagement } from './admin/ClaimsManagement';
import { TaskManagement } from './admin/TaskManagement';
import { ClipboardList } from 'lucide-react';

export const MaintainerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as Role,
    department: '',
    position: '',
    alQuota: 12,
    mcQuota: 14,
    medicalClaimQuota: 800,
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.department || !newUser.position) {
      toast.error('Please fill in all required fields');
      return;
    }

    const user: User = {
      id: `${Date.now()}`,
      ...newUser,
      alUsed: 0,
      mcUsed: 0,
      medicalClaimUsed: 0,
    };

    setUsers([...users, user]);
    toast.success('User added successfully');
    setIsAddUserOpen(false);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'user',
      department: '',
      position: '',
      alQuota: 12,
      mcQuota: 14,
      medicalClaimQuota: 800,
    });
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    setUsers(
      users.map((u) => (u.id === selectedUser.id ? selectedUser : u))
    );
    toast.success('User updated successfully');
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
      toast.success('User deleted');
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl">Mallar Bistro - Maintainer</h1>
              <p className="text-sm text-gray-600">{user.name} (System Administrator)</p>
            </div>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6">
            <TabsTrigger value="users">
              <UserCog className="mr-2 h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <ClipboardList className="mr-2 h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="leave">Leave</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="space-y-4">
              {/* Add User Button */}
              <div className="flex justify-end">
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={newUser.name}
                            onChange={(e) =>
                              setNewUser({ ...newUser, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={newUser.email}
                            onChange={(e) =>
                              setNewUser({ ...newUser, email: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Password</Label>
                          <Input
                            type="password"
                            value={newUser.password}
                            onChange={(e) =>
                              setNewUser({ ...newUser, password: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Select
                            value={newUser.role}
                            onValueChange={(value: Role) =>
                              setNewUser({ ...newUser, role: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="maintainer">Maintainer</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="boss">Boss</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Department</Label>
                          <Input
                            value={newUser.department}
                            onChange={(e) =>
                              setNewUser({ ...newUser, department: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Input
                            value={newUser.position}
                            onChange={(e) =>
                              setNewUser({ ...newUser, position: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>AL Quota</Label>
                          <Input
                            type="number"
                            value={newUser.alQuota}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                alQuota: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>MC Quota</Label>
                          <Input
                            type="number"
                            value={newUser.mcQuota}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                mcQuota: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Medical Claim Quota</Label>
                          <Input
                            type="number"
                            value={newUser.medicalClaimQuota}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                medicalClaimQuota: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleAddUser} className="flex-1">
                          Add User
                        </Button>
                        <Button
                          onClick={() => setIsAddUserOpen(false)}
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

              {/* Users List */}
              <div className="grid grid-cols-1 gap-4">
                {users.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium">{user.name}</p>
                            <Badge variant="outline">{user.role}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Email</p>
                              <p>{user.email}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Department</p>
                              <p>{user.department}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Position</p>
                              <p>{user.position}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Leave Balance</p>
                              <p>
                                AL: {user.alQuota - user.alUsed}/{user.alQuota} | MC:{' '}
                                {user.mcQuota - user.mcUsed}/{user.mcQuota}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => openEditDialog(user)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteUser(user.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Edit User Dialog */}
              {selectedUser && (
                <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={selectedUser.name}
                            onChange={(e) =>
                              setSelectedUser({ ...selectedUser, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={selectedUser.email}
                            onChange={(e) =>
                              setSelectedUser({ ...selectedUser, email: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Select
                            value={selectedUser.role}
                            onValueChange={(value: Role) =>
                              setSelectedUser({ ...selectedUser, role: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="maintainer">Maintainer</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="boss">Boss</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Department</Label>
                          <Input
                            value={selectedUser.department}
                            onChange={(e) =>
                              setSelectedUser({
                                ...selectedUser,
                                department: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Position</Label>
                        <Input
                          value={selectedUser.position}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              position: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>AL Quota</Label>
                          <Input
                            type="number"
                            value={selectedUser.alQuota}
                            onChange={(e) =>
                              setSelectedUser({
                                ...selectedUser,
                                alQuota: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>MC Quota</Label>
                          <Input
                            type="number"
                            value={selectedUser.mcQuota}
                            onChange={(e) =>
                              setSelectedUser({
                                ...selectedUser,
                                mcQuota: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Medical Claim Quota</Label>
                          <Input
                            type="number"
                            value={selectedUser.medicalClaimQuota}
                            onChange={(e) =>
                              setSelectedUser({
                                ...selectedUser,
                                medicalClaimQuota: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleEditUser} className="flex-1">
                          Update User
                        </Button>
                        <Button
                          onClick={() => setIsEditUserOpen(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <TaskManagement
              currentUserId={user.id}
              currentUserRole={user.role}
              currentUserName={user.name}
            />
          </TabsContent>

          <TabsContent value="overview">
            <OverviewPanel />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceManagement />
          </TabsContent>

          <TabsContent value="leave">
            <LeaveManagement />
          </TabsContent>

          <TabsContent value="claims">
            <ClaimsManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
