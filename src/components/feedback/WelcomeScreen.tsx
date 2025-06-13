
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Clock, Users } from 'lucide-react';
import { useOrganizationConfig } from '@/hooks/useOrganizationConfig';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { 
    organization, 
    logoAsset, 
    colors, 
    welcomeTitle, 
    welcomeDescription,
    flowConfig 
  } = useOrganizationConfig();

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: colors.primary }}
        />
        <div 
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: colors.secondary }}
        />
      </div>

      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12 max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="relative inline-block">
            <img 
              src={logoAsset?.asset_url || organization.logo_url || "/placeholder.svg"} 
              alt={logoAsset?.asset_name || `${organization.name} Logo`}
              className="h-20 mx-auto mb-6 drop-shadow-lg transform transition-transform duration-300 hover:scale-105"
            />
            <div 
              className="absolute -inset-4 rounded-full blur-xl opacity-20"
              style={{ 
                background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` 
              }}
            />
          </div>
        </div>

        {/* Welcome Content */}
        <div className="space-y-6 mb-8">
          <h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
            style={{ 
              backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` 
            }}
          >
            {welcomeTitle}
          </h1>
          
          <p className="text-xl text-gray-700 leading-relaxed max-w-lg mx-auto">
            {welcomeDescription}
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex flex-col items-center space-y-2">
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <Clock 
                  className="w-6 h-6"
                  style={{ color: colors.primary }}
                />
              </div>
              <span className="text-sm text-gray-600">Quick & Easy</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <Shield 
                  className="w-6 h-6"
                  style={{ color: colors.primary }}
                />
              </div>
              <span className="text-sm text-gray-600">Secure & Private</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <Users 
                  className="w-6 h-6"
                  style={{ color: colors.primary }}
                />
              </div>
              <span className="text-sm text-gray-600">Your Voice Matters</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={onStart}
          size="lg"
          className="text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          style={{ 
            backgroundColor: colors.primary,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
          }}
        >
          Start Feedback
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>

        {/* Privacy Notice */}
        <p className="text-xs text-gray-500 mt-6 leading-relaxed">
          Your responses are confidential and will be used solely to improve our services. 
          This survey takes approximately 3-5 minutes to complete.
        </p>
      </div>
    </div>
  );
};
