
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const OrganizationAdmin: React.FC = () => {
  const { organizationSlug } = useParams<{ organizationSlug: string }>();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Organization Dashboard</CardTitle>
          <p className="text-gray-600">
            Managing organization: <span className="font-semibold">{organizationSlug}</span>
          </p>
        </CardHeader>
        <CardContent>
          <p>Organization-specific administration tools will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
};
