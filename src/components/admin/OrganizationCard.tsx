
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Organization } from '@/services/organizationService';
import { Building2, Calendar, Users, Settings, UserPlus } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
  const [showUserManagement, setShowUserManagement] = useState(false);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-700';
      case 'pro': return 'bg-blue-100 text-blue-700';
      case 'enterprise': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className={`transition-all ${org.is_active ? 'border-green-200' : 'border-red-200 opacity-75'}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {org.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold">{org.name}</h3>
                <Badge variant={org.is_active ? 'default' : 'secondary'}>
                  {org.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Badge className={getPlanColor(org.plan_type || 'free')}>
                  {(org.plan_type || 'free').toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>Slug: {org.slug}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {new Date(org.created_at).toLocaleDateString()}</span>
                </div>
                {org.domain && (
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>Domain: {org.domain}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Max Responses: {org.max_responses || 100}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <Button
                variant={org.is_active ? "destructive" : "default"}
                size="sm"
                onClick={() => onToggleActive(org.id, org.is_active)}
              >
                {org.is_active ? 'Deactivate' : 'Activate'}
              </Button>
              
              <Dialog open={showUserManagement} onOpenChange={setShowUserManagement}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Users
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>User Management - {org.name}</DialogTitle>
                  </DialogHeader>
                  <UserManagement 
                    organizationId={org.id} 
                    organizationName={org.name}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <Select
              value={org.plan_type || 'free'}
              onValueChange={(value) => onUpdatePlan(org.id, value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
