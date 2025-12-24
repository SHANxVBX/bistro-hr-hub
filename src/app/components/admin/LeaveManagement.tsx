import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { mockLeaveRequests, mockUsers, LeaveRequest } from '../../data/mockData';
import { FileText, Download, Printer, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export const LeaveManagement: React.FC = () => {
  const [leaveRequests] = useState(mockLeaveRequests);
  const [isUnregisteredLeaveOpen, setIsUnregisteredLeaveOpen] = useState(false);
  const [unregisteredForm, setUnregisteredForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleApplyUnregisteredLeave = () => {
    if (!unregisteredForm.name || !unregisteredForm.startDate || !unregisteredForm.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Generate PDF/Download logic simulation
    toast.success(`Leave application for ${unregisteredForm.name} generated and downloaded.`);
    setIsUnregisteredLeaveOpen(false);
    setUnregisteredForm({ name: '', startDate: '', endDate: '', reason: '' });
  };

  const handleExportLeaves = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Leave Statements - Mallar Bistro</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px;
              max-width: 1200px;
              margin: 0 auto;
            }
            h1 { 
              text-align: center; 
              color: #333;
              margin-bottom: 10px;
            }
            .subtitle {
              text-align: center;
              color: #666;
              margin-bottom: 30px;
            }
            .date {
              text-align: right;
              color: #666;
              margin-bottom: 20px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 12px; 
              text-align: left;
            }
            th { 
              background-color: #f4f4f4;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .status-pending { color: #f59e0b; }
            .status-approved { color: #10b981; }
            .status-rejected { color: #ef4444; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Mallar Bistro</h1>
          <div class="subtitle">Leave Statements Report</div>
          <div class="date">Generated on: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}</div>
          
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Approved By</th>
              </tr>
            </thead>
            <tbody>
              ${leaveRequests
        .map((request) => {
          const user = mockUsers.find((u) => u.id === request.userId);
          const approver = request.approvedBy
            ? mockUsers.find((u) => u.id === request.approvedBy)
            : null;
          return `
                    <tr>
                      <td>${user?.name || 'Unknown'}</td>
                      <td>${user?.department || '-'}</td>
                      <td>${request.type}</td>
                      <td>${request.startDate}</td>
                      <td>${request.endDate}</td>
                      <td>${request.days}</td>
                      <td>${request.reason}</td>
                      <td>${request.appliedDate}</td>
                      <td class="status-${request.status}">${request.status.toUpperCase()}</td>
                      <td>${approver?.name || '-'}</td>
                    </tr>
                  `;
        })
        .join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 40px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Report
            </button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    toast.success('Export ready - Print window opened');
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

  const renderLeaveRequests = (status: LeaveRequest['status'] | 'all') => {
    const filtered =
      status === 'all' ? leaveRequests : leaveRequests.filter((r) => r.status === status);

    if (filtered.length === 0) {
      return (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">No {status} leave requests</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {filtered.map((request) => {
          const user = mockUsers.find((u) => u.id === request.userId);
          const approver = request.approvedBy
            ? mockUsers.find((u) => u.id === request.approvedBy)
            : null;
          return (
            <Card key={request.id}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-gray-600">
                        {user?.department} - {user?.position}
                      </p>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium">{getLeaveTypeLabel(request.type)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{request.days} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium">{request.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-medium">{request.endDate}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Reason</p>
                    <p className="mt-1">{request.reason}</p>
                  </div>

                  {request.documentUrl && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <FileText className="h-4 w-4" />
                      <span>{request.documentUrl}</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 flex justify-between items-center">
                    <span>Applied on {request.appliedDate}</span>
                    {approver && (
                      <span>
                        Approved by {approver.name}
                        {request.approvedDate && ` on ${request.approvedDate}`}
                      </span>
                    )}
                  </div>

                  {request.status === 'pending' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        ℹ️ This leave request is pending approval from the Boss (Segar Boss).
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-600">ℹ️</div>
            <div>
              <p className="font-medium text-blue-900">View-Only Access</p>
              <p className="text-sm text-blue-800">
                You can view all leave requests for tracking purposes. Only the Boss (Segar Boss) can approve or reject leave requests.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
          <Dialog open={isUnregisteredLeaveOpen} onOpenChange={setIsUnregisteredLeaveOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Apply Leave (Unregistered)
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Unregistered Foreign Worker Leave Application</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Worker Name</Label>
                  <Input
                    value={unregisteredForm.name}
                    onChange={(e) => setUnregisteredForm({ ...unregisteredForm, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={unregisteredForm.startDate}
                      onChange={(e) => setUnregisteredForm({ ...unregisteredForm, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={unregisteredForm.endDate}
                      onChange={(e) => setUnregisteredForm({ ...unregisteredForm, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea
                    value={unregisteredForm.reason}
                    onChange={(e) => setUnregisteredForm({ ...unregisteredForm, reason: e.target.value })}
                    placeholder="Reason for leave"
                  />
                </div>
                <div className="pt-2">
                  <Button onClick={handleApplyUnregisteredLeave} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Apply & Download Statement
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Button onClick={handleExportLeaves} variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Export & Print Leave Statements
        </Button>
      </div>

      {/* Leave Requests Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">{renderLeaveRequests('pending')}</TabsContent>
        <TabsContent value="approved">{renderLeaveRequests('approved')}</TabsContent>
        <TabsContent value="rejected">{renderLeaveRequests('rejected')}</TabsContent>
        <TabsContent value="all">{renderLeaveRequests('all')}</TabsContent>
      </Tabs>
    </div>
  );
};
