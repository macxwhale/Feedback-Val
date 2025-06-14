
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const ModernHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-lg border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Heart className="w-8 h-8 text-purple-500" />
              <div className="absolute inset-0 w-8 h-8 bg-purple-500 rounded-full opacity-20 animate-ping"></div>
            </div>
            <span className="text-2xl font-space font-bold text-white">Pulsify</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-gray-300 hover:text-white font-medium hover:bg-gray-800 rounded-full px-6"
            >
              Sign in
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full px-6 shadow-lg shadow-purple-500/25"
            >
              Get Started Free
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/login')}
              className="text-xs text-gray-500 hover:text-gray-400 rounded-full px-4"
            >
              Admin
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
