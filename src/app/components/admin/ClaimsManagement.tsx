import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { mockMedicalClaims, mockUsers, MedicalClaim } from '../../data/mockData';
import { Check, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const ClaimsManagement: React.FC = () => {
  const [claims, setClaims] = useState(mockMedicalClaims);

  const handleApprove = (id: string) => {
    setClaims(
      claims.map((claim) =>
        claim.id === id
          ? { ...claim, status: 'approved' as const, approvedBy: '2' }
          : claim
      )
    );
    toast.success('Medical claim approved');
  };

  const handleReject = (id: string) => {
    setClaims(
      claims.map((claim) =>
        claim.id === id
          ? { ...claim, status: 'rejected' as const, approvedBy: '2' }
          : claim
      )
    );
    toast.success('Medical claim rejected');
  };

  const getStatusColor = (status: MedicalClaim['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const renderClaims = (status: MedicalClaim['status'] | 'all') => {
    const filtered =
      status === 'all' ? claims : claims.filter((c) => c.status === status);

    if (filtered.length === 0) {
      return (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">No {status} medical claims</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {filtered.map((claim) => {
          const user = mockUsers.find((u) => u.id === claim.userId);
          return (
            <Card key={claim.id}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-gray-600">
                        {user?.department} - {user?.position}
                      </p>
                    </div>
                    <Badge className={getStatusColor(claim.status)}>
                      {claim.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{claim.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-medium">RM {claim.amount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="mt-1">{claim.description}</p>
                  </div>

                  {claim.documentUrl && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <FileText className="h-4 w-4" />
                      <span>{claim.documentUrl}</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Applied on {claim.appliedDate}
                  </div>

                  {claim.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(claim.id)}
                        className="flex-1"
                        size="sm"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(claim.id)}
                        variant="destructive"
                        className="flex-1"
                        size="sm"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
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
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
        <TabsTrigger value="all">All</TabsTrigger>
      </TabsList>

      <TabsContent value="pending">{renderClaims('pending')}</TabsContent>
      <TabsContent value="approved">{renderClaims('approved')}</TabsContent>
      <TabsContent value="rejected">{renderClaims('rejected')}</TabsContent>
      <TabsContent value="all">{renderClaims('all')}</TabsContent>
    </Tabs>
  );
};