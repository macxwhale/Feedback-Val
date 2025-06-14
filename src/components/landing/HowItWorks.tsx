
import React from 'react';
import { MessageSquare, BarChart3, Target, Users, Building2, TrendingUp } from 'lucide-react';
import { FluidBackground } from './FluidBackground';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  const targetAudiences = [
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Small Businesses",
      description: "Restaurant owners, retail stores, and service providers looking to understand customer satisfaction"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Growing Companies",
      description: "Mid-size businesses scaling operations and needing structured feedback management"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Enterprise Teams",
      description: "Large organizations requiring advanced analytics and team collaboration features"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Collect",
      description: "Deploy feedback forms across touchpoints or send SMS surveys to gather customer insights",
      icon: <MessageSquare className="h-10 w-10" />
    },
    {
      step: "02", 
      title: "Analyze",
      description: "AI automatically categorizes and analyzes sentiment in real-time with machine learning",
      icon: <BarChart3 className="h-10 w-10" />
    },
    {
      step: "03",
      title: "Act",
      description: "Get actionable insights and track improvements with intelligent recommendations",
      icon: <Target className="h-10 w-10" />
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-warm-gray-50 via-white to-sunset-50/30 dark:from-dark-warm-50 dark:via-dark-warm-100 dark:to-dark-warm-50 overflow-hidden">
      <FluidBackground />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* WHO - Target Audience */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 text-warm-gray-600 dark:text-dark-warm-600 mb-8">
            <Users className="w-6 h-6 text-sunset-500" />
            <span className="text-lg font-space font-medium">Who It's For</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-space font-black text-warm-gray-900 dark:text-dark-warm-900 mb-8 leading-tight">
            Built for{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 bg-clip-text text-transparent">
                every business
              </span>
              <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 rounded-full animate-scale-in"></div>
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-warm-gray-600 dark:text-dark-warm-600 max-w-3xl mx-auto leading-relaxed font-medium mb-16">
            Whether you're starting out or scaling up, Pulsify helps you understand and improve customer satisfaction
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {targetAudiences.map((audience, index) => (
              <div key={index} className="bg-white/80 dark:bg-dark-warm-100/80 backdrop-blur-sm rounded-3xl p-8 border border-warm-gray-200/50 dark:border-dark-warm-300/50 group hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-sunset-500 to-coral-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {audience.icon}
                </div>
                <h3 className="text-xl font-space font-bold text-warm-gray-900 dark:text-dark-warm-900 mb-4">
                  {audience.title}
                </h3>
                <p className="text-warm-gray-600 dark:text-dark-warm-600 leading-relaxed">
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* HOW - Process */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 text-warm-gray-600 dark:text-dark-warm-600 mb-8">
            <div className="w-2 h-2 bg-sunset-500 rounded-full animate-pulse-gentle"></div>
            <span className="text-lg font-space font-medium">How It Works</span>
            <div className="w-2 h-2 bg-coral-500 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-space font-black text-warm-gray-900 dark:text-dark-warm-900 mb-8 leading-tight">
            Simple.{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 bg-clip-text text-transparent">
                Powerful.
              </span>
            </span>
            {' '}Effective.
          </h2>
          
          <p className="text-xl lg:text-2xl text-warm-gray-600 dark:text-dark-warm-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Three simple steps to transform feedback into growth
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-16 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center group relative">
              {index < 2 && (
                <div className="hidden md:block absolute top-12 left-3/4 w-1/2 h-0.5 bg-gradient-to-r from-sunset-300 to-coral-300 dark:from-sunset-600 dark:to-coral-600 opacity-30"></div>
              )}
              
              <div className="relative mb-12 group-hover:scale-110 transition-transform duration-500">
                <div className="relative">
                  <div className="w-28 h-28 bg-gradient-to-br from-sunset-500 via-coral-500 to-golden-400 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-sunset-500/30 backdrop-blur-sm">
                    {step.icon}
                  </div>
                  <div className="absolute inset-0 w-28 h-28 bg-gradient-to-br from-sunset-500 via-coral-500 to-golden-400 rounded-full mx-auto opacity-20 animate-pulse-gentle"></div>
                </div>
                
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white dark:bg-dark-warm-100 rounded-full border-4 border-sunset-500 flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-xl font-space font-black text-sunset-600">{step.step}</span>
                </div>
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-space font-bold text-warm-gray-900 dark:text-dark-warm-900 mb-6">
                {step.title}
              </h3>
              
              <p className="text-warm-gray-600 dark:text-dark-warm-600 text-lg leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 hover:from-sunset-600 hover:via-coral-600 hover:to-golden-500 text-white font-space font-bold text-lg px-12 py-6 rounded-full shadow-xl shadow-sunset-500/30 hover:shadow-2xl hover:shadow-sunset-500/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
};
