
import React from 'react';
import { MessageSquare, BarChart3, Target } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "Collect",
      description: "Deploy feedback forms across touchpoints or send SMS surveys",
      icon: <MessageSquare className="h-8 w-8" />
    },
    {
      step: "02", 
      title: "Analyze",
      description: "AI automatically categorizes and analyzes sentiment in real-time",
      icon: <BarChart3 className="h-8 w-8" />
    },
    {
      step: "03",
      title: "Act",
      description: "Get actionable insights and track improvements over time",
      icon: <Target className="h-8 w-8" />
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-warm-gray-50 to-sunset-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-space font-bold text-warm-gray-900 mb-6">
            How it works
          </h2>
          <p className="text-xl text-warm-gray-600 max-w-3xl mx-auto leading-relaxed">
            Three simple steps to transform your customer feedback into actionable insights
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-sunset-500 to-coral-500 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-sunset-500/25 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full border-2 border-sunset-500 flex items-center justify-center text-sm font-bold text-sunset-600 shadow-lg">
                  {step.step}
                </div>
              </div>
              <h3 className="text-2xl font-space font-semibold text-warm-gray-900 mb-4">{step.title}</h3>
              <p className="text-warm-gray-600 text-lg leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
