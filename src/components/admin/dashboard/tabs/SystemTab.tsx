
import React, { useState } from "react";
import { SystemUserManagement } from '../../system/SystemUserManagement';
import { AuditLogViewer } from '../../AuditLogViewer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedLoadingSpinner } from '../EnhancedLoadingSpinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const SystemTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState("users");

  const { data: organizations, isLoading } = useQuery({
    queryKey: ['all-organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return <EnhancedLoadingSpinner text="Loading system data..." />;
  }

  return (
    <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="users">User Management</TabsTrigger>
        <TabsTrigger value="audit">Audit Logs</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="mt-6">
        <SystemUserManagement organizations={organizations || []} />
      </TabsContent>

      <TabsContent value="audit" className="mt-6">
        <AuditLogViewer />
      </TabsContent>
    </Tabs>
  );
};

export default SystemTab;
