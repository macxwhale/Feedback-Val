
import React from 'react';
import { Loader2 } from 'lucide-react';

export const EnhancedLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="relative mb-6">
          <Loader2 className="h-16 w-16 text-[#f97316] animate-spin mx-auto" />
          <div className="absolute inset-0 h-16 w-16 border-4 border-orange-200 rounded-full animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold text-[#073763] mb-2">
          Loading Your Feedback Form
        </h3>
        <p className="text-gray-600 animate-pulse">
          Preparing your personalized experience...
        </p>
        <div className="mt-4 flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#f97316] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
