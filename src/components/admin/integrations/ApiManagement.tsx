
import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useOrganization } from '@/context/OrganizationContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Copy } from 'lucide-react';

export const ApiManagement: React.FC = () => {
  const { organization, loading: orgLoading } = useOrganization();
  const queryClient = useQueryClient();

  const [enabled, setEnabled] = useState(false);
  const [senderId, setSenderId] = useState('');
  const [username, setUsername] = useState('');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (organization) {
      setEnabled(organization.sms_enabled || false);
      setSenderId(organization.sms_sender_id || '');
      setUsername(organization.sms_settings?.username || '');
      // API key is not pre-filled for security
      setApiKey('');
    }
  }, [organization]);
  
  const { mutate: updateSettings, isPending: isSaving } = useMutation({
    mutationFn: async (variables: { enabled: boolean; senderId: string; username: string; apiKey: string; }) => {
      const { data, error } = await supabase.functions.invoke('update-sms-settings', {
        body: {
          orgId: organization.id,
          ...variables
        },
      });

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success('SMS settings saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['organization', organization.slug] });
    },
    onError: (error) => {
      toast.error(`Failed to save settings: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;
    updateSettings({ enabled, senderId, username, apiKey });
  };
  
  const webhookUrl = organization?.webhook_secret 
    ? `https://rigurrwjiaucodxuuzeh.supabase.co/functions/v1/handle-sms-webhook/${organization.webhook_secret}`
    : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('Webhook URL copied to clipboard!');
  };

  if (orgLoading) {
    return <div>Loading SMS settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Integration (Africa's Talking)</CardTitle>
        <CardDescription>Configure two-way SMS feedback for your organization.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <Label htmlFor="sms-enabled" className="flex flex-col space-y-1">
              <span>Enable SMS Feedback</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Allow users to provide feedback via SMS.
              </span>
            </Label>
            <Switch
              id="sms-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
              disabled={isSaving}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="senderId">Sender ID / Shortcode</Label>
            <Input
              id="senderId"
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              placeholder="e.g., YourBrand or 24567"
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Africa's Talking Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., sandbox or your username"
              disabled={isSaving}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">Africa's Talking API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={organization?.sms_settings?.apiKey ? '•••••••••••••••• (already set)' : 'Enter new API key'}
              disabled={isSaving}
            />
             <p className="text-sm text-muted-foreground">
              Leave blank to keep the existing key.
            </p>
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>

        <Alert className="mt-8">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Your SMS Webhook URL</AlertTitle>
          <AlertDescription>
            <p className="mb-2">Configure this URL in your Africa's Talking account to receive incoming SMS.</p>
            <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
              <Input readOnly value={webhookUrl} className="flex-grow bg-transparent border-none focus:ring-0" />
              <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!webhookUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
