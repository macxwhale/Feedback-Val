import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Organization } from '@/services/organizationService';
import { Building2, Calendar, Users, Settings, UserPlus } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EditOrganizationModal } from './EditOrganizationModal';

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
  const [editOpen, setEditOpen] = useState(false);
  const [editedOrg, setEditedOrg] = useState(org);
  const isDev = process.env.NODE_ENV !== 'production';

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-700';
      case 'pro': return 'bg-blue-100 text-blue-700';
      case 'enterprise': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <Card className={`transition-all ${editedOrg.is_active ? 'border-green-200' : 'border-red-200 opacity-75'}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {editedOrg.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold">{editedOrg.name}</h3>
                  <Badge variant={editedOrg.is_active ? 'default' : 'secondary'}>
                    {editedOrg.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge className={getPlanColor(editedOrg.plan_type || 'free')}>
                    {(editedOrg.plan_type || 'free').toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>Slug: {editedOrg.slug}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Created: {new Date(editedOrg.created_at).toLocaleDateString()}</span>
                  </div>
                  {editedOrg.domain && (
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4" />
                      <span>Domain: {editedOrg.domain}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Max Responses: {editedOrg.max_responses || 100}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <Button
                  variant={editedOrg.is_active ? "destructive" : "default"}
                  size="sm"
                  onClick={() => onToggleActive(editedOrg.id, editedOrg.is_active)}
                >
                  {editedOrg.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditOpen(true)}
                >
                  Edit
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
                      <DialogTitle>User Management - {editedOrg.name}</DialogTitle>
                    </DialogHeader>
                    <UserManagement 
                      organizationId={editedOrg.id} 
                      organizationName={editedOrg.name}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <Select
                value={editedOrg.plan_type || 'free'}
                onValueChange={(value) => onUpdatePlan(editedOrg.id, value)}
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
          {isDev && (
            <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <div>
                <span className="font-bold">DEBUG:</span> plan_type:{" "}
                <span className="font-mono">{editedOrg.plan_type ?? "N/A"}</span><br />
                features_config:{" "}
                <span className="font-mono break-all">
                  {editedOrg.features_config
                    ? JSON.stringify(editedOrg.features_config)
                    : "N/A"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {editOpen && (
        <EditOrganizationModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          organization={editedOrg}
          onSave={updated => setEditedOrg(updated)}
        />
      )}
    </>
  );
};
