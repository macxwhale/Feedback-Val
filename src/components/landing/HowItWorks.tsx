
import React from 'react';
import { MessageSquare, BarChart3, Target } from 'lucide-react';
import { FluidBackground } from './FluidBackground';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "Collect",
      description: "Deploy feedback forms across touchpoints or send SMS surveys to gather comprehensive customer insights",
      icon: <MessageSquare className="h-10 w-10" />
    },
    {
      step: "02", 
      title: "Analyze",
      description: "AI automatically categorizes and analyzes sentiment in real-time with advanced machine learning algorithms",
      icon: <BarChart3 className="h-10 w-10" />
    },
    {
      step: "03",
      title: "Act",
      description: "Get actionable insights and track improvements over time with intelligent recommendations",
      icon: <Target className="h-10 w-10" />
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-warm-gray-50 via-white to-sunset-50/30 dark:from-dark-warm-50 dark:via-dark-warm-100 dark:to-dark-warm-50 overflow-hidden">
      {/* Fluid Background */}
      <FluidBackground />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 text-warm-gray-600 dark:text-dark-warm-600 mb-8">
            <div className="w-2 h-2 bg-sunset-500 rounded-full animate-pulse-gentle"></div>
            <span className="text-lg font-space font-medium">Our Process</span>
            <div className="w-2 h-2 bg-coral-500 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-space font-black text-warm-gray-900 dark:text-dark-warm-900 mb-8 leading-tight">
            How it{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 bg-clip-text text-transparent">
                works
              </span>
              <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 rounded-full animate-scale-in"></div>
            </span>
          </h2>
          
          <p className="text-2xl lg:text-3xl text-warm-gray-600 dark:text-dark-warm-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Three simple steps to transform your customer feedback into{' '}
            <span className="text-sunset-600 dark:text-sunset-400 font-semibold">actionable insights</span>
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center group relative">
              {/* Connection line */}
              {index < 2 && (
                <div className="hidden md:block absolute top-12 left-3/4 w-1/2 h-0.5 bg-gradient-to-r from-sunset-300 to-coral-300 dark:from-sunset-600 dark:to-coral-600 opacity-30"></div>
              )}
              
              <div className="relative mb-12 group-hover:scale-110 transition-transform duration-500">
                <div className="relative">
                  <div className="w-28 h-28 bg-gradient-to-br from-sunset-500 via-coral-500 to-golden-400 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-sunset-500/30 backdrop-blur-sm">
                    {step.icon}
                  </div>
                  <div className="absolute inset-0 w-28 h-28 bg-gradient-to-br from-sunset-500 via-coral-500 to-golden-400 rounded-3xl mx-auto opacity-20 animate-pulse-gentle"></div>
                </div>
                
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white dark:bg-dark-warm-100 rounded-2xl border-4 border-sunset-500 flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-xl font-space font-black text-sunset-600">{step.step}</span>
                </div>
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-space font-bold text-warm-gray-900 dark:text-dark-warm-900 mb-6">
                {step.title}
              </h3>
              
              <p className="text-warm-gray-600 dark:text-dark-warm-600 text-xl leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
