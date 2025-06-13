
import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-[#073763] to-[#f97316] p-8 text-white text-center">
          <img 
            src="/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png" 
            alt="Police Sacco Logo" 
            className="h-20 mx-auto mb-6 drop-shadow-lg"
          />
          <h1 className="text-4xl font-bold mb-3">
            Police Sacco Feedback
          </h1>
          <p className="text-xl text-blue-100">
            Your feedback drives our commitment to excellence. Share your experience to help us serve you better.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center gap-2 text-green-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Secure & Confidential</span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">Your Privacy Matters</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-blue-700">
                <Lock className="h-4 w-4" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-blue-700">
                <Eye className="h-4 w-4" />
                <span>Anonymous</span>
              </div>
            </div>
            
            <div className="text-center">
              <Button
                onClick={onAccept}
                size="lg"
                className="bg-gradient-to-r from-[#073763] to-[#f97316] hover:from-[#062c52] hover:to-[#e8640f] text-white px-12 py-3 text-lg font-semibold transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                I understand
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
