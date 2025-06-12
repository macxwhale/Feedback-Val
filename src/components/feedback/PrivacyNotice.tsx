
import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PrivacyNoticeProps {
  isVisible: boolean;
  onAccept: () => void;
}

export const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({
  isVisible,
  onAccept
}) => {
  if (!isVisible) return null;

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50 animate-fade-in">
      <Shield className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-700">
        <div className="space-y-2">
          <p className="font-medium">Your Privacy Matters</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>Anonymous</span>
            </div>
          </div>
          <button
            onClick={onAccept}
            className="text-blue-600 underline text-sm hover:text-blue-800"
          >
            I understand
          </button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
