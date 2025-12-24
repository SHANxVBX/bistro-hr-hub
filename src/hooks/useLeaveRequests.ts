import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LeaveRequest, LeaveType } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export function useLeaveRequests() {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaveRequests = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeaveRequests(data as LeaveRequest[]);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  const applyLeave = async (
    leaveType: LeaveType,
    startDate: string,
    endDate: string,
    reason: string,
    attachmentUrl?: string
  ) => {
    if (!user) return { success: false };

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const { error } = await supabase.from('leave_requests').insert({
        user_id: user.id,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        days_count: daysCount,
        reason,
        attachment_url: attachmentUrl,
      });

      if (error) throw error;

      toast({
        title: 'Leave Applied',
        description: `Your ${leaveType} leave request has been submitted.`,
      });

      await fetchLeaveRequests();
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to apply leave';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  const cancelLeave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .delete()
        .eq('id', id)
        .eq('status', 'pending');

      if (error) throw error;

      toast({
        title: 'Leave Cancelled',
        description: 'Your leave request has been cancelled.',
      });

      await fetchLeaveRequests();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel leave';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return {
    leaveRequests,
    loading,
    applyLeave,
    cancelLeave,
    refresh: fetchLeaveRequests,
  };
}
