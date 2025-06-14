
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Shield, 
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Zap,
  Heart,
  Target,
  PlayCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Multi-Channel Feedback",
      description: "Collect insights via forms, SMS, and QR codes in one unified platform"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Smart Analytics",
      description: "AI-powered sentiment analysis and categorization for actionable insights"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Real-Time Dashboards",
      description: "Beautiful, intuitive dashboards that turn data into decisions"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Share insights across teams with role-based access controls"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Alerts",
      description: "Get notified immediately when feedback requires attention"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance and data encryption"
    }
  ];

  const howItWorks = [
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

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses just getting started",
      features: [
        "Up to 1,000 responses/month",
        "Basic analytics & reporting", 
        "Email support",
        "Standard templates"
      ],
      popular: false,
      cta: "Start free trial"
    },
    {
      name: "Professional", 
      price: "$89",
      period: "/month",
      description: "Advanced features for growing businesses",
      features: [
        "Up to 10,000 responses/month",
        "Advanced AI analytics",
        "Priority support",
        "Custom branding",
        "Team collaboration",
        "API access"
      ],
      popular: true,
      cta: "Start free trial"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large organizations", 
      features: [
        "Unlimited responses",
        "White-label solution",
        "Dedicated success manager",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security"
      ],
      popular: false,
      cta: "Contact sales"
    }
  ];

  const testimonials = [
    {
      quote: "FeedbackPro helped us increase customer satisfaction by 40% in just 3 months. The insights are game-changing.",
      author: "Sarah Chen",
      role: "Head of Customer Success",
      company: "TechStart Inc"
    },
    {
      quote: "Finally, a feedback tool that's actually easy to use. Our team loves the real-time dashboards.",
      author: "Marcus Johnson", 
      role: "Operations Director",
      company: "RetailCorp"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FeedbackPro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign in
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25"
              >
                Get started free
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin/login')}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
              <Star className="w-3 h-3 mr-1" />
              Trusted by 2,000+ businesses
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Customer Feedback Into
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Growth</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Collect, analyze, and act on customer feedback with AI-powered insights. 
              Make data-driven decisions that actually move the needle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 shadow-lg shadow-blue-600/25 group"
              >
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-50 text-lg px-8 py-4 group"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Watch demo
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              No credit card required • 14-day free trial • Setup in under 5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your customer feedback into actionable insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-600/25 group-hover:scale-110 transition-transform duration-200">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-blue-600 flex items-center justify-center text-sm font-bold text-blue-600">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Beautiful dashboards that make sense
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See your feedback data come to life with intuitive visualizations and actionable insights
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl shadow-gray-900/10 p-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 min-h-96 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700">Interactive Dashboard Preview</p>
                <p className="text-gray-500 mt-2">See real-time analytics and insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to understand your customers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you collect, analyze, and act on customer feedback
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-200 group">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-200">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by businesses worldwide
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg shadow-gray-900/5">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that's right for your business. Upgrade or downgrade at any time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`border-0 shadow-lg shadow-gray-900/5 relative ${
                plan.popular 
                  ? 'ring-2 ring-blue-600 shadow-xl shadow-blue-600/10 scale-105' 
                  : 'hover:shadow-xl hover:shadow-gray-900/10'
              } transition-all duration-200`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600">{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    onClick={() => navigate('/auth')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-sm text-gray-500">
              All plans include a 14-day free trial. No setup fees. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your customer feedback?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses using FeedbackPro to make better decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 shadow-lg group"
            >
              Start your free trial
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
            >
              Contact sales
            </Button>
          </div>
          <p className="text-sm text-blue-100 mt-6">
            No credit card required • Setup takes less than 5 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="h-3 w-3 text-white" />
              </div>
              <span className="text-xl font-bold">FeedbackPro</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 FeedbackPro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
