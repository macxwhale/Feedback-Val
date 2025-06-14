
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Features: React.FC = () => {
  const navigate = useNavigate();

  const problems = [
    {
      problem: "Lost customers due to poor experiences",
      solution: "Get real-time alerts when issues arise",
      icon: <Users className="h-8 w-8" />,
      gradient: "from-purple-500 to-blue-500"
    },
    {
      problem: "Making decisions without customer insights",
      solution: "AI-powered analytics reveal hidden patterns",
      icon: <BarChart3 className="h-8 w-8" />,
      gradient: "from-green-400 to-emerald-500"
    },
    {
      problem: "Scattered feedback across multiple channels",
      solution: "Unified platform for all customer touchpoints",
      icon: <MessageSquare className="h-8 w-8" />,
      gradient: "from-yellow-400 to-orange-500"
    }
  ];

  const features = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Multi-Channel Collection",
      description: "Forms, SMS, QR codes - collect feedback everywhere customers are",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "AI-Powered Analysis",
      description: "Automatic sentiment analysis and categorization for instant insights",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-Time Alerts",
      description: "Get notified immediately when feedback requires urgent attention",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance and data protection",
      gradient: "from-pink-400 to-purple-500"
    }
  ];

  return (
    <section className="relative py-32 bg-gray-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-float"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* WHY - Problems section */}
        <div className="text-center mb-24">
          <div className="flex items-center justify-center space-x-2 text-gray-400 mb-8">
            <TrendingUp className="w-6 h-6 text-purple-500" />
            <span className="text-lg font-medium">Why It Matters</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-space font-black text-white mb-8 leading-tight">
            Stop losing{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-purple-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                customers
              </span>
              <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 via-green-400 to-blue-400 rounded-full animate-scale-in"></div>
            </span>
            {' '}to poor experiences
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium mb-16">
            Without proper feedback management, businesses miss critical insights that could prevent customer churn and drive growth
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {problems.map((item, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 group hover:scale-105 transition-all duration-300 hover:border-purple-500/30">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <div className="text-lg font-space font-bold text-red-400 mb-4">
                  Problem: {item.problem}
                </div>
                <div className="text-lg font-space font-semibold text-green-400">
                  Solution: {item.solution}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl lg:text-4xl font-space font-bold text-white mb-8">
            Powerful features that make the difference
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-xl bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-500 group hover:scale-105 rounded-3xl overflow-hidden border border-gray-700/50 hover:border-purple-500/30">
              <CardHeader className="pb-6 pt-8">
                <div className="relative mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                    {feature.icon}
                  </div>
                </div>
                
                <CardTitle className="text-xl lg:text-2xl font-space font-bold text-white leading-tight">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-lg leading-relaxed font-medium">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-space font-bold text-lg px-12 py-6 rounded-full shadow-xl shadow-purple-500/30 transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center">
              See All Features
              <ArrowRight className="ml-3 h-5 w-5" />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};
