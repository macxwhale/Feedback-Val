
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRoleDataMigration = () => {
  const queryClient = useQueryClient();

  const migrationMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting role data migration...');
      
      // Get all organization_users with null enhanced_role
      const { data: usersToMigrate, error: fetchError } = await supabase
        .from('organization_users')
        .select('id, user_id, organization_id, role, enhanced_role')
        .is('enhanced_role', null);

      if (fetchError) {
        throw new Error(`Failed to fetch users for migration: ${fetchError.message}`);
      }

      if (!usersToMigrate || usersToMigrate.length === 0) {
        console.log('No users need role migration');
        return { migratedCount: 0 };
      }

      console.log(`Found ${usersToMigrate.length} users needing role migration`);

      // Migrate each user individually to avoid the batch update issue
      let migratedCount = 0;
      for (const user of usersToMigrate) {
        let enhancedRole = 'member'; // default
        
        // Map legacy role to enhanced_role
        if (user.role === 'admin') {
          enhancedRole = 'admin';
        } else if (user.role === 'member') {
          enhancedRole = 'member';
        }

        const { error: updateError } = await supabase
          .from('organization_users')
          .update({ enhanced_role: enhancedRole as 'owner' | 'admin' | 'manager' | 'analyst' | 'member' | 'viewer' })
          .eq('id', user.id);

        if (updateError) {
          console.error(`Failed to migrate user ${user.id}:`, updateError);
        } else {
          migratedCount++;
        }
      }

      console.log(`Successfully migrated ${migratedCount} user roles`);
      return { migratedCount };
    },
    onSuccess: (result) => {
      if (result.migratedCount > 0) {
        toast.success(`Successfully migrated ${result.migratedCount} user roles`);
        // Invalidate all organization-members queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['organization-members'] });
      }
    },
    onError: (error: any) => {
      console.error('Role migration failed:', error);
      toast.error(`Role migration failed: ${error.message}`);
    }
  });

  return {
    migrateRoles: migrationMutation.mutate,
    isMigrating: migrationMutation.isPending,
    migrationError: migrationMutation.error
  };
};
