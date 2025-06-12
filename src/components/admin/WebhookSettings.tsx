
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
}

export const WebhookSettings: React.FC = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    { id: '1', url: 'https://api.example.com/webhook', events: ['submission'], active: true }
  ]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const { toast } = useToast();

  const addWebhook = () => {
    if (!newWebhookUrl) return;
    
    const newWebhook: Webhook = {
      id: Date.now().toString(),
      url: newWebhookUrl,
      events: ['submission'],
      active: true
    };
    
    setWebhooks(prev => [...prev, newWebhook]);
    setNewWebhookUrl('');
    
    toast({
      title: "Webhook added",
      description: "New webhook endpoint has been configured",
    });
  };

  const testWebhook = async (webhook: Webhook) => {
    try {
      await fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true, timestamp: new Date().toISOString() })
      });
      
      toast({
        title: "Test successful",
        description: "Webhook endpoint responded correctly",
      });
    } catch (error) {
      toast({
        title: "Test failed",
        description: "Could not reach webhook endpoint",
        variant: "destructive",
      });
    }
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Webhook Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://your-api.com/webhook"
              value={newWebhookUrl}
              onChange={(e) => setNewWebhookUrl(e.target.value)}
            />
            <Button onClick={addWebhook} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <Card key={webhook.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium truncate">{webhook.url}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">submission</Badge>
                      <Badge variant={webhook.active ? "default" : "secondary"}>
                        {webhook.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testWebhook(webhook)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteWebhook(webhook.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
