
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { FluidBackground } from './FluidBackground';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses just getting started with customer feedback",
      features: [
        "Up to 1,000 responses/month",
        "Basic analytics & reporting", 
        "Email support",
        "Standard templates",
        "Basic integrations"
      ],
      popular: false,
      cta: "Start free trial",
      gradient: "from-warm-gray-100 to-warm-gray-50"
    },
    {
      name: "Professional", 
      price: "$89",
      period: "/month",
      description: "Advanced features for growing businesses that need powerful insights",
      features: [
        "Up to 10,000 responses/month",
        "Advanced AI analytics",
        "Priority support",
        "Custom branding",
        "Team collaboration",
        "API access",
        "Advanced integrations"
      ],
      popular: true,
      cta: "Start free trial",
      gradient: "from-sunset-50 to-coral-50"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large organizations with complex needs", 
      features: [
        "Unlimited responses",
        "White-label solution",
        "Dedicated success manager",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security",
        "On-premise deployment"
      ],
      popular: false,
      cta: "Contact sales",
      gradient: "from-golden-50 to-sunset-50"
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-warm-gray-50 via-white to-sunset-50/30 dark:from-dark-warm-50 dark:via-dark-warm-100 dark:to-dark-warm-50 overflow-hidden">
      {/* Fluid Background */}
      <FluidBackground />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 text-warm-gray-600 dark:text-dark-warm-600 mb-8">
            <Zap className="w-6 h-6 text-sunset-500" />
            <span className="text-lg font-space font-medium">Simple Pricing</span>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-space font-black text-warm-gray-900 dark:text-dark-warm-900 mb-8 leading-tight">
            Simple,{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 bg-clip-text text-transparent">
                transparent
              </span>
              <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 rounded-full animate-scale-in"></div>
            </span>
            {' '}pricing
          </h2>
          
          <p className="text-2xl lg:text-3xl text-warm-gray-600 dark:text-dark-warm-600 leading-relaxed font-medium max-w-4xl mx-auto">
            Choose the plan that's right for your business.{' '}
            <span className="text-sunset-600 dark:text-sunset-400 font-semibold">Upgrade or downgrade</span>
            {' '}at any time.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`border-0 shadow-xl shadow-warm-gray-900/5 dark:shadow-dark-warm-50/20 relative transition-all duration-500 rounded-3xl overflow-hidden group ${
              plan.popular 
                ? 'ring-4 ring-sunset-500 shadow-2xl shadow-sunset-500/20 scale-105 z-10' 
                : 'hover:shadow-2xl hover:shadow-warm-gray-900/10 dark:hover:shadow-dark-warm-50/30 hover:scale-105'
            } bg-gradient-to-br ${plan.gradient} dark:from-dark-warm-100 dark:to-dark-warm-200`}>
              
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                  <Badge className="bg-gradient-to-r from-sunset-500 to-coral-500 text-white px-8 py-3 text-lg font-space font-bold shadow-lg">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-12">
                <CardTitle className="text-3xl lg:text-4xl font-space font-black text-warm-gray-900 dark:text-dark-warm-900 mb-4">
                  {plan.name}
                </CardTitle>
                
                <div className="mt-8 mb-6">
                  <span className="text-6xl lg:text-7xl font-space font-black text-warm-gray-900 dark:text-dark-warm-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-warm-gray-600 dark:text-dark-warm-600 text-2xl font-medium">
                      {plan.period}
                    </span>
                  )}
                </div>
                
                <CardDescription className="mt-6 text-warm-gray-600 dark:text-dark-warm-600 text-lg font-medium leading-relaxed">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8 px-8 pb-12">
                <ul className="space-y-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                      <span className="text-warm-gray-600 dark:text-dark-warm-600 font-medium text-lg">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full font-bold text-lg py-6 rounded-2xl transition-all duration-300 group ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 hover:from-sunset-600 hover:via-coral-600 hover:to-golden-500 text-white shadow-xl shadow-sunset-500/30 hover:shadow-2xl hover:shadow-sunset-500/50' 
                      : 'bg-warm-gray-900 hover:bg-warm-gray-800 dark:bg-dark-warm-900 dark:hover:bg-dark-warm-800 text-white shadow-lg'
                  }`}
                  onClick={() => navigate('/auth')}
                >
                  <span className="flex items-center justify-center">
                    {plan.cta}
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-20">
          <div className="bg-white/80 dark:bg-dark-warm-100/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-warm-gray-200/50 dark:border-dark-warm-300/50 shadow-lg">
            <p className="text-warm-gray-600 dark:text-dark-warm-600 font-medium text-lg">
              All plans include a <span className="text-sunset-600 dark:text-sunset-400 font-semibold">14-day free trial</span>
              <br />
              No setup fees • Cancel anytime • Full feature access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
