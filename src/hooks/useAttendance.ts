import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Attendance, AttendanceStatus } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export function useAttendance() {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTodayAttendance = useCallback(async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      setTodayAttendance(data as Attendance | null);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTodayAttendance();
  }, [fetchTodayAttendance]);

  const checkIn = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('attendance')
        .insert({
          user_id: user.id,
          date: today,
          check_in: now,
          status: 'in_office' as AttendanceStatus,
        })
        .select()
        .single();

      if (error) throw error;

      setTodayAttendance(data as Attendance);
      toast({
        title: 'Checked In!',
        description: `You checked in at ${new Date(now).toLocaleTimeString()}`,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check in';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const checkOut = async () => {
    if (!user || !todayAttendance) return;

    try {
      const now = new Date().toISOString();
      const checkInTime = new Date(todayAttendance.check_in!);
      const checkOutTime = new Date(now);
      const totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

      const { data, error } = await supabase
        .from('attendance')
        .update({
          check_out: now,
          total_hours: Math.round(totalHours * 100) / 100,
        })
        .eq('id', todayAttendance.id)
        .select()
        .single();

      if (error) throw error;

      setTodayAttendance(data as Attendance);
      toast({
        title: 'Checked Out!',
        description: `You worked ${totalHours.toFixed(2)} hours today.`,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check out';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const updateStatus = async (status: AttendanceStatus) => {
    if (!user || !todayAttendance) return;

    try {
      const { data, error } = await supabase
        .from('attendance')
        .update({ status })
        .eq('id', todayAttendance.id)
        .select()
        .single();

      if (error) throw error;

      setTodayAttendance(data as Attendance);
      toast({
        title: 'Status Updated',
        description: `Your status is now: ${status.replace(/_/g, ' ')}`,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return {
    todayAttendance,
    loading,
    checkIn,
    checkOut,
    updateStatus,
    refresh: fetchTodayAttendance,
  };
}
