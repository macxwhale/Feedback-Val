
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const ModernHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-lg border-b border-warm-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Heart className="w-8 h-8 text-sunset-500" />
              <div className="absolute inset-0 w-8 h-8 bg-sunset-500 rounded-full opacity-20 animate-ping"></div>
            </div>
            <span className="text-2xl font-space font-bold text-warm-gray-900">Pulselify</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-warm-gray-600 hover:text-warm-gray-900 font-medium"
            >
              Sign in
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white font-semibold shadow-lg shadow-sunset-500/25"
            >
              Get Started Free
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/login')}
              className="text-xs text-warm-gray-400 hover:text-warm-gray-600"
            >
              Admin
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
