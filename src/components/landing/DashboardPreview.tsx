
import React from 'react';
import { BarChart3, TrendingUp, Users, Heart } from 'lucide-react';
import { FluidBackground } from './FluidBackground';

export const DashboardPreview: React.FC = () => {
  return (
    <section className="relative py-32 bg-white dark:bg-dark-warm-50 overflow-hidden">
      {/* Fluid Background */}
      <FluidBackground variant="dark" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 text-warm-gray-600 dark:text-dark-warm-600 mb-8">
            <BarChart3 className="w-6 h-6 text-sunset-500" />
            <span className="text-lg font-space font-medium">Dashboard Preview</span>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-space font-black text-warm-gray-900 dark:text-dark-warm-900 mb-8 leading-tight">
            Beautiful{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 bg-clip-text text-transparent">
                dashboards
              </span>
              <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 rounded-full animate-scale-in"></div>
            </span>
            {' '}that make sense
          </h2>
          
          <p className="text-2xl lg:text-3xl text-warm-gray-600 dark:text-dark-warm-600 max-w-4xl mx-auto leading-relaxed font-medium">
            See your feedback data come to life with{' '}
            <span className="text-sunset-600 dark:text-sunset-400 font-semibold">intuitive visualizations</span>
            {' '}and actionable insights
          </p>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Main dashboard preview */}
          <div className="bg-white/90 dark:bg-dark-warm-100/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-warm-gray-900/10 dark:shadow-dark-warm-50/20 p-12 border border-warm-gray-200/50 dark:border-dark-warm-300/50">
            
            {/* Dashboard header */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-space font-bold text-warm-gray-900 dark:text-dark-warm-900">
                  Customer Insights Dashboard
                </h3>
                <p className="text-warm-gray-600 dark:text-dark-warm-600 mt-2">Real-time analytics and feedback trends</p>
              </div>
              <div className="flex space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-gentle"></div>
                <div className="w-3 h-3 bg-sunset-500 rounded-full animate-pulse-gentle" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-3 h-3 bg-coral-500 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { icon: <Users className="w-6 h-6" />, value: "2,847", label: "Total Responses", color: "from-sunset-500 to-coral-500" },
                { icon: <Heart className="w-6 h-6" />, value: "94%", label: "Satisfaction", color: "from-coral-500 to-golden-400" },
                { icon: <TrendingUp className="w-6 h-6" />, value: "+23%", label: "This Month", color: "from-golden-400 to-sunset-500" },
                { icon: <BarChart3 className="w-6 h-6" />, value: "4.8", label: "Avg Rating", color: "from-sunset-500 to-coral-500" }
              ].map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-warm-gray-50 to-white dark:from-dark-warm-200 dark:to-dark-warm-100 rounded-2xl p-6 border border-warm-gray-200/50 dark:border-dark-warm-300/50">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-space font-bold text-warm-gray-900 dark:text-dark-warm-900">{stat.value}</div>
                  <div className="text-sm text-warm-gray-600 dark:text-dark-warm-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Chart placeholder */}
            <div className="bg-gradient-to-br from-sunset-50 via-coral-50 to-golden-50 dark:from-dark-warm-200 dark:via-dark-warm-300 dark:to-dark-warm-200 rounded-2xl p-12 min-h-96 flex items-center justify-center border border-warm-gray-200/50 dark:border-dark-warm-400/50">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-sunset-500 to-coral-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 animate-pulse-gentle">
                  <BarChart3 className="w-12 h-12" />
                </div>
                <p className="text-2xl font-space font-bold text-warm-gray-700 dark:text-dark-warm-700 mb-3">
                  Interactive Analytics
                </p>
                <p className="text-warm-gray-600 dark:text-dark-warm-600 font-medium">
                  Real-time charts, sentiment analysis, and trend visualization
                </p>
              </div>
            </div>
          </div>
          
          {/* Floating elements around dashboard */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-sunset-400 to-coral-400 rounded-2xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-golden-400 to-sunset-400 rounded-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </section>
  );
};
