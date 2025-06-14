
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 bg-gradient-to-br from-purple-600 via-blue-600 to-green-500 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full animate-float blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full animate-pulse-gentle blur-lg"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full animate-pulse-gentle blur-lg"></div>
        <div className="absolute bottom-1/3 right-1/3 w-36 h-36 bg-white/5 rounded-full animate-float blur-xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="flex items-center justify-center space-x-3 mb-12">
          <div className="relative">
            <Activity className="w-8 h-8 text-white animate-pulse-gentle" />
            <div className="absolute inset-0 w-8 h-8 bg-white rounded-full opacity-20 animate-ping"></div>
          </div>
          <span className="text-white/90 text-lg font-space font-medium">Join 2,000+ happy customers</span>
        </div>

        <h2 className="text-5xl lg:text-7xl font-space font-black text-white mb-10 leading-tight">
          Ready to{' '}
          <span className="relative">
            transform
            <div className="absolute -bottom-4 left-0 right-0 h-2 bg-white rounded-full animate-scale-in"></div>
          </span>
          <br />
          your customer feedback?
        </h2>
        
        <p className="text-2xl lg:text-3xl text-white/95 mb-16 leading-relaxed max-w-4xl mx-auto font-medium">
          Join thousands of businesses using Pulsify to make{' '}
          <span className="font-bold">better decisions</span>
        </p>
        
        <div className="flex flex-col gap-6 justify-center mb-16 max-w-md mx-auto">
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 hover:border-white/50 rounded-full font-bold text-lg px-8 py-4 transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center justify-center">
              Start Free
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Button>
          
          <Button 
            size="lg" 
            className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 hover:border-white/40 rounded-full font-bold text-lg px-8 py-4 transition-all duration-300 hover:scale-105"
          >
            Contact Sales
          </Button>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-2xl mx-auto border border-white/20">
          <p className="text-xl lg:text-2xl text-white/90 font-medium">
            <span className="font-bold">No credit card required</span> • Setup takes less than 5 minutes
            <br />
            <span className="text-white/80">14-day free trial with full access to all features</span>
          </p>
        </div>
      </div>
    </section>
  );
};
