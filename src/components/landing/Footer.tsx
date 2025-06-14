
import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#22223b] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-400 rounded-lg flex items-center justify-center">
              <Heart className="h-3 w-3 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wider">Pulselify</span>
          </div>
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Pulselify. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
