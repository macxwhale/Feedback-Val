
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export const FormConfig: React.FC = () => {
  const [config, setConfig] = useState({
    title: 'Police Sacco Feedback Form',
    description: 'Help us improve our services',
    showProgressBar: true,
    allowSkip: false,
    autoSave: true,
    theme: 'police-sacco'
  });
  
  const { toast } = useToast();

  const handleSave = () => {
    localStorage.setItem('feedbackFormConfig', JSON.stringify(config));
    toast({
      title: "Configuration saved",
      description: "Form settings have been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Form Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Form Title</Label>
            <Input
              id="title"
              value={config.title}
              onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="progress">Show Progress Bar</Label>
              <Switch
                id="progress"
                checked={config.showProgressBar}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, showProgressBar: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="skip">Allow Question Skip</Label>
              <Switch
                id="skip"
                checked={config.allowSkip}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, allowSkip: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="autosave">Auto-save Responses</Label>
              <Switch
                id="autosave"
                checked={config.autoSave}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoSave: checked }))}
              />
            </div>
          </div>
          
          <Button onClick={handleSave} className="w-full bg-[#073763] hover:bg-[#062c52]">
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
