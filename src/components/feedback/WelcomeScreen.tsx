
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Shield, Star } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
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
            Share Your Experience
          </h1>
          <p className="text-xl text-blue-100">
            Help us serve you better with your valuable feedback
          </p>
        </div>
        
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Quick & Easy</h3>
                <p className="text-gray-600 text-sm">Takes only 3-5 minutes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Confidential</h3>
                <p className="text-gray-600 text-sm">Your privacy is protected</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Your Voice Matters</h3>
                <p className="text-gray-600 text-sm">Every response helps improve our services</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Make a Difference</h3>
                <p className="text-gray-600 text-sm">Shape the future of our services</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button
              onClick={onStart}
              size="lg"
              className="bg-gradient-to-r from-[#073763] to-[#f97316] hover:from-[#062c52] hover:to-[#e8640f] text-white px-12 py-4 text-lg font-semibold transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Feedback Survey
            </Button>
            <p className="text-gray-500 text-sm mt-4">
              Your responses are anonymous and help us improve our services
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
