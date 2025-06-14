
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 w-full bg-[#f7f8fa]/90 backdrop-blur border-b border-blue-50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-400 rounded-lg flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-900 tracking-wider select-none">Pulselify</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost"
              onClick={() => navigate('/auth')}
              className="text-gray-600 hover:text-blue-700 hover:bg-transparent"
            >
              Sign in
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 text-white shadow-lg rounded-full px-6 hover:scale-105 transition"
            >
              Get started free
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
