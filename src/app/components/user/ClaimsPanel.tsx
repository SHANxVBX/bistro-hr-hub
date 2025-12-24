import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { mockMedicalClaims, MedicalClaim } from '../../data/mockData';
import { Plus, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ClaimsPanelProps {
  userId: string;
  userName: string;
}

export const ClaimsPanel: React.FC<ClaimsPanelProps> = ({ userId, userName }) => {
  const [claims, setClaims] = useState<MedicalClaim[]>(
    mockMedicalClaims.filter((c) => c.userId === userId)
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClaim, setNewClaim] = useState({
    date: '',
    amount: '',
    description: '',
    document: null as File | null,
  });

  const handleSubmitClaim = () => {
    if (!newClaim.date || !newClaim.amount || !newClaim.description || !newClaim.document) {
      toast.error('Please fill in all fields and upload a receipt');
      return;
    }

    const claim: MedicalClaim = {
      id: `claim-${Date.now()}`,
      userId,
      date: newClaim.date,
      amount: parseFloat(newClaim.amount),
      description: newClaim.description,
      status: 'pending',
      documentUrl: `mock-${newClaim.document.name}`,
      appliedDate: new Date().toISOString().split('T')[0],
    };

    setClaims([claim, ...claims]);
    toast.success('Medical claim submitted successfully');
    setIsDialogOpen(false);
    setNewClaim({
      date: '',
      amount: '',
      description: '',
      document: null,
    });
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

  return (
    <div className="space-y-4">
      {/* Submit Claim Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Submit Claim
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Medical Claim</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newClaim.date}
                  onChange={(e) => setNewClaim({ ...newClaim, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Amount (RM)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newClaim.amount}
                  onChange={(e) => setNewClaim({ ...newClaim, amount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newClaim.description}
                  onChange={(e) =>
                    setNewClaim({ ...newClaim, description: e.target.value })
                  }
                  placeholder="e.g., GP consultation, Dental checkup"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Receipt</Label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setNewClaim({
                      ...newClaim,
                      document: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmitClaim} className="flex-1">
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

      {/* Medical Claims */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {claims.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No medical claims found</p>
            ) : (
              claims.map((claim) => (
                <div key={claim.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{claim.description}</p>
                      <p className="text-sm text-gray-600">{claim.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">RM {claim.amount.toFixed(2)}</p>
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status}
                      </Badge>
                    </div>
                  </div>
                  {claim.documentUrl && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <FileText className="h-4 w-4" />
                      <span>{claim.documentUrl}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Applied on {claim.appliedDate}
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