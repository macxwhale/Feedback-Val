
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity } from 'lucide-react';
import { FluidBackground } from './FluidBackground';
import { FloatingMetrics } from './FloatingMetrics';

export const ModernHero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-white dark:bg-dark-warm-50 overflow-hidden">
      {/* Fluid Background */}
      <FluidBackground />
      <FluidBackground variant="dark" />
      
      {/* Floating Metrics */}
      <FloatingMetrics />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center space-y-12 animate-fade-in">
          {/* Trust indicator */}
          <div className="flex items-center justify-center space-x-2 text-warm-gray-600 dark:text-dark-warm-600">
            <div className="flex -space-x-1">
              <div className="w-6 h-6 bg-sunset-400 rounded-full border-2 border-white dark:border-dark-warm-100 animate-pulse-gentle"></div>
              <div className="w-6 h-6 bg-golden-400 rounded-full border-2 border-white dark:border-dark-warm-100 animate-pulse-gentle" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-6 h-6 bg-coral-400 rounded-full border-2 border-white dark:border-dark-warm-100 animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
            </div>
            <span className="text-sm font-medium">Trusted by 2,000+ businesses worldwide</span>
          </div>

          {/* Main headline with bold typography */}
          <div className="space-y-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="relative">
                <Activity className="w-12 h-12 text-sunset-500 animate-pulse-gentle" />
                <div className="absolute inset-0 w-12 h-12 bg-sunset-500 rounded-full opacity-20 animate-ping"></div>
              </div>
              <h1 className="text-6xl lg:text-8xl font-space font-black text-warm-gray-900 dark:text-dark-warm-900 tracking-tight">
                Pulsify
              </h1>
            </div>
            
            {/* Premium typography treatment */}
            <div className="relative">
              <h2 className="text-4xl lg:text-6xl font-space font-bold text-warm-gray-800 dark:text-dark-warm-800 leading-tight max-w-5xl mx-auto">
                Transform{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 bg-clip-text text-transparent">
                    customer feedback
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 rounded-full animate-scale-in"></div>
                </span>
                {' '}into meaningful{' '}
                <span className="bg-gradient-to-r from-golden-400 via-sunset-500 to-coral-500 bg-clip-text text-transparent font-black">
                  growth
                </span>
              </h2>
            </div>
          </div>

          {/* Enhanced value proposition */}
          <p className="text-xl lg:text-2xl text-warm-gray-600 dark:text-dark-warm-600 leading-relaxed max-w-4xl mx-auto font-medium">
            Harness the power of AI-driven analytics to turn customer insights into 
            <span className="text-sunset-600 dark:text-sunset-400 font-semibold"> actionable strategies</span> that 
            drive real business results.
          </p>

          {/* Updated CTA button */}
          <div className="flex flex-col gap-6 justify-center items-center pt-8 max-w-md mx-auto">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="w-full"
            >
              <span className="flex items-center justify-center">
                Book a Demo
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
          </div>

          {/* Enhanced social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 pt-12 text-sm text-warm-gray-500 dark:text-dark-warm-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span className="font-medium">14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span className="font-medium">Setup in under 5 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
