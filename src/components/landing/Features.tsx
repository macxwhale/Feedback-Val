
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { FluidBackground } from './FluidBackground';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Features: React.FC = () => {
  const navigate = useNavigate();

  const problems = [
    {
      problem: "Lost customers due to poor experiences",
      solution: "Get real-time alerts when issues arise",
      icon: <Users className="h-6 w-6" />,
      gradient: "from-sunset-500 to-coral-500"
    },
    {
      problem: "Making decisions without customer insights",
      solution: "AI-powered analytics reveal hidden patterns",
      icon: <BarChart3 className="h-6 w-6" />,
      gradient: "from-coral-500 to-golden-400"
    },
    {
      problem: "Scattered feedback across multiple channels",
      solution: "Unified platform for all customer touchpoints",
      icon: <MessageSquare className="h-6 w-6" />,
      gradient: "from-golden-400 to-sunset-500"
    }
  ];

  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Multi-Channel Collection",
      description: "Forms, SMS, QR codes - collect feedback everywhere customers are",
      gradient: "from-sunset-500 to-coral-500",
      benefits: ["Email & SMS surveys", "Web forms & QR codes", "Social media integration"]
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "AI-Powered Analysis",
      description: "Automatic sentiment analysis and categorization for instant insights",
      gradient: "from-coral-500 to-golden-400",
      benefits: ["Real-time sentiment analysis", "Automated categorization", "Trend identification"]
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-Time Alerts",
      description: "Get notified immediately when feedback requires urgent attention",
      gradient: "from-golden-400 to-sunset-500",
      benefits: ["Instant notifications", "Priority flagging", "Custom alert rules"]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance and data protection",
      gradient: "from-sunset-500 to-coral-500",
      benefits: ["SOC 2 compliance", "End-to-end encryption", "GDPR compliant"]
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-white via-warm-gray-50 to-sunset-50/20 dark:from-dark-warm-50 dark:via-dark-warm-100 dark:to-dark-warm-50 overflow-hidden">
      <FluidBackground />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Problems Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center space-x-2 text-warm-gray-600 dark:text-dark-warm-600 mb-6">
            <TrendingUp className="w-5 h-5 text-sunset-500" />
            <span className="text-sm font-medium uppercase tracking-wide">Why It Matters</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-space font-black text-warm-gray-900 dark:text-dark-warm-900 mb-6 leading-tight">
            Stop losing{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 bg-clip-text text-transparent">
                customers
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 rounded-full"></div>
            </span>
            {' '}to poor experiences
          </h2>
          
          <p className="text-lg lg:text-xl text-warm-gray-600 dark:text-dark-warm-600 max-w-4xl mx-auto leading-relaxed font-medium mb-12">
            Without proper feedback management, businesses miss critical insights that could prevent customer churn and drive growth
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((item, index) => (
              <div key={index} className="bg-white dark:bg-dark-warm-100 rounded-2xl p-6 border border-warm-gray-200/50 dark:border-dark-warm-300/50 group hover:shadow-lg transition-all duration-300">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center text-white mx-auto mb-4`}>
                  {item.icon}
                </div>
                <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                  Problem: {item.problem}
                </div>
                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Solution: {item.solution}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-16">
          <h3 className="text-2xl lg:text-4xl font-space font-bold text-warm-gray-900 dark:text-dark-warm-900 mb-12">
            Powerful features that make the difference
          </h3>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white dark:bg-dark-warm-100 hover:shadow-xl transition-all duration-300 group rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-space font-bold text-warm-gray-900 dark:text-dark-warm-900 leading-tight mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-warm-gray-600 dark:text-dark-warm-600 leading-relaxed font-medium">
                      {feature.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-warm-gray-600 dark:text-dark-warm-600 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 hover:from-sunset-600 hover:via-coral-600 hover:to-golden-500 text-white font-space font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300"
          >
            <span className="flex items-center">
              See All Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};
