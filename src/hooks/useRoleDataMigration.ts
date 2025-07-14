
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

      // Migrate each user
      const updates = usersToMigrate.map(user => {
        let enhancedRole = 'member'; // default
        
        // Map legacy role to enhanced_role
        if (user.role === 'admin') {
          enhancedRole = 'admin';
        } else if (user.role === 'member') {
          enhancedRole = 'member';
        }

        return {
          id: user.id,
          enhanced_role: enhancedRole
        };
      });

      // Batch update all users
      const { error: updateError } = await supabase
        .from('organization_users')
        .upsert(updates, { onConflict: 'id' });

      if (updateError) {
        throw new Error(`Failed to migrate user roles: ${updateError.message}`);
      }

      console.log(`Successfully migrated ${updates.length} user roles`);
      return { migratedCount: updates.length };
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
