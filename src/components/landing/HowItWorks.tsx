
import React from 'react';
import { MessageSquare, BarChart3, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Collect Feedback",
      description: "Multi-channel collection through forms, SMS, QR codes, and more",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "AI Analysis",
      description: "Automatic sentiment analysis and categorization for instant insights",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Take Action",
      description: "Get real-time alerts and actionable recommendations",
      gradient: "from-yellow-400 to-orange-500"
    }
  ];

  return (
    <section className="relative py-32 bg-gray-900 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse-gentle"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center space-x-2 text-gray-400 mb-8">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-medium">How It Works</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-space font-black text-white mb-8 leading-tight">
            Simplify Your{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-purple-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                Workflow
              </span>
              <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 via-green-400 to-blue-400 rounded-full animate-scale-in"></div>
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
            Transform customer feedback into growth with our streamlined three-step process
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 transition-all duration-300 group-hover:scale-105 group-hover:border-purple-500/30">
                <div className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-space font-bold text-white mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Step number */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg px-12 py-6 rounded-full shadow-xl shadow-purple-500/30 transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center">
              Start Your Free Trial
              <ArrowRight className="ml-3 h-5 w-5" />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};
