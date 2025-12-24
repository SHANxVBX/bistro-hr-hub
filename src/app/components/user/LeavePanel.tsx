import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { mockLeaveRequests, LeaveRequest } from '../../data/mockData';
import { Plus, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface LeavePanelProps {
  userId: string;
  userName: string;
}

export const LeavePanel: React.FC<LeavePanelProps> = ({ userId, userName }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(
    mockLeaveRequests.filter((r) => r.userId === userId)
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({
    type: 'AL' as 'AL' | 'MC' | 'EL',
    startDate: '',
    endDate: '',
    reason: '',
    document: null as File | null,
  });

  const handleSubmitLeave = () => {
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    const start = new Date(newLeave.startDate);
    const end = new Date(newLeave.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const request: LeaveRequest = {
      id: `leave-${Date.now()}`,
      userId,
      type: newLeave.type,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      days,
      reason: newLeave.reason,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      documentUrl: newLeave.document ? `mock-${newLeave.document.name}` : undefined,
    };

    setLeaveRequests([request, ...leaveRequests]);
    toast.success('Leave request submitted successfully');
    setIsDialogOpen(false);
    setNewLeave({
      type: 'AL',
      startDate: '',
      endDate: '',
      reason: '',
      document: null,
    });
  };

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

  return (
    <div className="space-y-4">
      {/* Apply Leave Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Apply Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Leave Type</Label>
                <Select
                  value={newLeave.type}
                  onValueChange={(value: 'AL' | 'MC' | 'EL') =>
                    setNewLeave({ ...newLeave, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AL">Annual Leave</SelectItem>
                    <SelectItem value="MC">Medical Leave</SelectItem>
                    <SelectItem value="EL">Emergency Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={newLeave.startDate}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={newLeave.endDate}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  placeholder="Enter reason for leave"
                  rows={3}
                />
              </div>

              {(newLeave.type === 'MC') && (
                <div className="space-y-2">
                  <Label>Upload Medical Certificate (MC)</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setNewLeave({
                        ...newLeave,
                        document: e.target.files?.[0] || null,
                      })
                    }
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSubmitLeave} className="flex-1">
                  Submit
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

      {/* Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaveRequests.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No leave requests found</p>
            ) : (
              leaveRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{getLeaveTypeLabel(request.type)}</p>
                      <p className="text-sm text-gray-600">
                        {request.startDate} to {request.endDate} ({request.days}{' '}
                        {request.days === 1 ? 'day' : 'days'})
                      </p>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm">{request.reason}</p>
                  {request.documentUrl && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <FileText className="h-4 w-4" />
                      <span>{request.documentUrl}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Applied on {request.appliedDate}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
