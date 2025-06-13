
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Edit, Settings, Eye } from 'lucide-react';
import { Organization } from '@/services/organizationService';

interface OrganizationCardProps {
  org: Organization;
  onToggleActive: (orgId: string, currentStatus: boolean) => void;
  onUpdatePlan: (orgId: string, planType: string) => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  org,
  onToggleActive,
  onUpdatePlan
}) => {
  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-green-100 text-green-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {org.logo_url && (
              <img src={org.logo_url} alt={org.name} className="w-12 h-12 rounded-lg object-cover" />
            )}
            <div>
              <h3 className="font-semibold text-lg">{org.name}</h3>
              <p className="text-sm text-gray-600">/{org.slug}</p>
              {org.domain && (
                <p className="text-sm text-blue-600">{org.domain}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={getPlanBadgeColor(org.plan_type || 'free')}>
              {(org.plan_type || 'free').toUpperCase()}
            </Badge>
            <Badge variant={org.is_active ? 'default' : 'secondary'}>
              {org.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <Label className="text-xs text-gray-500">Max Responses</Label>
            <p className="font-medium">{org.max_responses || 100}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Created</Label>
            <p className="font-medium">{new Date(org.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Trial Ends</Label>
            <p className="font-medium">
              {org.trial_ends_at ? new Date(org.trial_ends_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Billing Email</Label>
            <p className="font-medium">{org.billing_email || 'Not set'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={org.is_active}
                onCheckedChange={() => onToggleActive(org.id, org.is_active)}
              />
              <Label className="text-sm">Active</Label>
            </div>
            
            <select 
              value={org.plan_type || 'free'}
              onChange={(e) => onUpdatePlan(org.id, e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`/${org.slug}`, '_blank')}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
