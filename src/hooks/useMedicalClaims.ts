import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MedicalClaim } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export function useMedicalClaims() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<MedicalClaim[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('medical_claims')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClaims(data as MedicalClaim[]);
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const submitClaim = async (
    amount: number,
    description: string,
    visitDate: string,
    receiptUrl: string
  ) => {
    if (!user) return { success: false };

    try {
      const { error } = await supabase.from('medical_claims').insert({
        user_id: user.id,
        amount,
        description,
        visit_date: visitDate,
        receipt_url: receiptUrl,
      });

      if (error) throw error;

      toast({
        title: 'Claim Submitted',
        description: 'Your medical claim has been submitted for review.',
      });

      await fetchClaims();
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit claim';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  const cancelClaim = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medical_claims')
        .delete()
        .eq('id', id)
        .eq('status', 'pending');

      if (error) throw error;

      toast({
        title: 'Claim Cancelled',
        description: 'Your medical claim has been cancelled.',
      });

      await fetchClaims();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel claim';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return {
    claims,
    loading,
    submitClaim,
    cancelClaim,
    refresh: fetchClaims,
  };
}
