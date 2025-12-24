import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockPayments, mockUsers, mockLeaveRequests, mockMedicalClaims, Payment } from '../data/mockData';
import { LogOut, Plus, Check, X, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { StaffDatabase } from './shared/StaffDatabase';
import { TaskManagement } from './admin/TaskManagement';

export const FinanceDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [payments, setPayments] = useState(mockPayments);
  const [medicalClaims, setMedicalClaims] = useState(mockMedicalClaims);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    userId: '',
    type: 'salary' as Payment['type'],
    amount: '',
    description: '',
    status: 'pending' as Payment['status'],
  });

  const handleRecordPayment = () => {
    if (!newPayment.userId || !newPayment.amount || !newPayment.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      userId: newPayment.userId,
      type: newPayment.type,
      amount: parseFloat(newPayment.amount),
      description: newPayment.description,
      status: newPayment.status,
      date: new Date().toISOString().split('T')[0],
      recordedBy: user?.id || '',
    };

    setPayments([payment, ...payments]);
    toast.success('Payment recorded successfully');
    setIsDialogOpen(false);
    setNewPayment({
      userId: '',
      type: 'salary',
      amount: '',
      description: '',
      status: 'pending',
    });
  };

  const handleUpdateStatus = (id: string, status: Payment['status']) => {
    setPayments(payments.map((p) => (p.id === id ? { ...p, status } : p)));
    toast.success(`Payment marked as ${status}`);
  };

  const handleApproveClaim = (id: string) => {
    setMedicalClaims(claims =>
      claims.map(c => c.id === id ? { ...c, status: 'approved', approvedBy: user?.id } : c)
    );
    toast.success('Claim approved');
  };

  const handleRejectClaim = (id: string) => {
    setMedicalClaims(claims =>
      claims.map(c => c.id === id ? { ...c, status: 'rejected', approvedBy: user?.id } : c)
    );
    toast.success('Claim rejected');
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'not-required':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl">Mallar Bistro - Finance</h1>
              <p className="text-sm text-gray-600">{user.name}</p>
            </div>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">RM {totalPending.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {payments.filter((p) => p.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Completed This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {payments.filter((p) => p.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="tasks">
              <ClipboardList className="mr-2 h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="leave">Leave (View Only)</TabsTrigger>
            <TabsTrigger value="claims">Claims (View Only)</TabsTrigger>
            <TabsTrigger value="staff-db">Staff Database</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="mt-6">
            <TaskManagement
              currentUserId={user.id}
              currentUserRole={user.role}
              currentUserName={user.name}
            />
          </TabsContent>

          <TabsContent value="payments">
            <div className="space-y-4">
              {/* Record Payment Button */}
              <div className="flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Record Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Record New Payment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Employee</Label>
                        <Select
                          value={newPayment.userId}
                          onValueChange={(value) =>
                            setNewPayment({ ...newPayment, userId: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} - {user.position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={newPayment.type}
                          onValueChange={(value: Payment['type']) =>
                            setNewPayment({ ...newPayment, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="salary">Salary</SelectItem>
                            <SelectItem value="bonus">Bonus</SelectItem>
                            <SelectItem value="allowance">Allowance</SelectItem>
                            <SelectItem value="reimbursement">Reimbursement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Amount (RM)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newPayment.amount}
                          onChange={(e) =>
                            setNewPayment({ ...newPayment, amount: e.target.value })
                          }
                          placeholder="0.00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={newPayment.description}
                          onChange={(e) =>
                            setNewPayment({ ...newPayment, description: e.target.value })
                          }
                          placeholder="Enter payment description"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={newPayment.status}
                          onValueChange={(value: Payment['status']) =>
                            setNewPayment({ ...newPayment, status: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="not-required">Not Required</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleRecordPayment} className="flex-1">
                          Record
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

              {/* Payments List */}
              <div className="space-y-3">
                {payments.map((payment) => {
                  const employee = mockUsers.find((u) => u.id === payment.userId);
                  return (
                    <Card key={payment.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{employee?.name}</p>
                              <p className="text-sm text-gray-600">
                                {employee?.department} - {employee?.position}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-medium">
                                RM {payment.amount.toFixed(2)}
                              </p>
                              <Badge className={getStatusColor(payment.status)}>
                                {payment.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Type</p>
                            <p className="font-medium capitalize">{payment.type}</p>
                            <p className="text-sm mt-2">{payment.description}</p>
                          </div>

                          <p className="text-xs text-gray-500">
                            Recorded on {payment.date}
                          </p>

                          {payment.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleUpdateStatus(payment.id, 'completed')}
                                size="sm"
                                className="flex-1"
                              >
                                Mark Completed
                              </Button>
                              <Button
                                onClick={() =>
                                  handleUpdateStatus(payment.id, 'not-required')
                                }
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                Not Required
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leave">
            <Card>
              <CardHeader>
                <CardTitle>Leave Requests (View Only)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockLeaveRequests.map((request) => {
                    const employee = mockUsers.find((u) => u.id === request.userId);
                    return (
                      <div key={request.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{employee?.name}</p>
                            <p className="text-sm text-gray-600">
                              {request.type} - {request.days} days
                            </p>
                          </div>
                          <Badge>{request.status}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claims">
            <Card>
              <CardHeader>
                <CardTitle>Medical Claims Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicalClaims.map((claim) => {
                    const employee = mockUsers.find((u) => u.id === claim.userId);
                    return (
                      <Card key={claim.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-lg">{employee?.name}</p>
                                <Badge variant="outline" className="text-xs">
                                  {employee?.department}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{claim.description}</p>
                              <div className="flex gap-4 text-xs text-gray-500">
                                <span>Applied: {claim.appliedDate}</span>
                                {claim.documentUrl && (
                                  <span className="text-blue-600 cursor-pointer hover:underline">
                                    View Receipt
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                              <p className="text-xl font-bold text-slate-700">
                                RM {claim.amount.toFixed(2)}
                              </p>
                              <Badge
                                className={`${claim.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                  claim.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                                    'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  }`}
                              >
                                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                              </Badge>
                            </div>
                          </div>

                          {claim.status === 'pending' && (
                            <div className="bg-gray-50 px-4 py-3 flex gap-2 justify-end border-t">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRejectClaim(claim.id)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleApproveClaim(claim.id)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}

                  {medicalClaims.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No medical claims found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff-db">
            <StaffDatabase />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
