
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const ApiManagement: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Management</CardTitle>
        <CardDescription>Manage API keys and access for your organization.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="api-key">Your API Key</Label>
          <Input id="api-key" value="********-****-****-****-************" readOnly />
        </div>
        <Button disabled>Generate New Key</Button>
        <p className="text-sm text-muted-foreground">API access is coming soon.</p>
      </CardContent>
    </Card>
  );
};
