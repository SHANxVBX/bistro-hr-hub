import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export function useFileUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, folder: string = 'general'): Promise<string | null> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upload files.',
        variant: 'destructive',
      });
      return null;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      toast({
        title: 'Upload Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
  };
}
