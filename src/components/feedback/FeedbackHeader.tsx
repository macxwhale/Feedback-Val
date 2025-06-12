
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, ArrowLeft } from 'lucide-react';

export const FeedbackHeader: React.FC = () => {
  return (
    <div className="relative mb-8">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl opacity-50" />
      
      <div className="relative text-center py-8 px-6">
        <Link 
          to="/admin" 
          className="absolute top-4 right-4 p-3 text-gray-400 hover:text-[#073763] transition-all duration-200 hover:bg-white hover:shadow-lg rounded-full group"
          title="Admin Dashboard"
        >
          <Settings size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </Link>
        
        <div className="mb-6">
          <div className="relative inline-block">
            <img 
              src="/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png" 
              alt="Police Sacco Logo" 
              className="h-20 mx-auto mb-4 drop-shadow-lg transform transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-orange-600/20 rounded-full blur-xl opacity-30" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#073763] to-[#f97316] bg-clip-text text-transparent">
            Police Sacco Feedback
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Your feedback drives our commitment to excellence. Share your experience to help us serve you better.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Secure & Confidential</span>
          </div>
        </div>
      </div>
    </div>
  );
};
