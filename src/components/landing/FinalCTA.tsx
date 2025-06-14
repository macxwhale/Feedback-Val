
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to transform your customer feedback?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of businesses using Pulselify to make better decisions
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 shadow-lg group"
          >
            Start your free trial
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
          >
            Contact sales
          </Button>
        </div>
        <p className="text-sm text-blue-100 mt-6">
          No credit card required • Setup takes less than 5 minutes
        </p>
      </div>
    </section>
  );
};
