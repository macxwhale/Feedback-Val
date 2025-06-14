
import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-warm-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="relative">
              <Heart className="w-8 h-8 text-sunset-500" />
              <div className="absolute inset-0 w-8 h-8 bg-sunset-500 rounded-full opacity-20 animate-ping"></div>
            </div>
            <span className="text-2xl font-space font-bold">Pulselify</span>
          </div>
          <div className="text-warm-gray-400">
            © 2024 Pulselify. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
