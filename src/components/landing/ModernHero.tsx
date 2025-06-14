
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity } from 'lucide-react';

export const ModernHero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-green-400/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-pulse-gentle" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center space-y-12 animate-fade-in">
          {/* Trust indicator */}
          <div className="flex items-center justify-center space-x-2 text-gray-400 mb-8">
            <div className="flex -space-x-1">
              <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-gray-800 animate-pulse-gentle"></div>
              <div className="w-6 h-6 bg-green-400 rounded-full border-2 border-gray-800 animate-pulse-gentle" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-800 animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
            </div>
            <span className="text-sm font-medium">Trusted by 2,000+ businesses worldwide</span>
          </div>

          {/* Main headline */}
          <div className="space-y-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="relative">
                <Activity className="w-12 h-12 text-purple-500 animate-pulse-gentle" />
                <div className="absolute inset-0 w-12 h-12 bg-purple-500 rounded-full opacity-20 animate-ping"></div>
              </div>
              <h1 className="text-6xl lg:text-8xl font-space font-black text-white tracking-tight">
                Pulsify
              </h1>
            </div>
            
            <div className="relative">
              <h2 className="text-4xl lg:text-6xl font-space font-bold text-white leading-tight max-w-5xl mx-auto">
                Streamline Customer
                <br />
                <span className="relative">
                  <span className="bg-gradient-to-r from-purple-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                    Delivery
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-green-400 to-blue-400 rounded-full animate-scale-in"></div>
                </span>
              </h2>
            </div>
          </div>

          {/* Value proposition */}
          <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto font-medium">
            Harness the power of AI-driven analytics to turn customer insights into 
            <span className="text-purple-400 font-semibold"> actionable strategies</span> that 
            drive real business results.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col gap-6 justify-center items-center pt-8 max-w-md mx-auto">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-full px-8 py-4 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
          </div>

          {/* Dashboard preview */}
          <div className="mt-20 relative">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 shadow-2xl max-w-5xl mx-auto">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white">Customer Insights Dashboard</h3>
                  <p className="text-gray-400 mt-1">Real-time analytics and feedback trends</p>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-gentle"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse-gentle" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
              
              {/* Stats cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { value: "2,847", label: "Total Responses", color: "from-purple-500 to-blue-500" },
                  { value: "94%", label: "Satisfaction", color: "from-green-400 to-emerald-500" },
                  { value: "+23%", label: "This Month", color: "from-yellow-400 to-orange-500" },
                  { value: "4.8", label: "Avg Rating", color: "from-pink-400 to-purple-500" }
                ].map((stat, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-2xl p-6 border border-gray-600/30">
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                    <div className={`w-full h-1 bg-gradient-to-r ${stat.color} rounded-full mt-3 animate-scale-in`} style={{ animationDelay: `${index * 0.2}s` }}></div>
                  </div>
                ))}
              </div>
              
              {/* Chart area */}
              <div className="bg-gray-900/50 rounded-2xl p-8 min-h-64 flex items-center justify-center border border-gray-600/30">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 animate-pulse-gentle">
                    <Activity className="w-12 h-12" />
                  </div>
                  <p className="text-2xl font-bold text-white mb-3">
                    Interactive Analytics
                  </p>
                  <p className="text-gray-400 font-medium">
                    Real-time charts, sentiment analysis, and trend visualization
                  </p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-purple-500/20 rounded-2xl opacity-60 animate-float"></div>
            <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-green-400/20 rounded-3xl opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 pt-12 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span className="font-medium">14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span className="font-medium">Setup in under 5 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
