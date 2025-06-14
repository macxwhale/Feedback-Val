
import React from 'react';
import { BarChart3, TrendingUp, Users, Heart, ArrowRight } from 'lucide-react';
import { FluidBackground } from './FluidBackground';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const DashboardPreview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 bg-white dark:bg-transparent overflow-hidden">
      <FluidBackground variant="dark" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="bg-white/90 dark:bg-dark-warm-100/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-warm-gray-900/10 dark:shadow-dark-warm-50/20 p-8 lg:p-12 border border-warm-gray-200/50 dark:border-dark-warm-300/50">
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-space font-bold text-warm-gray-900 dark:text-dark-warm-900">
                    Insights Dashboard
                  </h3>
                  <p className="text-warm-gray-600 dark:text-dark-warm-600 mt-1">Real-time analytics</p>
                </div>
                <div className="flex space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-gentle"></div>
                  <div className="w-3 h-3 bg-sunset-500 rounded-full animate-pulse-gentle" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-3 h-3 bg-coral-500 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: <Users className="w-5 h-5" />, value: "2.8k+", label: "Responses", color: "from-sunset-500 to-coral-500" },
                  { icon: <Heart className="w-5 h-5" />, value: "94%", label: "Satisfaction", color: "from-coral-500 to-golden-400" },
                  { icon: <TrendingUp className="w-5 h-5" />, value: "+23%", label: "This Month", color: "from-golden-400 to-sunset-500" },
                  { icon: <BarChart3 className="w-5 h-5" />, value: "4.8", label: "Avg Rating", color: "from-sunset-500 to-coral-500" }
                ].map((stat, index) => (
                  <div key={index} className="bg-gradient-to-br from-warm-gray-50 to-white dark:from-dark-warm-200 dark:to-dark-warm-100 rounded-2xl p-4 border border-warm-gray-200/50 dark:border-dark-warm-300/50">
                    <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-white mb-2`}>
                      {stat.icon}
                    </div>
                    <div className="text-xl font-space font-bold text-warm-gray-900 dark:text-dark-warm-900">{stat.value}</div>
                    <div className="text-xs text-warm-gray-600 dark:text-dark-warm-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-br from-sunset-50 via-coral-50 to-golden-50 dark:from-dark-warm-200 dark:via-dark-warm-300 dark:to-dark-warm-200 rounded-2xl p-8 min-h-64 flex items-center justify-center border border-warm-gray-200/50 dark:border-dark-warm-400/50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-sunset-500 to-coral-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 animate-pulse-gentle">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                  <p className="text-xl font-space font-bold text-warm-gray-700 dark:text-dark-warm-700">
                    Interactive Analytics
                  </p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-sunset-400 to-coral-400 rounded-2xl opacity-20 animate-float"></div>
            <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-golden-400 to-sunset-400 rounded-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
          <div className="text-center lg:text-left animate-fade-in order-1 lg:order-2">
            <div className="flex items-center justify-center lg:justify-start space-x-2 text-warm-gray-600 dark:text-dark-warm-600 mb-8">
              <BarChart3 className="w-6 h-6 text-sunset-500" />
              <span className="text-lg font-space font-medium">What Is Pulsify</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-space font-black text-warm-gray-900 dark:text-dark-warm-900 mb-8 leading-tight">
              Your{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 bg-clip-text text-transparent">
                  complete
                </span>
                <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 rounded-full animate-scale-in"></div>
              </span>
              {' '}customer feedback platform
            </h2>
            
            <p className="text-xl lg:text-2xl text-warm-gray-600 dark:text-dark-warm-600 max-w-4xl lg:max-w-none mx-auto leading-relaxed font-medium mb-12">
              Pulsify is an AI-powered feedback management system that helps businesses collect, analyze, and act on customer insights to drive growth and improve satisfaction
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white font-space font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center">
                See Live Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
