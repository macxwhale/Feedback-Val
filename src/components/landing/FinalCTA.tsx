
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-sunset-500 via-coral-500 to-golden-500 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full opacity-10 animate-pulse-gentle"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-space font-bold text-white mb-8 leading-tight">
          Ready to transform your customer feedback?
        </h2>
        <p className="text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
          Join thousands of businesses using Pulselify to make better decisions
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-white text-sunset-600 hover:bg-warm-gray-50 text-xl font-semibold px-10 py-6 shadow-2xl group"
          >
            Start your free trial
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-sunset-600 text-xl font-semibold px-10 py-6"
          >
            Contact sales
          </Button>
        </div>
        <p className="text-lg text-white/80 mt-8">
          No credit card required • Setup takes less than 5 minutes
        </p>
      </div>
    </section>
  );
};
