
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export const ModernHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full bg-transparent backdrop-blur-lg border-b border-warm-gray-100/20 dark:border-dark-warm-200/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <Activity className="w-8 h-8 text-sunset-500" aria-label="Pulsify pulse icon" />
              <div className="absolute inset-0 w-8 h-8 bg-sunset-500 rounded-full opacity-20 animate-ping"></div>
            </div>
            <span className="text-2xl font-space font-bold text-warm-gray-900 dark:text-dark-warm-900">
              Pulsify
            </span>
          </Link>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white font-semibold shadow-lg shadow-sunset-500/25 px-8 py-3"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
