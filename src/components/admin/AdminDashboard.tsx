
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataExport } from './DataExport';
import { FormConfig } from './FormConfig';
import { WebhookSettings } from './WebhookSettings';
import { AdminStats } from './AdminStats';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#073763]">
              Police Sacco Feedback Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="export">Export Data</TabsTrigger>
                <TabsTrigger value="config">Form Config</TabsTrigger>
                <TabsTrigger value="webhooks">Integrations</TabsTrigger>
              </TabsList>
              <TabsContent value="stats"><AdminStats /></TabsContent>
              <TabsContent value="export"><DataExport /></TabsContent>
              <TabsContent value="config"><FormConfig /></TabsContent>
              <TabsContent value="webhooks"><WebhookSettings /></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
