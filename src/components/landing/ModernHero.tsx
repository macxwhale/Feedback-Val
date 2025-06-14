
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, TrendingUp, Users } from 'lucide-react';

export const ModernHero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-warm-gray-50 via-white to-sunset-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-sunset-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-golden-300 rounded-full opacity-20 animate-pulse-gentle"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-coral-200 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Trust indicator */}
            <div className="flex items-center space-x-2 text-warm-gray-600">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-sunset-400 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-golden-400 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-coral-400 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-sm font-medium">Trusted by 2,000+ businesses</span>
            </div>

            {/* Main headline */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Heart className="w-8 h-8 text-sunset-500 animate-pulse-gentle" />
                  <div className="absolute inset-0 w-8 h-8 bg-sunset-500 rounded-full opacity-20 animate-ping"></div>
                </div>
                <h1 className="text-5xl lg:text-7xl font-space font-bold text-warm-gray-900">
                  Pulselify
                </h1>
              </div>
              <h2 className="text-2xl lg:text-3xl font-space font-medium text-warm-gray-700 leading-tight">
                Transform customer feedback into 
                <span className="text-sunset-500"> growth</span>
              </h2>
            </div>

            {/* Value proposition */}
            <p className="text-lg text-warm-gray-600 leading-relaxed max-w-lg">
              Collect, analyze, and act on customer insights with AI-powered analytics. 
              Make data-driven decisions that actually move the needle.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white font-semibold px-8 py-4 text-lg shadow-xl shadow-sunset-500/25 hover:shadow-2xl hover:shadow-sunset-500/40 transition-all duration-300 group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/auth')}
                className="border-2 border-warm-gray-300 text-warm-gray-700 hover:bg-warm-gray-50 font-semibold px-8 py-4 text-lg"
              >
                Login
              </Button>
            </div>

            {/* Social proof indicators */}
            <div className="flex items-center space-x-6 pt-6 text-sm text-warm-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>14-day free trial</span>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative animate-scale-in">
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-warm-gray-900/10 p-8 border border-warm-gray-100">
              {/* Dashboard mockup */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-warm-gray-900">Customer Insights</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-coral-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-golden-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-sunset-50 to-sunset-100 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-sunset-600" />
                      <span className="text-sm font-medium text-sunset-800">Satisfaction</span>
                    </div>
                    <p className="text-2xl font-bold text-sunset-900">94%</p>
                    <p className="text-xs text-sunset-600">+12% this month</p>
                  </div>
                  <div className="bg-gradient-to-br from-golden-50 to-golden-100 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-golden-600" />
                      <span className="text-sm font-medium text-golden-800">Responses</span>
                    </div>
                    <p className="text-2xl font-bold text-golden-900">1,247</p>
                    <p className="text-xs text-golden-600">+8% this week</p>
                  </div>
                </div>

                {/* Chart placeholder */}
                <div className="bg-gradient-to-r from-warm-gray-50 to-warm-gray-100 rounded-xl p-6 h-40 flex items-end justify-between">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i}
                      className={`bg-gradient-to-t from-sunset-400 to-coral-400 rounded-t-lg animate-pulse-gentle`}
                      style={{ 
                        height: `${Math.random() * 100 + 20}%`,
                        width: '10%',
                        animationDelay: `${i * 0.2}s`
                      }}
                    ></div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex space-x-2">
                  <div className="flex-1 bg-warm-gray-100 rounded-lg h-8"></div>
                  <div className="w-20 bg-sunset-200 rounded-lg h-8"></div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-sunset-400 to-coral-400 rounded-full shadow-lg animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-golden-400 to-sunset-400 rounded-full shadow-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
