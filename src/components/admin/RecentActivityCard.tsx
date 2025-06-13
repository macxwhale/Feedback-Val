
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface RecentActivityCardProps {
  recentSessions: any[] | undefined;
  statsLoading: boolean;
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ 
  recentSessions, 
  statsLoading 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Recent Feedback Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {statsLoading ? (
          <div className="text-center py-4">Loading recent sessions...</div>
        ) : recentSessions?.length ? (
          <div className="space-y-3">
            {recentSessions.map((session: any) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Session #{session.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(session.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                  {session.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No feedback sessions yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};
